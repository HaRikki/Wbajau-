/**
 * PUBLIC SITE CONFIG (optional)
 * -----------------------------------------------------------------
 * The Admin Panel saves to the browser's LocalStorage, so edits only
 * show on the device where you made them. To make your edits visible
 * to EVERY visitor after you deploy:
 *
 *   1. Open the site, tap the logo 5 times, log in to Admin
 *   2. Make your changes, press Save
 *   3. Admin -> Backup -> Export  (downloads a .json file)
 *   4. Open that .json, copy ALL of it, and replace `null` below:
 *        window.__REMOTE_CONFIG__ = { ...paste here... };
 *   5. Redeploy (git push) — everyone now sees your settings.
 *
 * Tip: keep logos / background / music as files in /assets and use
 * their paths (e.g. "assets/logo/logo.jpg") instead of uploading from
 * Admin, so this file stays small.
 *
 * Leave as `null` to use the built-in defaults from js/storage.js.
 */
window.__REMOTE_CONFIG__ = null;
