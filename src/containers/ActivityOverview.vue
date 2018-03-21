<template>
  <div class="activity-overview">
    <div class="tabs">
      <button
        :class="{active: show === 'both'}"
        @click="show = 'both'">{{ $t('both') }}</button>
      <button
        :class="{active: show === 'comments'}"
        @click="show = 'comments'">{{ $t('comments') }}</button>
      <button
        :class="{active: show === 'activity'}"
        @click="show = 'activity'">{{ $t('activity') }}</button>
    </div>
    <div class="activity">
      <article
        v-for="item in activity"
        :key="item.id">
        <i
          v-if="item.message"
          class="material-icons">message</i>
        <span
          v-else
          :title="item.action"
          :class="item.action"
          class="indicator" />
        <details>
          <summary>
            {{ item.name }}
            <span>•</span>
            <timeago
              :since="item.date"
              :locale="$i18n.locale"
              class="date" />
          </summary>
          <p>
            {{ item }}
          </p>
        </details>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: 'activity-overview',
  props: {
    collection: {
      type: String,
      required: true,
    },
    primaryKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      show: 'both',
      data: null,
      error: null,
      loading: false,
    };
  },
  computed: {
    activity() {
      switch (this.show) {
        case 'comments':
          return this.data.filter(item => item.message !== null);
        case 'activity':
          return this.data.filter(item => item.message === null);
        case 'both':
        default:
          return this.data;
      }
    },
  },
  watch: {
    collection() {
      this.getActivity();
    },
    primaryKey() {
      this.getActivity();
    },
  },
  created() {
    this.getActivity();
  },
  methods: {
    getActivity() {
      this.loading = true;

      this.$api.getActivity({
        'filter[collection][eq]': this.collection,
        'filter[item][eq]': this.primaryKey,
        fields: 'action,datetime,message,user.first_name,user.last_name',
        sort: '-datetime',
      })
        .then(res => res.data)
        .then(data => data.map(this.formatItem))
        .then((data) => {
          this.error = null;
          this.data = data;
          this.loading = false;
        })
        .catch((err) => {
          this.error = err;
          this.loading = false;
        });
    },
    formatItem(item) {
      const date = this.$helpers.date.sqlToDate(item.datetime);
      const name = `${item.user.first_name} ${item.user.last_name}`;
      return {
        date,
        name,
        action: item.action.toLowerCase(),
        message: item.message,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  margin: -20px -20px 20px;
  display: flex;
  height: 50px;

  button {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-basis: 20px;
    position: relative;
    border-bottom: 1px solid var(--lightest-gray);
    overflow: visible;

    &::after {
      content: '';
      display: block;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--primary);
      position: absolute;
      transform: scaleY(0);
      transition: transform var(--fast) var(--transition-out);
      transform-origin: center;
    }

    &.active {
      border-color: var(--primary);
    }

    &.active::after {
      transition: transform var(--fast) var(--transition-in);
      transform: scaleY(1);
    }
  }
}

.activity {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 6px;
    height: 100%;
    width: 1px;
    background-color: var(--lightest-gray);
    z-index: -1;
  }

  .indicator {
    position: relative;
    top: 1px;
    display: inline-block;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px solid;
    background-color: var(--white);
    box-shadow: 0 0 0 5px var(--white);
    flex-shrink: 0;

    &.update { border-color: var(--primary) }
    &.delete { border-color: var(--danger) }
    &.create { border-color: var(--success) }
  }

  article {
    display: flex;
    margin-bottom: 40px;
  }

  details {
    margin-left: 10px;

    summary {
      cursor: pointer;
      list-style-type: none;

      &::-webkit-details-marker {
        display: none;
      }

      span, .date {
        color: var(--light-gray);
      }

      span {
        margin: 0 5px;
      }
    }

    > *:not(:first-child) {
      margin-top: 10px;
    }
  }
}
</style>
