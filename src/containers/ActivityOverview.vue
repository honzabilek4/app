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
        v-for="(activity, index) in activityWithChanges"
        :key="activity.id">
        <i
          v-if="activity.message && activity.type === 'message'"
          class="material-icons">message</i>
        <span
          v-else
          :title="activity.action"
          :class="activity.action"
          class="indicator" />

        <div class="content">
          <details v-if="activity.action !== 'external'">
            <summary>{{ activity.name }}<span>•</span><timeago
              :auto-update="1"
              :since="activity.date"
              :locale="$i18n.locale"
              class="date" /></summary>
            <div v-if="activity.changes">
              <div
                v-for="({ field, before, after }) in activity.changes"
                class="change"
                :key="field.field">
                <p>{{ field.name }}</p>
                <div class="diff">
                  <div
                    :class="{ empty: !before }"
                    class="before">{{ before || '--' }}</div>
                  <div
                    :class="{ empty: !after }"
                    class="after">{{ after || '--' }}</div>
                </div>
              </div>
              <button
                v-if="index !== 0"
                class="revert"
                @click="previewing = activity">{{ $t("revert") }}</button>
            </div>
          </details>
          <p v-if="activity.message">{{ activity.message }}</p>
        </div>
      </article>
    </div>
    <v-modal
      v-if="previewing !== null"
      :title="$t('preview_and_rollback')"
      :ok="$t('revert')"
      @confirm="revert"
      @close="previewing = null">
      <edit-form
        :fields="fields"
        :values="previewing.revision.data"
        :readonly="true"
        :collection="collection" />
    </v-modal>
  </div>
</template>

<script>
import EditForm from "./EditForm.vue";

export default {
  name: "activity-overview",
  components: {
    EditForm
  },
  props: {
    collection: {
      type: String,
      required: true
    },
    primaryKey: {
      type: String,
      required: true
    },
    fields: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: "both",
      data: null,
      error: null,
      loading: false,
      revisions: {},
      revisionsLoading: true,
      previewing: null
    };
  },
  computed: {
    activity() {
      if (!this.data) return [];

      switch (this.show) {
        case "comments":
          return this.data.filter(item => item.message !== null);
        case "activity":
          return this.data.filter(item => item.message === null);
        case "both":
        default:
          return this.data;
      }
    },
    activityWithChanges() {
      if (!this.activity || this.activity.length === 0) return [];

      const activityWithChanges = this.activity.map((activity, i) => ({
        ...activity,
        changes: this.getChanges(activity.id, i),
        revision: this.revisions[activity.id]
      }));

      const lastItem = activityWithChanges[activityWithChanges.length - 1];

      if (lastItem.action.toLowerCase() !== "add") {
        activityWithChanges.push({
          action: "external",
          message: this.$t("activity_outside_directus")
        });
      }

      return activityWithChanges;
    }
  },
  watch: {
    collection() {
      this.hydrate();
    },
    primaryKey() {
      this.hydrate();
    }
  },
  created() {
    this.hydrate();
  },
  methods: {
    hydrate() {
      this.loading = true;
      this.revisionsLoading = true;
      this.error = null;
      this.data = null;
      this.revisions = {};
      this.previewing = null;

      this.$api
        .getActivity({
          "filter[collection][eq]": this.collection,
          "filter[item][eq]": this.primaryKey,
          fields:
            "id,action,type,datetime,message,user.first_name,user.last_name",
          sort: "-datetime"
        })
        .then(res => res.data)
        .then(data => data.map(this.formatItem))
        .then(data => {
          this.error = null;
          this.data = data;
          this.loading = false;
        })
        .catch(err => {
          this.error = err;
          this.loading = false;
          console.error(err);
        });

      this.$api
        .getItemRevisions(this.collection, this.primaryKey)
        .then(res => res.data)
        .then(revisions => {
          this.revisionsLoading = false;
          this.revisions = this.$lodash.keyBy(revisions, "activity");
        })
        .catch(console.error);
    },
    formatItem(item) {
      const date = new Date(item.datetime);
      const name = `${item.user.first_name} ${item.user.last_name}`;
      return {
        id: item.id,
        date,
        name,
        action: item.action.toLowerCase(),
        type: item.type.toLowerCase(),
        message: item.message
      };
    },
    getChanges(activityID, index) {
      const revision = this.revisions[activityID];

      if (!revision) return null;

      let previousUpdate = null;

      for (let i = index + 1; i < this.activity.length; i++) {
        if (
          this.activity[i].action === "update" ||
          this.activity[i].action === "add"
        ) {
          previousUpdate = this.activity[i];
          break;
        }
      }

      if (!previousUpdate) return null;

      const previousRevision = this.revisions[previousUpdate.id];
      const previousData = previousRevision.data;
      const currentDelta = revision.delta;

      return this.$lodash.mapValues(currentDelta, (value, field) => ({
        before: previousData[field],
        after: value,
        field: this.fields[field]
      }));
    },
    revert() {
      this.$api
        .revert(this.collection, this.primaryKey, this.previewing.revision.id)
        .then(() => {
          this.previewing = null;
          this.$emit("reload");
          this.hydrate();
        })
        .catch(console.error);
    }
  }
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
      content: "";
      display: block;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: var(--action);
      position: absolute;
      transform: scaleY(0);
      transition: transform var(--fast) var(--transition-out);
      transform-origin: center;
    }

    &.active {
      border-color: var(--action);
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
    content: "";
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

    &.update {
      border-color: var(--action);
    }
    &.delete {
      border-color: var(--danger);
    }
    &.add {
      border-color: var(--success);
    }
    &.external {
      border-color: var(--gray);
    }
  }

  i.material-icons {
    width: 13px;
    background-color: var(--white);
    font-size: 20px;
    transform: translateX(-2px);
    height: 20px;
  }

  article {
    display: flex;
    margin-bottom: 40px;
  }

  .content {
    margin-left: 10px;
    flex-grow: 1;

    summary {
      cursor: pointer;
      list-style-type: none;

      &::-webkit-details-marker {
        display: none;
      }

      span,
      .date {
        color: var(--light-gray);
      }

      span {
        margin: 0 5px;
      }
    }

    > *:not(:first-child) {
      margin-top: 10px;
    }

    .change {
      width: 100%;

      p {
        margin-bottom: 10px;
      }

      .diff {
        width: 100%;
        border-radius: var(--border-radius);
        overflow: hidden;

        > div {
          width: 100%;
          padding: 4px;
        }
      }

      .before {
        color: var(--danger);
        background-color: #fdefed;
      }

      .after {
        color: var(--success);
        background-color: #f6faf0;
      }

      .empty {
        background-color: var(--lightest-gray);
        color: var(--gray);
      }
    }

    .revert {
      color: var(--action);
      margin-top: 20px;
    }
  }
}
</style>
