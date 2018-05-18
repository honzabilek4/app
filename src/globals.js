import Vue from "vue";
import Spinner from "vue-simple-spinner";

import InvisibleLabel from "./components/invisible-label.vue";
import Loader from "./components/loader.vue";
import VAvatar from "./components/avatar.vue";
import VCard from "./components/card.vue";
import VDetails from "./components/details.vue";
import VTable from "./components/table/table.vue";

// Extensions
import VInterface from "./components/extensions/interface/interface.vue";
import VReadonly from "./components/extensions/readonly/readonly.vue";
import VListing from "./components/extensions/listing/listing.vue";
import VListingOptions from "./components/extensions/listing-options/listing-options.vue";

// Form inputs
import VButton from "./components/form-inputs/button.vue";
import VCheckbox from "./components/form-inputs/checkbox.vue";
import VInput from "./components/form-inputs/input.vue";
import VRadio from "./components/form-inputs/radio.vue";
import VSelect from "./components/form-inputs/select.vue";
import VSlider from "./components/form-inputs/slider.vue";
import VTextarea from "./components/form-inputs/textarea.vue";

// Modals
import VAlert from "./components/modals/alert.vue";
import VConfirm from "./components/modals/confirm.vue";
import VModal from "./components/modals/modal.vue";
import VPrompt from "./components/modals/prompt.vue";

// Page Chrome
import VHeaderBar from "./components/header-bar/header-bar.vue";
import VHeaderButton from "./components/header-bar/header-button.vue";
import VInfoSidebar from "./components/sidebars/info-sidebar.vue";

// Extensions
Vue.component("v-interface", VInterface);
Vue.component("v-readonly", VReadonly);
Vue.component("v-listing", VListing);
Vue.component("v-listing-options", VListingOptions);

// Form inputs
Vue.component("v-button", VButton);
Vue.component("v-checkbox", VCheckbox);
Vue.component("v-input", VInput);
Vue.component("v-radio", VRadio);
Vue.component("v-select", VSelect);
Vue.component("v-slider", VSlider);
Vue.component("v-textarea", VTextarea);

// Modals
Vue.component("v-alert", VAlert);
Vue.component("v-confirm", VConfirm);
Vue.component("v-modal", VModal);
Vue.component("v-prompt", VPrompt);

// Page Chrome
Vue.component("v-header-bar", VHeaderBar);
Vue.component("v-header-button", VHeaderButton);
Vue.component("v-info-sidebar", VInfoSidebar);

Vue.component("invisible-label", InvisibleLabel);
Vue.component("loader", Loader);
Vue.component("spinner", Spinner);
Vue.component("v-avatar", VAvatar);
Vue.component("v-card", VCard);
Vue.component("v-details", VDetails);
Vue.component("v-table", VTable);
