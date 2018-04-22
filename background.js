var focus;
var newValue;
var processedValue;

var sug = document.createElement("ul");
sug.id = "suggestions";
sug.style.fontSize = "small";
for (var i = 0; i < 10; ++i)
{
	var temp = document.createElement("h1");
	temp.style.fontSize = "small";
	sug.appendChild(document.createElement("h1"));
}
var bod = document.getElementsByTagName("BODY")[0];

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

var prevfocus;

//Texr extension copyright Texr Team 2018.
//Requires: Files in the Texr Extension folder.
//Modifies: None.
//Effects: Initializes the extension window.
setInterval(function () {
	focus = document.querySelector(":focus");
	try
	{
		if (focus.id == "suggestions")
			focus = prevfocus;
		if (focus != prevfocus)
		{
			document.getElementById("suggestions").parentElement.removeChild(sug);
			//console.log("Successfully removed suggestions from previous element.")
		}
		if (document.getElementById("suggestions") == null)
		{
			focus.parentElement.parentElement.appendChild(sug);
			//console.log("Successfully added suggestions.")
			try
			{
				document.getElementById("suggestions").style.fontSize = "small";
				document.getElementById("suggestions").addEventListener('click', function(e)
				{
					var textBox = focus;
					try
					{
						var textIn = textBox.value;
					}
					catch(err)
					{
						var textIn = textBox.innerHTML.replace("&nbsp;", " ");
					}
					var lastBackSlash = textIn.lastIndexOf("\\");
					var replacementValue = e.target.innerHTML.substring(e.target.innerHTML.length - 2, e.target.innerHTML.length);
					try
					{
						textBox.value = textIn.substring(0, lastBackSlash) + replacementValue;
					}
					catch(err)
					{
						textBox.innerText = textIn.substring(0, lastBackSlash) + replacementValue;
					}
					placeCaretAtEnd(focus);
					for (var i = 0; i < 5; ++i)
					{
					 sug.childNodes[i].innerText = "";
			  		}
	  			});
			}
			catch(err)
			{
				console.log(err);
			}
		}
	}
	catch(err)
	{
		//console.log("Could not add/remove suggestions.");
	}
	prevfocus = focus;
	//console.log(focus.contentEditable);
	//alert(focus ? focus.id + ';' + focus.type + ';' + focus.role + ';' + focus.innerHTML + ';' + focus.innerText : "none");
}, 10);

document.body.onkeyup = function(e)
{
    if(e.keyCode == 32 || e.keyCode == 13)// || (e.keyCode == 189) || (e.keyCode == 54))
    {
        if (focus != null)
		{
			try
			{
				newValue = focus.value;
				processedValue = insertLatexChars(newValue);
				//console.log(newValue + ';' + processedValue);
				focus.value = processedValue;
			}
			catch(err)
			{
				newValue = focus.innerHTML;
				newValue = newValue.replace("&nbsp;", " ");
				processedValue = insertLatexChars(newValue);
				focus.innerHTML = processedValue + "&nbsp;";
				//focus.innerHTML = focus.innerHTML.replace("  ", " ");
				focus.innerHTML = focus.innerHTML.replace(" &nbsp;", "&nbsp;");
				focus.innerHTML = focus.innerHTML.replace("&nbsp;&nbsp;", "&nbsp;");
				if (e.keyCode == 189 || e.keyCode == 54)
					focus.innerHTML = focus.innerHTML.replace("&nbsp;", "");
				placeCaretAtEnd(focus);
				//alert(newValue + ';' + processedValue);
			}
			finally
			{
				for (var i = 0; i < 5; ++i)
				{
					sug.childNodes[i].innerText = "";
				}
			}
	    }
	}
	else
	{
		suggest(focus.innerHTML.replace("&nbsp;", " "));
	}
	//else if (e.keyCode == )
}

function suggest(currentTextValue)
{
	let textValue = currentTextValue;
	var tempString = "";
	var increment = 0;
	if ((textValue.match(/\\\S+/g)))
	{
		tempString = (textValue.match(/\\\S+/g)[0]);
		for (const entry of Object.entries(REPLACE_CHARS))
		{
			if (entry[0].indexOf(tempString.substr(1,)) != -1)
			{
				sug.childNodes[increment].innerText = (entry[0] + ': ' + entry[1]).toString();
				//console.log(sug.childNodes[increment]);
				increment++;
				//console.log(increment);
			}
			if (increment == 5)
			{
				break;
			}
		}
		for (var i = increment; i < 10; ++i)
		{
			sug.childNodes[i].innerText = "";
		}
	}
}

//Global variable containing all characters and replacements.
//Format as "\\COMMAND ": "\uXXXX ", where XXXX is the unicode.
//Try to keep in alphabetical order.
const REPLACE_CHARS = {
  "\\aleph ": "\u2135 ",
  "\\and ": "\u2227 ",
  "\\angle ": "\u2220 ",
  "\\arrow_left ": "\u2190 ",
  "\\arrow_up ": "\u2191 ",
  "\\arrow_right ": "\u2192 ",
  "\\arrow_down ": "\u2193 ",
  "\\asterisk_operator ": "\u2217 ",
  "\\complement ": "\u2201 ",
  "\\complex_set ": "\u2102 ",
  "\\cubert ": "\u221B ",
  "\\definition ": "\u2254 ",
  "\\degree ": "\u00B0 ",
  "\\division_obelus ": "\u00F7 ",
  "\\dot ": "\u22C5 ",
  "\\double_integral ": "\u222C ",
  "\\double_prime ": "\u2033 ",
  "\\e_constant ": "\u2147 ",
  "\\empty_set ": "\u2205 ",
  "\\existential_quantifier ": "\u2203 ",
  "\\for_all ": "\u2200 ",
  "\\gradient ": "\u2207 ",
  "\\i_constant ": "\u2148 ",
  "\\iff ": "\u2194 ",
  "\\implies ": "\u2192 ",
  "\\in ": "\u2208 ",
  "\\infinity ": "\u221E ",
  "\\integer_set ": "\u2124 ",
  "\\integral ": "\u222b ",
  "\\intersect ": "\u2229 ",
  "\\measured_angle ": "\u2221 ",
  "\\minus_plus ": "\u2213 ",
  "\\multiplication_sign ": "\u00D7 ",
  "\\nand ": "\u22BC ",
  "\\natural_set ": "\u2115 ",
  "\\nonexistential_quantifier ": "\u2204 ",
  "\\nor ": "\u22BD ",
  "\\not ": "\u00AC ",
  "\\not_in ": "\u2209 ",
  "\\not_equal ": "\u2260 ",
  "\\not_proper_subset ": "\u2284 ",
  "\\not_proper_superset ": "\u2285 ",
  "\\not_subset ": "\u2288 ",
  "\\not_superset ": "\u2289 ",
  "\\or ": "\u2228 ",
  "\\partial_derivative ": "\u2202 ",
  "\\pi_constant ": "\u03C0 ",
  "\\plus_minus ": "\u00B1 ",
  "\\power_set ": "\u2118 ",
  "\\prime ": "\u2032 ",
  "\\or ": "\u2228 ",
  "\\or ": "\u2228 ",
  "\\perpendicular_to ": "\u27C2 ",
  "\\product ": "\u220F ",
  "\\proper_subset ": "\u2282 ",
  "\\proper_superset ": "\u2283 ",
  "\\proportional_to ": "\u221D ",
  "\\rational_set ": "\u211A ",
  "\\real_set ": "\u211D ",
  "\\right_angle ": "\u221F ",
  "\\spherical_angle ": "\u2223 ",
  "\\square_root ": "\u221A ",
  "\\sqrt ": "\u221A ",
  "\\subset ": "\u2286 ",
  "\\sum ": "\u2211 ",
  "\\superset ": "\u2287 ",
  "\\there_exists ": "\u2203 ",
  "\\there_does_not_exist ": "\u2204 ",
  "\\triple_integral ": "\u222D ",
  "\\triple_prime ": "\u2034 ",
  "\\union ": "\u222A ",
  "\\universal_quantifier ": "\u2200 ",
  "\\xor ": "\u2295 ",
  "\\4rt ": "\u221C ",
  "\\alpha ": "\u03B1 ",
  "\\beta ": "\u03B2 ",
  "\\gamma ": "\u03B3 ",
  "\\delta ": "\u03B4 ",
  "\\epsilon ": "\u03B5 ",
  "\\zeta ": "\u03B6 ",
  "\\eta ": "\u03B7 ",
  "\\theta ": "\u03B8 ",
  "\\iota ": "\u03B9 ",
  "\\kappa ": "\u03BA ",
  "\\lambda ": "\u03BB ",
  "\\mu ": "\u03BC ",
  "\\nu ": "\u03BD ",
  "\\xi ": "\u03BE ",
  "\\omicron ": "\u03BF ",
  "\\pi ": "\u03C0 ",
  "\\rho ": "\u03C1 ",
  "\\stigma ": "\u03C2 ",
  "\\sigma ": "\u03C3 ",
  "\\tau ": "\u03C4 ",
  "\\upsilon ": "\u03C5 ",
  "\\phi ": "\u03C6 ",
  "\\chi ": "\u03C7 ",
  "\\psi ": "\u03C8 ",
  "\\omega ": "\u03C9 ",
  "\\alpha_upper ": "\u0391 ",
  "\\beta_upper ": "\u0392 ",
  "\\gamma_upper ": "\u0393 ",
  "\\delta_upper ": "\u0394 ",
  "\\epsilon_upper ": "\u0395 ",
  "\\zeta_upper ": "\u0396 ",
  "\\eta_upper ": "\u0397 ",
  "\\theta_upper ": "\u0398 ",
  "\\iota_upper ": "\u0399 ",
  "\\kappa_upper ": "\u039A ",
  "\\lambda_upper ": "\u039B ",
  "\\mu_upper ": "\u039C ",
  "\\nu_upper ": "\u039D ",
  "\\xi_upper ": "\u039E ",
  "\\omicron_upper ": "\u039F ",
  "\\pi_upper ": "\u03A0 ",
  "\\rho_upper ": "\u03A1 ",
  "\\stigma_upper ": "\u03DA ",
  "\\sigma_upper ": "\u03A3 ",
  "\\tau_upper ": "\u03A4 ",
  "\\upsilon_upper ": "\u03A5 ",
  "\\phi_upper ": "\u03A6 ",
  "\\chi_upper ": "\u03A7 ",
  "\\psi_upper ": "\u03A8 ",
  "\\omega_upper ": "\u03A9 "

};

//Requries: String of current text input.
//Modifies: Text in the text input, swaps command string for unicode.
//Effects: Text field now contains replaced command.
function insertLatexChars(currentTextValue) {
	let textValue = currentTextValue;

	for (const entry of Object.entries(REPLACE_CHARS))
	{
		const toReplace = entry[0];
		const replacement = entry[1];
		textValue = textValue.replace(toReplace, replacement);
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
		 else if (textValue.charAt(i) == 'o') {
			switchvar = "\u00B0";
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
	  for (var i = 0; i < 5; ++i)
	   {
		 sug.childNodes[i].innerText = "";
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
	  for (var i = 0; i < 5; ++i)
	   {
		 sug.childNodes[i].innerText = "";
	   }
  }
  return textValue;
}

document.addEventListener('DOMContentLoaded', () => {
  const latex_input = focus;
  //const suggestions = document.getElementById("suggestions");
  sug.addEventListener('click', function(e) {
	  var textBox = latex_input;
	  var textIn = textBox.value;
	  var lastBackSlash = textIn.lastIndexOf("\\");
	  var replacementValue = e.target.innerHTML.substring(e.target.innerHTML.length - 2, e.target.innerHTML.length);
	  textBox.value = textIn.substring(0, lastBackSlash) + replacementValue;
	  textBox.focus();
	  for (var i = 0; i < 5; ++i)
	  {
		 suggestions.childNodes[i].innerText = "";
	  }
  });
  document.addEventListener('keydown', function(e) {
	  if (e.keyCode == 13) {
		 replaceWithEnter();
	  }
  });

  document.addEventListener('keydown', function(e) {
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