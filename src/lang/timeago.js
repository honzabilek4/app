import Vue from "vue";
import VueTimeago from "vue-timeago";

function requireAll(requireContext) {
  const keys = requireContext.keys();

  return keys.reduce((acc, val) => {
    acc[val.substr(2, 5)] = requireContext(val);
    return acc;
  }, {});
}

const locales = requireAll(
  require.context("vue-timeago/locales", true, /\.json$/)
);

Vue.use(VueTimeago, {
  locale: "en-US", // default language
  locales
});
