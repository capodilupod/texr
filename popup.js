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


function showGlossary() {
   document.getElementById('glossary_terms').style.display = "block";
   document.getElementById('glossary').style.display = "none";
}

function hideGlossary() {
   document.getElementById('glossary_terms').style.display = "none";
   document.getElementById('glossary').style.display = "block";
}

function copyToClipboard() {
  var copyText = document.getElementById("latex");
  copyText.select();
  document.execCommand("Copy");
}

function clickToReplace() {
  var termToReplace = document.getElementById("click_to_replace");
  var textBox = document.getElementById("latex");

  var str = termToReplace.value;
  var pos = str.indexOf(": ") + 2;
  var replacement = str.substring(pos);

  textBox.value = textBox.value + replacement;

  document.getElementById('glossary_terms').style.display = "none";
  document.getElementById('glossary').style.display = "block";

  textBox.focus();

}

const REPLACE_CHARS = {
  "\\aleph ": "\u2135 ",
  "\\and ": "\u2227 ",
  "\\complement ": "\u2201 ",
  "\\complex_set ": "\u2102 ",
  "\\cubert ": "\u221B ",
  "\\definition ": "\u2254 ",
  "\\double_integral ": "\u222C ",
  "\\e ": "\u2147 ",
  "\\empty_set ": "\u2205 ",
  "\\for_all ": "\u2200 ",
  "\\i ": "\u2148 ",
  "\\iff ": "\u2194 ",
  "\\implies ": "\u2192 ",
  "\\in ": "\u2208 ",
  "\\infinity ": "\u221E ",
  "\\integer_set ": "\u2124 ",
  "\\integral ": "\u222b ",
  "\\intersect ": "\u2229 ",
  "\\nand ": "\u22BC ",
  "\\natural_set ": "\u2115 ",
  "\\nor ": "\u22BD ",
  "\\not ": "\u00AC ",
  "\\not_in ": "\u2209 ",
  "\\not_equal ": "\u2260 ",
  "\\not_proper_subset ": "\u2284 ",
  "\\not_proper_superset ": "\u2285 ",
  "\\not_subset ": "\u2288 ",
  "\\not_superset ": "\u2289 ",
  "\\or ": "\u2228 ",
  "\\pi ": "\u03C0 ",
  "\\power_set ": "\u2118 ",
  "\\product ": "\u220F ",
  "\\proper_subset ": "\u2282 ",
  "\\proper_superset ": "\u2283 ",
  "\\rational_set ": "\u211A ",
  "\\real_set ": "\u211D ",
  "\\square_root ": "\u221A ",
  "\\sqrt ": "\u221A ",
  "\\subset ": "\u2286 ",
  "\\sum ": "\u2211 ",
  "\\superset ": "\u2287 ",
  "\\there_exists ": "\u2203 ",
  "\\triple_integral ": "\u222D ",
  "\\union ": "\u222A ",
  "\\xor ": "\u2295 ",
  "\\4rt ": "\u221C ",
  "^0": "\u2070",
  "^1": "\u00b9",
  "^2": "\u00b2",
  "^3": "\u00b3",
  "^4": "\u2074",
  "^5": "\u2075",
  "^6": "\u2076",
  "^7": "\u2077",
  "^8": "\u2078",
  "^9": "\u2079",
  "^+": "\u207A",
  "^-": "\u207B",
  "^=": "\u207C",
  "^(": "\u207D",
  "^)": "\u207E",
  "^n": "\u207F",
  "_0": "\u2080",
  "_1": "\u2081",
  "_2": "\u2082",
  "_3": "\u2083",
  "_4": "\u2084",
  "_5": "\u2085",
  "_6": "\u2086",
  "_7": "\u2087",
  "_8": "\u2088",
  "_9": "\u2089",
  "_+": "\u208A",
  "_-": "\u208B",
  "_=": "\u208C",
  "_(": "\u208D",
  "_)": "\u208E"

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
  
  var tempString = "";
  var increment = 0;
  var sug = document.getElementById("suggestions");
  if ((textValue.match(/\\\S+/g))){
    tempString = (textValue.match(/\\\S+/g)[0]);
    for (const entry of Object.entries(REPLACE_CHARS)) {
      if (entry[0].indexOf(tempString.substr(1,)) != -1)
      {
        sug.childNodes[2*increment + 1].innerText = (entry[0] + ': ' + entry[1]).toString();
        increment++;
      }
      if (increment == 5)
      {
        break;
      }
    }
    for (var i = increment; i < 5; ++i)
    {
      sug.childNodes[2*i + 1].innerText = "";
    }
  } //Test string: \in and a \int \asdf \integer_set \integral io
  else
  {
    for (var i = 0; i < 5; ++i)
    {
      sug.childNodes[2*i + 1].innerText = "";
    }
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
  const glossaryButton = document.getElementById("glossary");
  const hideGlossaryButton = document.getElementById("hide_glossary");
  const copyToClipboardButton = document.getElementById("copy_to_clipboard");
  const clickToReplaceButton = document.getElementById("click_to_replace");

  glossaryButton.addEventListener('click', function() {
        showGlossary();
  });
  hideGlossaryButton.addEventListener('click', function() {
        hideGlossary();
  });
  copyToClipboardButton.addEventListener('click', function() {
        copyToClipboard();
  });
  clickToReplaceButton.addEventListener('click', function() {
        clickToReplace();
  });
  
  latexInput.onkeydown = () => {
    // setTimeout hack so that we can get updated value of text input
    setTimeout(() => {
      const newValue = latexInput.value;
      const processedValue = insertLatexChars(newValue);
      latexInput.value = processedValue;
    }, 0);
  }
});
