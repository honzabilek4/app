import Vue from "vue";
import handleError from "./error";
const EventBus = new Vue();

Object.defineProperties(EventBus, {
  on: {
    get() {
      return EventBus.$on;
    }
  },
  off: {
    get() {
      return EventBus.$off;
    }
  },
  emit: {
    get() {
      return EventBus.$emit;
    }
  },
  once: {
    get() {
      return EventBus.$once;
    }
  }
});

EventBus.on("error", handleError);

EventBus.install = vue => {
  Object.defineProperty(vue.prototype, "$events", { value: EventBus });
};

export default EventBus;
