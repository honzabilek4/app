<docs>
  See: https://snook.ca/archives/html_and_css/hiding-content-for-accessibility

  The prop is named htmlFor because `for` is a reserved word in JS
</docs>

<template>
  <label
    :for="htmlFor"
    class="invisible-label"><slot /></label>
</template>

<script>
export default {
  name: 'invisible-label',
  props: {
    htmlFor: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
label {
  position: absolute !important;
  height: 1px; width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: polygon(0px 0px, 0px 0px,0px 0px, 0px 0px);
}
</style>
