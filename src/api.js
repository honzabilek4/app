import SDK, { getPayload } from "directus-sdk-javascript/remote";
import store from "./store";

const client = new SDK();

const storedToken = store.state.auth.token;
const storedUrl = store.state.auth.url;
const payload = storedToken ? getPayload(storedToken) : null;

if (payload && storedUrl) {
  const timeDiff = payload.exp.getTime() - Date.now();
  if (timeDiff > 10000) {
    client.url = storedUrl;
    client.token = storedToken;
  } else {
    store.dispatch("clearAuth");
  }
}

client.onAutoRefreshSuccess = function refresh(info) {
  store.dispatch("refresh", info);
};

client.onAutoRefreshError = function logout(error) {
  store.dispatch("logout", error);
};

client.startInterval();

export default client;
