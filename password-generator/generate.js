/*!
 * Based on the work of Christian Haensel and Josh Hartman
 * (https://gist.github.com/joshhartman/1507069#file-randompassword-php)
 * Rewritten from PHP 7 to JavaScript and modified slightly
 *
 * Python version: https://gist.github.com/FelisDiligens/8dc343d40cad6f75a621029a52f62cb8
 */

/**
 * Generates a human readable password
 * @param {number} length Password length in characters, defaults to 10
 * @param {boolean} capitalize Whether the first character is uppercase, defaults to true
 * @param {boolean} specialCharacter Whether to include a special character, defaults to true
 * @returns {string} Examples: "Davocha!46", "Xafeeda^17", "Fiethek&04"
 */
const getRandomPassword = (() => {
  "use strict";

  // Credits: https://stackoverflow.com/a/1527820
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Credits: https://stackoverflow.com/a/1026087
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const consonants = [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z",
    "sh",
    "sn",
    "tr",
    "th",
    "ch",
  ];
  const vowels = ["a", "e", "i", "o", "u", "ee", "oo", "ie", "au"];
  const specialCharacters = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "-",
    "+",
    "?",
    "=",
    "~",
  ];

  return function (length = 10, capitalize = true, specialCharacter = true) {
    if (length < 6) {
      throw new Error("Length parameter must be greater than or equal to 6");
    }

    let password = "";
    for (let i = 0; i < Math.floor(length / 2); i++) {
      password += consonants[getRandomInt(0, 24)];
      password += vowels[getRandomInt(0, 8)];
    }

    // Trim to password length. Makes room for a two-digit number on the end:
    password = password.substring(0, length - 2);

    // Add special character:
    if (specialCharacter) {
      password =
        password.substring(0, password.length - 1) +
        specialCharacters[getRandomInt(0, 12)];
    }

    // Add two digits:
    password += getRandomInt(0, 99).toString().padStart(2, "0");

    if (capitalize) {
      password = capitalizeFirstLetter(password);
    }

    return password;
  };
})();
