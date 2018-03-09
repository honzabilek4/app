import Vue from 'vue';
import Spinner from 'vue-simple-spinner';

import HeaderButton from './components/HeaderButton.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import FormInput from './components/form/Input.vue';
import FormButton from './components/form/Button.vue';
import FormSelect from './components/form/Select.vue';
import FormCheckbox from './components/form/Checkbox.vue';

Vue.component('header-button', HeaderButton);
Vue.component('breadcrumb', Breadcrumb);
Vue.component('form-input', FormInput);
Vue.component('form-button', FormButton);
Vue.component('form-select', FormSelect);
Vue.component('form-checkbox', FormCheckbox);
Vue.component('spinner', Spinner);
