const selectElement = document.querySelector('#source');
const branch = document.querySelector('.d-branch');
const comment = document.querySelector('.d-comment');
const jsonkeyIn = document.querySelector('#jsonkey-in');
const jsonkeyOut = document.querySelector('.d-jsonkey-output');

var makeBranch = function (str) {
  if (!str) return '';
  let s = str.trim();
  const ticketMatch = s.match(/#(\d+)/);
  const ticket = ticketMatch ? ticketMatch : '';
  s = s.replace(/#\d+/, '').trim();
  s = s
    .replaceAll('#', '').replaceAll('>', '').replaceAll('(', '').replaceAll(')', '')
    .replaceAll('+', '').replaceAll('"', '').replaceAll("'", '').replaceAll('\t', '')
    .replaceAll(',', '').replaceAll(':', '').replaceAll('.', '').replaceAll('[', '')
    .replaceAll(']', '').replaceAll('\\', '').replaceAll('/', '');
  s = s.replace(/\s+/g, '-').toLowerCase();
  return ticket ? `${ticket}-${s}` : s;
};

var makeComment = function(str) {
  if (!str) return '';
  let strOutcome = str.trim();
  const type = document.querySelector('.d-type');
  const ticketMatch = strOutcome.match(/#(\d+)/);
  const ticket = ticketMatch ? ticketMatch : '';
  strOutcome = strOutcome.replace(/#\d+/, '').trim();
  const prefix = ticket ? `${type.value}(#${ticket}):` : `${type.value}:`;
  return `${prefix} ${strOutcome}`;
}

var makeJSONKey = function(str) {
  if (!str) return '';
  let tmpStrUpper = str.trim();
  tmpStrUpper = tmpStrUpper.replaceAll(' ', '_').toUpperCase();
  let tmpStrClient = str.trim().replaceAll(' ', '-').toLowerCase();
  tmpStrUpper = '\"' + tmpStrUpper + '\": \"' + upperCaseWords(str) + '\"'
  tmpStrClient = '\"' + tmpStrClient + '\": \"' + str.toLowerCase() + '\"'
  return tmpStrUpper + '\n' + tmpStrClient;
}

var makeOutput = function(event) {
  let inputStr = '';
  if (event.type === 'paste') {
    inputStr = (event.clipboardData || window.clipboardData).getData("text");
  } else {
    inputStr = event.target.value;
  }
  // Changed to .value for textarea support
  branch.value = makeBranch(inputStr);
  comment.value = makeComment(inputStr);
};

var makeJSONKeyOutput = function(event) {
  let inputStr = '';
  if (event.type === 'paste') {
    inputStr = (event.clipboardData || window.clipboardData).getData("text");
  } else {
    inputStr = event.target.value;
  }
  // Changed to .value for textarea support
  jsonkeyOut.value = makeJSONKey(inputStr);
};

selectElement.addEventListener('change', makeOutput);
selectElement.addEventListener('paste', makeOutput);
selectElement.addEventListener('keyup', makeOutput);

jsonkeyIn.addEventListener('change', makeJSONKeyOutput);
jsonkeyIn.addEventListener('paste', makeJSONKeyOutput);
jsonkeyIn.addEventListener('keyup', makeJSONKeyOutput);

// Attached to window so HTML onclick="copyBranch()" works
window.copyBranch = async function() {
  try {
    await navigator.clipboard.writeText(branch.value);
    console.log('Content copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

window.copyComment = async function() {
  try {
    await navigator.clipboard.writeText(comment.value);
    console.log('Content copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

window.copyJSONKey = async function() {
  try {
    await navigator.clipboard.writeText(jsonkeyOut.value);
    console.log('Content copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

function upperCaseWords(inStr) {
    let words = inStr.split(' ');
    let uppercasedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    let outStr = uppercasedWords.join(' ');
    return outStr;
}
