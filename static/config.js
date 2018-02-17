/**
 * @fileOverview Global config options for the Directus application
 * @since 7.0.0
 */
(function directusConfig() {
  const config = {
    /**
     * The API to connect to
     *
     * Possible values:
     * null: render an input field for the user to paste the url in
     * {string}: always use this api
     * {array}: Array of objects, provide a name for a nicer output:
     *   [{
     *     name: 'Demo API',
     *     url: 'https://demo.getdirectus.com/api/'
     *   }]
     */
    apiUrl: 'http://local.api2.directus/api/'
  };

  window.__DirectusConfig__ = config; // eslint-disable-line
}());
