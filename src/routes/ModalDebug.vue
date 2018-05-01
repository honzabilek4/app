<template>
  <div class="modal-debug">
    <label>
      Title
      <v-input v-model="title" />
    </label>

    <label>
      Confirm button text
      <v-input v-model="confirmText" />
    </label>

    <label>
      Cancel button text
      <v-input v-model="cancelText" />
    </label>

    <v-button class="button" @click="alert = true">ALERT</v-button>
    <v-button class="button" @click="confirm = true">CONFIRM</v-button>
    <v-button class="button" @click="prompt = true">PROMPT</v-button>

    <p>Prompt entered text: {{ promptText }}</p>

    <v-alert v-if="alert" :message="title" :confirmText="confirmText" @confirm="alert = false" />
    <v-confirm v-if="confirm" :message="title" :cancelText="cancelText" :confirmText="confirmText" @confirm="confirm = false" @cancel="confirm = false" />
    <v-prompt
      v-if="prompt"
      v-model="promptText"
      :message="title"
      :cancelText="cancelText"
      :confirmText="confirmText"
      required
      @confirm="prompt = false"
      @cancel="prompt = false" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      alert: false,
      confirm: false,
      prompt: false,
      title: "Are you sure you want to log out?",
      confirmText: "Yes",
      cancelText: "Cancel",
      promptText: "I love Directus!"
    };
  }
};
</script>

<style scoped>
.modal-debug {
  padding: var(--page-padding);
}

.button,
label {
  margin: 30px 0;
}
</style>
