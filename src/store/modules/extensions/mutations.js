import { keyBy } from "lodash";
import { SET_INTERFACES, SET_LISTINGS } from "../../mutation-types";

const mutations = {
  [SET_INTERFACES](state, interfaces) {
    state.interfaces = keyBy(interfaces, "id");
  },
  [SET_LISTINGS](state, listings) {
    state.listings = keyBy(listings, "id");
  }
};

export default mutations;
