/**
 * Get the hostname from an url
 * @param  {String} url The URL to extract the hostname from
 * @return {String}     The hostname
 * @see https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
 *
 * @example
 * const url = 'https://api.getdirectus.com/rijks-website?foo=bar'
 * extractHostname(url);
 * // => api.getdirectus.com
 */
export default function extractHostname(url) {
  let hostname;

  if (url.indexOf("://") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  hostname = hostname.split(":")[0];
  hostname = hostname.split("?")[0];

  return hostname;
}
