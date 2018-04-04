//Texr extension copyright Texr Team 2018.
//Requires: Files in the Texr Extension folder.
//Modifies: None.
//Effects: Initializes the extension window.
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

//Requires: None.
//Modifies: None.
//Effects: Shows or hides the help text.
function helpButton() {
   //Use '\' to begin typing a command.
   //    Arrow keys or Click on suggestion to autofill
   //    TODO NOT YET IMPLEMENTED
   //Click the glossary button to see a list of available commands.
   //    Click on the suggestion to automatically insert
   //    TODO ABOVE FEATURE NOT YET IMPLEMENTED
   //    (Possibly use arrow keys as well?)
   //^ controls superscript 0-9, +, =, (, ) supported
   //    ^{X} allows multiple superscript with one replace
   //    TODO ABOVE FEATURE NOT YET IMPLEMENTED
   //_ controls subscript 0-9, +, =, (, ) supported
   //    _{X} allows multiple subscript with one replace
   //    TODO ABOVE FEATURE NOT YET IMPLEMENTED
}

//Global boolean for whether or not the glossary is currently active.
var glossary_shown = false;

//Requires: None.
//Modifies: None.
//Effects: Shows or hides glossary depending on above global.
function showGlossary() {
   glossary_shown = !glossary_shown;
   if (glossary_shown) {
      document.getElementById('glossary_terms').style.display = "block";
      document.getElementById('glossary').value = "Hide Glossary";
   }
   else {
      document.getElementById('glossary_terms').style.display = "none";
      document.getElementById('glossary').value = "Show Glossary";
   }
}

//Required: Text in the text field.
//Modifies: None.
//Effects: Copies the text from the text field into the clipboard.
function copyToClipboard() {
  var copyText = document.getElementById("latex");
  copyText.select();
  document.execCommand("Copy");
}

//TODO modify this to work with more than just aleph
function clickToReplace() {
  var termToReplace = document.getElementById("click_to_replace");
  var textBox = document.getElementById("latex");
  var str = termToReplace.value;
  var pos = str.indexOf(": ") + 2;
  var replacement = str.substring(pos);
  textBox.value = textBox.value + replacement;
  if (glossary_shown){
      showGlossary();
  }
  textBox.focus();
}

//Global variable containing all characters and replacements.
//Format as "\\COMMAND ": "\uXXXX ", where XXXX is the unicode.
//Try to keep in alphabetical order.
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
  "\\existential_quantifier ": "\u2203 ",
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
  "\\universal_quantifier ": "\u2200 ",
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

//Requries: String of current text input.
//Modifies: Text in the text input, swaps command string for unicode.
//Effects: Text field now contains replaced command.
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
  }
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
  const copyToClipboardButton = document.getElementById("copy_to_clipboard");
  const clickToReplaceButton = document.getElementById("click_to_replace");

  glossaryButton.addEventListener('click', function() { showGlossary(); });
  copyToClipboardButton.addEventListener('click', function() { copyToClipboard(); });
  clickToReplaceButton.addEventListener('click', function() { clickToReplace(); });
  
  latexInput.onkeydown = () => {
    // setTimeout hack so that we can get updated value of text input
    setTimeout(() => {
      const newValue = latexInput.value;
      const processedValue = insertLatexChars(newValue);
      latexInput.value = processedValue;
    }, 0);
  }
});
