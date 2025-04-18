import { apiInitializer } from "discourse/lib/api";

function generateUniqueId(prefix = '', length) {
  const safeChars = 'abcdefghjkmnpqrstvwxyzABCDEFGHJKMNPQRSTVWXYZ23456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return prefix + "_" + Array.from(array, byte => safeChars[byte % safeChars.length]).join('');
}

// This plugin hides the username field from the sign up modal.
// However, because the username field is *required* by discourse, we need to
// generate a random username and set it in the controller.

// This username is never actually used because it would be too easy to
// circumvent this mechanism by unhiding the field and editing it.
// It is only here to pass validation.

export default apiInitializer("1.8.0", (api) => {
  // for the create account modal
  // (remove when Discourse 3.5 is released)
  api.modifyClass("component:modal/create-account", {
    pluginId: "random-usernames",

    init() {
      this._super(...arguments);
      this.accountUsername = generateUniqueId("u", 10);
    }
  });

  // for full page signup
  api.modifyClass("controller:signup", {
    pluginId: "random-usernames",

    init() {
      this._super(...arguments);
      this.accountUsername = generateUniqueId("u", 10);
    }
  });
});
