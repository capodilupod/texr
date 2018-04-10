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

//Global boolean for whether or not the glossary is currently active.
var help_shown = false;

//Requires: None.
//Modifies: None.
//Effects: Shows or hides the help text.
function showHelpInfo() {
  help_shown = !help_shown;
   if (help_shown) {
	  document.getElementById('help_info').style.display = "block";
	  document.getElementById('help').value = "Hide Help";
   }
   else {
	  document.getElementById('help_info').style.display = "none";
	  document.getElementById('help').value = "Help";
   }
   
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

//Required: None.
//Modifies: Text field.
//Effects: Places selected symbol into the text box.
function clickToReplace(termToReplace) {
  var textBox = document.getElementById("latex");
  textBox.value = textBox.value  + termToReplace;

  if (glossary_shown){
	  showGlossary();
  }

  textBox.focus();
}

function replaceWithEnter() {
  var textBox = document.getElementById("latex");
  var textIn = textBox.value;
  var lastBackSlash = textIn.lastIndexOf("\\");
  var replacementValue = textIn.substring(lastBackSlash);
  textBox.value = textIn.substring(0, lastBackSlash) + replacementValue;
  textBox.focus();
}

function tabComplete() {
  var textBox = document.getElementById("latex");
  var topSuggestion = document.getElementById("top_suggestion");
  var textIn = textBox.value;
  var backSlashOfOrig = textIn.lastIndexOf("\\");
  var pre = textIn.substring(0, backSlashOfOrig);

  var forReplace = topSuggestion.textContent;
  var startPos = forReplace.lastIndexOf(":") + 2;
  var replace = forReplace.substring(startPos);
  textBox.value = pre + replace;
  textBox.focus();
}

//Global variable containing all characters and replacements.
//Format as "\\COMMAND ": "\uXXXX ", where XXXX is the unicode.
//Try to keep in alphabetical order.
const REPLACE_CHARS = {
  "\\aleph ": "\u2135 ",
  "\\and ": "\u2227 ",
  "\\arrow_left ": "\u2190 ",
  "\\arrow_up ": "\u2191 ",
  "\\arrow_right ": "\u2192 ",
  "\\arrow_down ": "\u2193 ",
  "\\complement ": "\u2201 ",
  "\\complex_set ": "\u2102 ",
  "\\cubert ": "\u221B ",
  "\\definition ": "\u2254 ",
  "\\division_obelus ": "\u00F7 ",
  "\\double_integral ": "\u222C ",
  "\\e ": "\u2147 ",
  "\\empty_set ": "\u2205 ",
  "\\existential_quantifier ": "\u2203 ",
  "\\for_all ": "\u2200 ",
  "\\greek_lowercase_alpha ": "\u03B1 ",
  "\\greek_lowercase_beta ": "\u03B2 ",
  "\\greek_lowercase_gamma ": "\u03B3 ",
  "\\greek_lowercase_delta ": "\u03B4 ",
  "\\greek_lowercase_epsilon ": "\u03B5 ",
  "\\greek_lowercase_zeta ": "\u03B6 ",
  "\\greek_lowercase_eta ": "\u03B7 ",
  "\\greek_lowercase_theta ": "\u03B8 ",
  "\\greek_lowercase_iota ": "\u03B9 ",
  "\\greek_lowercase_kappa ": "\u03BA ",
  "\\greek_lowercase_lambda ": "\u03BB ",
  "\\greek_lowercase_mu ": "\u03BC ",
  "\\greek_lowercase_nu ": "\u03BD ",
  "\\greek_lowercase_xi ": "\u03BE ",
  "\\greek_lowercase_omicron ": "\u03BF ",
  "\\greek_lowercase_pi ": "\u03C0 ",
  "\\greek_lowercase_rho ": "\u03C1 ",
  "\\greek_lowercase_stigma ": "\u03C2 ",
  "\\greek_lowercase_sigma ": "\u03C3 ",
  "\\greek_lowercase_tau ": "\u03C4 ",
  "\\greek_lowercase_upsilon ": "\u03C5 ",
  "\\greek_lowercase_phi ": "\u03C6 ",
  "\\greek_lowercase_chi ": "\u03C7 ",
  "\\greek_lowercase_psi ": "\u03C8 ",
  "\\greek_lowercase_omega ": "\u03C9 ",
  "\\greek_uppercase_alpha ": "\u0391 ",
  "\\greek_uppercase_beta ": "\u0392 ",
  "\\greek_uppercase_gamma ": "\u0393 ",
  "\\greek_uppercase_delta ": "\u0394 ",
  "\\greek_uppercase_epsilon ": "\u0395 ",
  "\\greek_uppercase_zeta ": "\u0396 ",
  "\\greek_uppercase_eta ": "\u0397 ",
  "\\greek_uppercase_theta ": "\u0398 ",
  "\\greek_uppercase_iota ": "\u0399 ",
  "\\greek_uppercase_kappa ": "\u039A ",
  "\\greek_uppercase_lambda ": "\u039B ",
  "\\greek_uppercase_mu ": "\u039C ",
  "\\greek_uppercase_nu ": "\u039D ",
  "\\greek_uppercase_xi ": "\u039E ",
  "\\greek_uppercase_omicron ": "\u039F ",
  "\\greek_uppercase_pi ": "\u03A0 ",
  "\\greek_uppercase_rho ": "\u03A1 ",
  "\\greek_uppercase_stigma ": "\u03DA ",
  "\\greek_uppercase_sigma ": "\u03A3 ",
  "\\greek_uppercase_tau ": "\u03A4 ",
  "\\greek_uppercase_upsilon ": "\u03A5 ",
  "\\greek_uppercase_phi ": "\u03A6 ",
  "\\greek_uppercase_chi ": "\u03A7 ",
  "\\greek_uppercase_psi ": "\u03A8 ",
  "\\greek_uppercase_omega ": "\u03A9 ",
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
  "\\proportional_to ": "\u221D",
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
  "\\4rt ": "\u221C "

};


String.prototype.replaceAt=function(index, replacement) {
   return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

var switchvar = "";

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
  if ((textValue.match(/\^\S+(\s|\_)/g))) {
	  for (var i = textValue.indexOf('^') + 1; i < textValue.length; ++i)
	  {
		 if (textValue.charAt(i) == '0') {
			switchvar = "\u2070";
		 }
		 else if (textValue.charAt(i) == '1') {
			switchvar = "\u00b9";
		 }
		 else if (textValue.charAt(i) == '2') {
			switchvar = "\u00b2";
		 }
		 else if (textValue.charAt(i) == '3') {
			switchvar = "\u00b3";
		 }
		 else if (textValue.charAt(i) == '4') {
			switchvar = "\u2074";
		 }
		 else if (textValue.charAt(i) == '5') {
			switchvar = "\u2075";
		 }
		 else if (textValue.charAt(i) == '6') {
			switchvar = "\u2076";
		 }
		 else if (textValue.charAt(i) == '7') {
			switchvar = "\u2077";
		 }
		 else if (textValue.charAt(i) == '8') {
			switchvar = "\u2078";
		 }
		 else if (textValue.charAt(i) == '9') {
			switchvar = "\u2079";
		 }
		 else if (textValue.charAt(i) == '+') {
			switchvar = "\u207A";
		 }
		 else if (textValue.charAt(i) == '-') {
			switchvar = "\u207B";
		 }
		 else if (textValue.charAt(i) == '=') {
			switchvar = "\u207C";
		 }
		 else if (textValue.charAt(i) == '(') {
			switchvar = "\u207D";
		 }
		 else if (textValue.charAt(i) == ')') {
			switchvar = "\u207E";
		 }
		 else if (textValue.charAt(i) == 'n') {
			switchvar = "\u207F";
		 }
		 else if (textValue.charAt(i) == ' ' || '_') {
			break;
		 }
		 else {
			switchvar = textValue.charAt(i);
		 }
		 textValue = textValue.substr(0, i) + switchvar + textValue.substr(i + 1, textValue.length);
	  }
	  textValue = textValue.substr(0, textValue.indexOf('^')) + textValue.substr(textValue.indexOf('^') + 1, textValue.length);
	  //textValue = textValue.substr(0, textValue.indexOf('{')) + textValue.substr(textValue.indexOf('{') + 1, textValue.length);
	  //textValue = textValue.substr(0, textValue.indexOf('}')) + textValue.substr(textValue.indexOf('}') + 1, textValue.length);
	  for (var i = 0; i < 5; ++i)
	   {
		 sug.childNodes[2*i + 1].innerText = "";
	   }
  }
  else if ((textValue.match(/\_\S+(\s|\^)/g))) {
	  for (var i = textValue.indexOf('_') + 1; i < textValue.length; ++i)
	  {
		 if (textValue.charAt(i) == '0') {
			switchvar = "\u2080";
		 }
		 else if (textValue.charAt(i) == '1') {
			switchvar = "\u2081";
		 }
		 else if (textValue.charAt(i) == '2') {
			switchvar = "\u2082";
		 }
		 else if (textValue.charAt(i) == '3') {
			switchvar = "\u2083";
		 }
		 else if (textValue.charAt(i) == '4') {
			switchvar = "\u2084";
		 }
		 else if (textValue.charAt(i) == '5') {
			switchvar = "\u2085";
		 }
		 else if (textValue.charAt(i) == '6') {
			switchvar = "\u2086";
		 }
		 else if (textValue.charAt(i) == '7') {
			switchvar = "\u2087";
		 }
		 else if (textValue.charAt(i) == '8') {
			switchvar = "\u2088";
		 }
		 else if (textValue.charAt(i) == '9') {
			switchvar = "\u2089";
		 }
		 else if (textValue.charAt(i) == '+') {
			switchvar = "\u208A";
		 }
		 else if (textValue.charAt(i) == '-') {
			switchvar = "\u208B";
		 }
		 else if (textValue.charAt(i) == '=') {
			switchvar = "\u208C";
		 }
		 else if (textValue.charAt(i) == '(') {
			switchvar = "\u208D";
		 }
		 else if (textValue.charAt(i) == ')') {
			switchvar = "\u208E";
		 }
		 else if (textValue.charAt(i) == ' ' || '^') {
			break;
		 }
		 else {
			switchvar = textValue.charAt(i);
		 }
		 textValue = textValue.substr(0, i) + switchvar + textValue.substr(i + 1, textValue.length);
	  }
	  textValue = textValue.substr(0, textValue.indexOf('_')) + textValue.substr(textValue.indexOf('_') + 1, textValue.length);
	  //textValue = textValue.substr(0, textValue.indexOf('{')) + textValue.substr(textValue.indexOf('{') + 1, textValue.length);
	  //textValue = textValue.substr(0, textValue.indexOf('}')) + textValue.substr(textValue.indexOf('}') + 1, textValue.length);
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
  const glossary_button = document.getElementById("glossary");
  const copy_to_clipboard_button = document.getElementById("copy_to_clipboard");
  const help_button = document.getElementById("help");
  const latex_input = document.getElementById("latex");
  const suggestions = document.getElementById("suggestions");
  const glossary_terms = document.getElementById("glossary_terms");

  glossary_terms.addEventListener('click', function(e) {
	  var replacementValue = e.target.innerHTML.substring(e.target.innerHTML.length - 1, e.target.innerHTML.length);
	  latex_input.value += replacementValue;
	  window.scrollTo(0, 0);
  });
  suggestions.addEventListener('click', function(e) {
	  var textBox = document.getElementById("latex");
	  var textIn = textBox.value;
	  var lastBackSlash = textIn.lastIndexOf("\\");
	  var replacementValue = e.target.innerHTML.substring(e.target.innerHTML.length - 2, e.target.innerHTML.length);
	  textBox.value = textIn.substring(0, lastBackSlash) + replacementValue;
	  textBox.focus();
	  for (var i = 0; i < 5; ++i)
	  {
		 suggestions.childNodes[2*i + 1].innerText = "";
	  }
  });
  glossary_button.addEventListener('click', function() { showGlossary(); });
  copy_to_clipboard_button.addEventListener('click', function() { copyToClipboard(); });
  help_button.addEventListener('click', function() { showHelpInfo(); });
  latex_input.addEventListener('keydown', function(e) {
	  if (e.keyCode == 13) {
		 replaceWithEnter();
	  }
  });

  latex_input.addEventListener('keydown', function(e) {
    if (e.keyCode == 9) {
      e.preventDefault();
      e.stopPropagation();
      tabComplete();
    }
  });


  latex_input.onkeydown = () => {
	// setTimeout hack so that we can get updated value of text input
	setTimeout(() => {
	  const newValue = latex_input.value;
	  const processedValue = insertLatexChars(newValue);
	  latex_input.value = processedValue;
	}, 0);
  }
});


/*
  // Creating listeners for all buttons in glossary. Very repetitive and inefficient
  // but was having trouble otherwise.
  const aleph_button = document.getElementById("aleph");
  const and_button = document.getElementById("and");
  const complement_button = document.getElementById("complement");
  const complex_set_button = document.getElementById("complex_set");
  const cubert_button = document.getElementById("cubert");
  const definition_button = document.getElementById("definition");
  const double_integral_button = document.getElementById("double_integral");
  const e_button = document.getElementById("e");
  const empty_set_button = document.getElementById("empty_set");
  const existential_quantifier_button = document.getElementById("existential_quantifier");
  const for_all_button = document.getElementById("for_all");
  const i_button = document.getElementById("i");
  const iff_button = document.getElementById("iff");
  const implies_button = document.getElementById("implies");
  const in_button = document.getElementById("in");
  const infinity_button = document.getElementById("infinity");
  const integer_set_button = document.getElementById("integer_set");
  const integral_button = document.getElementById("integral");
  const intersect_button = document.getElementById("intersect");
  const nand_button = document.getElementById("nand");
  const natural_set_button = document.getElementById("natural_set");
  const nor_button = document.getElementById("nor");
  const not_button = document.getElementById("not");
  const not_in_button = document.getElementById("not_in");
  const not_equal_button = document.getElementById("not_equal");
  const not_proper_subset_button = document.getElementById("not_proper_subset");
  const not_proper_superset_button = document.getElementById("not_proper_superset");
  const not_subset_button = document.getElementById("not_subset");
  const not_superset_button = document.getElementById("not_superset");
  const or_button = document.getElementById("or");
  const pi_button = document.getElementById("pi");
  const power_set_button = document.getElementById("power_set");
  const product_button = document.getElementById("product");
  const proper_subset_button = document.getElementById("proper_subset");
  const proper_superset_button = document.getElementById("proper_superset");
  const rational_set_button = document.getElementById("rational_set");
  const real_set_button = document.getElementById("real_set");
  const square_root_button = document.getElementById("square_root");
  const sqrt_button = document.getElementById("sqrt");
  const subset_button = document.getElementById("subset");
  const sum_button = document.getElementById("sum");
  const superset_button = document.getElementById("superset");
  const there_exists_button = document.getElementById("there_exists");
  const triple_integral_button = document.getElementById("triple_integral");
  const union_button = document.getElementById("union");
  const universal_quantifier = document.getElementById("universal_quantifier");
  const xor_button = document.getElementById("xor");
  const four_rt_button = document.getElementById("4rt");
  const super_0_button = document.getElementById("^0");
  const super_1_button = document.getElementById("^1");
  const super_2_button = document.getElementById("^2");
  const super_3_button = document.getElementById("^3");
  const super_4_button = document.getElementById("^4");
  const super_5_button = document.getElementById("^5");
  const super_6_button = document.getElementById("^6");
  const super_7_button = document.getElementById("^7");
  const super_8_button = document.getElementById("^8");
  const super_9_button = document.getElementById("^9");
  const super_plus_button = document.getElementById("^+");
  const super_minus_button = document.getElementById("^-");
  const super_equal_button = document.getElementById("^=");
  const super_left_paren_button = document.getElementById("^(");
  const super_right_paren_button = document.getElementById("^)");
  const super_n_button = document.getElementById("^n");
  const sub_0_button = document.getElementById("_0");
  const sub_1_button = document.getElementById("_1");
  const sub_2_button = document.getElementById("_2");
  const sub_3_button = document.getElementById("_3");
  const sub_4_button = document.getElementById("_4");
  const sub_5_button = document.getElementById("_5");
  const sub_6_button = document.getElementById("_6");
  const sub_7_button = document.getElementById("_7");
  const sub_8_button = document.getElementById("_8");
  const sub_9_button = document.getElementById("_9");
  const sub_plus_button = document.getElementById("_+");
  const sub_minus_button = document.getElementById("_-");
  const sub_equals_button = document.getElementById("_=");
  const sub_left_paren_button = document.getElementById("_(");
  const sub_right_paren_button = document.getElementById("_)");

  aleph_button.addEventListener('click', function() { clickToReplace("\u2135"); });
  and_button.addEventListener('click', function() { clickToReplace("\u2227"); });
  complement_button.addEventListener('click', function() { clickToReplace("\u2201"); });
  complex_set_button.addEventListener('click', function() { clickToReplace("\u2102"); });
  cubert_button.addEventListener('click', function() { clickToReplace("\u221B"); });
  definition_button.addEventListener('click', function() { clickToReplace("\u2254"); });
  double_integral_button.addEventListener('click', function() { clickToReplace("\u222C"); });
  e_button.addEventListener('click', function() { clickToReplace("\u2147"); });
  empty_set_button.addEventListener('click', function() { clickToReplace("\u2205"); });
  existential_quantifier.addEventListener('click', function() { clickToReplace("\u2203"); });
  for_all_button.addEventListener('click', function() { clickToReplace("\u2200"); });
  i_button.addEventListener('click', function() { clickToReplace("\u2148"); });
  iff_button.addEventListener('click', function() { clickToReplace("\u2194"); });
  implies_button.addEventListener('click', function() { clickToReplace("\u2192"); });
  in_button.addEventListener('click', function() { clickToReplace("\u2208"); });
  infinity_button.addEventListener('click', function() { clickToReplace("\u221E"); });
  integer_set_button.addEventListener('click', function() { clickToReplace("\u2124"); });
  integral_button.addEventListener('click', function() { clickToReplace("\u222b"); });
  intersect_button.addEventListener('click', function() { clickToReplace("\u2229"); });
  nand_button.addEventListener('click', function() { clickToReplace("\u22BC"); });
  natural_set_button.addEventListener('click', function() { clickToReplace("\u2155"); });
  nor_button.addEventListener('click', function() { clickToReplace("\u22BD"); }); 
  not_button.addEventListener('click', function() { clickToReplace("\u00AC"); });
  not_in_button.addEventListener('click', function() { clickToReplace("\u2209"); });
  not_equal_button.addEventListener('click', function() { clickToReplace("\u2260"); });
  not_proper_subset_button.addEventListener('click', function() { clickToReplace("\u2248"); });
  not_proper_superset_button.addEventListener('click', function() { clickToReplace("\u2285"); });
  not_subset_button.addEventListener('click', function() { clickToReplace("\u2288"); });
  not_superset_button.addEventListener('click', function() { clickToReplace("\u2289"); });
  or_button.addEventListener('click', function() { clickToReplace("\u2228"); });
  pi_button.addEventListener('click', function() { clickToReplace("\u03C0"); });
  power_set_button.addEventListener('click', function() { clickToReplace("\u2118"); });
  product_button.addEventListener('click', function() { clickToReplace("\u220F"); });
  proper_subset_button.addEventListener('click', function() { clickToReplace("\u2282"); });
  proper_superset_button.addEventListener('click', function() { clickToReplace("\u2283"); });
  rational_set_button.addEventListener('click', function() { clickToReplace("\u211A"); });
  real_set_button.addEventListener('click', function() { clickToReplace("\u211D"); });
  square_root_button.addEventListener('click', function() { clickToReplace("\u221A"); });
  sqrt_button.addEventListener('click', function() { clickToReplace("\u221A"); });
  subset_button.addEventListener('click', function() { clickToReplace("\u2286"); });
  sum_button.addEventListener('click', function() { clickToReplace("\u2211"); });
  superset_button.addEventListener('click', function() { clickToReplace("\u2287"); });
  there_exists_button.addEventListener('click', function() { clickToReplace("\u2203"); });
  triple_integral_button.addEventListener('click', function() { clickToReplace("\u222D"); });
  union_button.addEventListener('click', function() { clickToReplace("\u222A"); });
  universal_quantifier.addEventListener('click', function() { clickToReplace("\u2200"); });
  xor_button.addEventListener('click', function() { clickToReplace("\u2995"); });
  four_rt_button.addEventListener('click', function() { clickToReplace("\u221C"); });
  super_0_button.addEventListener('click', function() { clickToReplace("\u2070"); });
  super_1_button.addEventListener('click', function() { clickToReplace("\u00b9"); });
  super_2_button.addEventListener('click', function() { clickToReplace("\u00b2"); });
  super_3_button.addEventListener('click', function() { clickToReplace("\u00b3"); });
  super_4_button.addEventListener('click', function() { clickToReplace("\u2074"); });
  super_5_button.addEventListener('click', function() { clickToReplace("\u2075"); });
  super_6_button.addEventListener('click', function() { clickToReplace("\u2076"); });
  super_7_button.addEventListener('click', function() { clickToReplace("\u2077"); });
  super_8_button.addEventListener('click', function() { clickToReplace("\u2078"); });
  super_9_button.addEventListener('click', function() { clickToReplace("\u2079"); });
  super_plus_button.addEventListener('click', function() { clickToReplace("\u207A"); });
  super_minus_button.addEventListener('click', function() { clickToReplace("\u207B"); });
  super_equal_button.addEventListener('click', function() { clickToReplace("\u207C"); });
  super_left_paren_button.addEventListener('click', function() { clickToReplace("\u207D"); });
  super_right_paren_button.addEventListener('click', function() { clickToReplace("\u207E"); });
  super_n_button.addEventListener('click', function() { clickToReplace("\u207F"); });
  sub_0_button.addEventListener('click', function() { clickToReplace("\u2080"); });
  sub_1_button.addEventListener('click', function() { clickToReplace("\u2081"); });
  sub_2_button.addEventListener('click', function() { clickToReplace("\u2082"); });
  sub_3_button.addEventListener('click', function() { clickToReplace("\u2083"); });
  sub_4_button.addEventListener('click', function() { clickToReplace("\u2084"); });
  sub_5_button.addEventListener('click', function() { clickToReplace("\u2085"); });
  sub_6_button.addEventListener('click', function() { clickToReplace("\u2086"); });
  sub_7_button.addEventListener('click', function() { clickToReplace("\u2087"); });
  sub_8_button.addEventListener('click', function() { clickToReplace("\u2088"); });
  sub_9_button.addEventListener('click', function() { clickToReplace("\u2089"); });
  sub_plus_button.addEventListener('click', function() { clickToReplace("\u208A"); });
  sub_minus_button.addEventListener('click', function() { clickToReplace("\u208B"); });
  sub_equals_button.addEventListener('click', function() { clickToReplace("\u208C"); });
  sub_left_paren_button.addEventListener('click', function() { clickToReplace("\u208D"); });
  sub_right_paren_button.addEventListener('click', function() { clickToReplace("\u208E"); });
  */