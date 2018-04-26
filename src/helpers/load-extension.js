/**
 * Load an external script. Appends a <script> to the body to avoid CORS issues
 * @param  {String}   src Location of the file on the web
 * @return {Promise}      Resolves the extension module, rejects loading error
 */
export default function loadExtension(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    function cleanup() {
      script.remove();
      window.__DirectusExtension__ = null; // eslint-disable-line no-underscore-dangle
    }

    function onload() {
      const extensionModule = window.__DirectusExtension__; // eslint-disable-line no-underscore-dangle, max-len
      resolve(extensionModule);
      cleanup();
    }

    function onerror(err) {
      reject(err);
      cleanup();
    }

    script.onload = onload;
    script.onerror = onerror;
    script.src = src;
    document.body.appendChild(script);
  });
}
