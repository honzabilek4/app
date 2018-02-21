import decamelize from 'decamelize';
import capitalize from 'capitalize';
import prepositions from '@rijk/prepositions';
import conjunctions from '@rijk/conjunctions';
import acronyms from '@rijk/acronyms';
import specialCase from '@rijk/special-case';

/**
 * Convert prepositions and conjunctions to lowercase
 *   and special-case cased words
 *
 * @since 7.0.0
 * @param {string} str String to process
 * @returns {string} str Processed string
 */
function handleSpecialWords(str) {
  const lowercaseStr = str.toLowerCase();
  const uppercaseStr = str.toUpperCase();

  if (prepositions.includes(lowercaseStr)) return lowercaseStr;
  if (conjunctions.includes(lowercaseStr)) return lowercaseStr;
  if (acronyms.includes(uppercaseStr)) return uppercaseStr;

  for (let i = 0; i < specialCase.length; i += 1) {
    if (specialCase[i].toLowerCase() === lowercaseStr) return specialCase[i];
  }

  return str;
}

/**
 * Add a space to the accumulator and add the string
 *
 * @since 7.0.0
 * @param {string} acc The accumulator
 * @param {string} str The string to paste after the acc value
 * @returns {string} New accumulator
 */
function combine(acc, str) {
  return `${acc} ${str}`;
}

/**
 * Formats a string to a "pretty" output
 *
 * @since 7.0.0
 * @param {string} name The name to format
 * @param {RegEx} separator=/|s|-|_/g
 * @returns {string} The name formatted pretty
 * @example
 *
 * const safeName = 'comment_metadata';
 *
 * const prettyName = formatName(safeName);
 * // => 'Comment Metadata'
 */
export default function formatName(name, separator = /\s|-|_/g) {
  return decamelize(name)
    .split(separator)
    .map(capitalize)
    .map(handleSpecialWords)
    .reduce(combine);
}
