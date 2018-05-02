import store from "./index";
import { STORE_HYDRATED, HYDRATING_FAILED } from "./mutation-types";
import { startPolling } from "./polling";
import startIdleTracking from "../idle";

export default function hydrateStore() {
  return Promise.all([
    store.dispatch("latency"),
    store.dispatch("getMe"),
    store.dispatch("getAllUserListingPreferences"),
    store.dispatch("getCollections"),
    store.dispatch("getSettings"),
    store.dispatch("getAllExtensions"),
    store.dispatch("getBookmarks")
  ])
    .then(() => {
      // Set accent color
      const customColor = store.state.settings.data.color;
      if (customColor) {
        document.documentElement.style.setProperty(
          "--accent",
          `var(--${customColor}-600)`
        );
      }

      store.commit(STORE_HYDRATED);
      startPolling();

      startIdleTracking(store);
    })
    .catch(error => {
      store.commit(HYDRATING_FAILED, error);
    });
}
