import { Idle } from "idlejs/dist";

let idle = null;

export default function startIdleTracking(store) {
  const minutesUntilLogout = +store.state.settings.data.auto_sign_out || 60;

  idle = new Idle()
    .whenNotInteractive()
    .within(minutesUntilLogout)
    .do(() => {
      store.dispatch("logout", {
        code: 101
      });
      idle.stop();
    })
    .start();
}
