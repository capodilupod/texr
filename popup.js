// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  });
}

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedBackgroundColor(url, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
  var items = {};
  items[url] = color;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);
}

const REPLACE_CHARS = {
  /*Set Notation*/
  "\\union ": "\u222A ",
  "\\intersect ": "\u2229 ",
  "\\complex_set ": "\u2102 ",
  "\\real_set ": "\u211D ",
  "\\rational_set ": "\u211A ",
  "\\integer_set ": "\u2124 ",
  "\\natural_set ": "\u2115 ",
  "\\empty_set ": "\u2205 ",
  "\\aleph ": "\u2135 ",
  "\\in ": "\u2208 ",
  "\\not_in ": "\u2209 ",
  "\\proper_subset ": "\u2282 ",
  "\\proper_superset ": "\u2283 ",
  "\\not_proper_subset ": "\u2284 ",
  "\\not_proper_superset ": "\u2285 ",
  "\\subset ": "\u2286 ",
  "\\superset ": "\u2287 ",
  "\\not_subset ": "\u2288 ",
  "\\not_superset ": "\u2289 ",
  "\\complement ": "\u2201 ",
  "\\power_set ": "\u2118 ",
  /*Logic Notation*/
  "\\implies ": "\u2192 ",
  "\\iff ": "\u2194 ",
  "\\not ": "\u00AC ",
  "\\and ": "\u2227 ",
  "\\nand ": "\u22BC ",
  "\\or ": "\u2228 ",
  "\\nor ": "\u22BD ",
  "\\xor ": "\u2295 ",
  "\\for_all ": "\u2200 ",
  "\\there_exists ": "\u2203 ",
  "\\definition ": "\u2254 ",
  "\\not_equal ": "\u2260 ",
  /*Calculus Notation*/
  "\\sum ": "\u2211 ",
  "\\product ": "\u220F ",
  "\\integral ": "\u222b ",
  "\\double_integral ": "\u222C ",
  "\\triple_integral ": "\u222D ",
  "\\square_root ": "\u221A ",
  "\\infinity ": "\u221E ",
  "\\sqrt ": "\u221A ",
  "\\cubert ": "\u221B ",
  "\\4rt ": "\u221C ",
  "\\pi ": "\u03C0 ",
  "\\i ": "\u2148 ",
  "\\e ": "\u2147 ",
  /*Superscript and Subscript*/
  "^0 ": "\u2070 ",
  "^1 ": "\u00b9 ",
  "^2 ": "\u00b2 ",
  "^3 ": "\u00b3 ",
  "^4 ": "\u2074 ",
  "^5 ": "\u2075 ",
  "^6 ": "\u2076 ",
  "^7 ": "\u2077 ",
  "^8 ": "\u2078 ",
  "^9 ": "\u2079 ",
  "^+ ": "\u207A ",
  "^- ": "\u207B ",
  "^= ": "\u207C ",
  "^( ": "\u207D ",
  "^) ": "\u207E ",
  "^n ": "\u207F ",
  "_0 ": "\u2080 ",
  "_1 ": "\u2081 ",
  "_2 ": "\u2082 ",
  "_3 ": "\u2083 ",
  "_4 ": "\u2084 ",
  "_5 ": "\u2085 ",
  "_6 ": "\u2086 ",
  "_7 ": "\u2087 ",
  "_8 ": "\u2088 ",
  "_9 ": "\u2089 ",
  "_+ ": "\u208A ",
  "_- ": "\u208B ",
  "_= ": "\u208C ",
  "_( ": "\u208D ",
  "_) ": "\u208E"

  //"\\ ": "\u ",
};

// Input: string of current text input
// Output: string of current text input with characters replaced with
//          special characters
function insertLatexChars(currentTextValue) {
  let textValue = currentTextValue;
  for (const entry of Object.entries(REPLACE_CHARS)) {
    const toReplace = entry[0];
    const replacement = entry[1];
    textValue = textValue.replace(toReplace, replacement);
  }
  return textValue;
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {
  const latexInput = document.getElementById("latex");
  /*if (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT')
  {
    const latexInput = document.activeElement;
  }*/
  latexInput.onkeydown = () => {
    // setTimeout hack so that we can get updated value of text input
    setTimeout(() => {
      const newValue = latexInput.value;
      const processedValue = insertLatexChars(newValue);
      latexInput.value = processedValue;
    }, 0);
  }
});
