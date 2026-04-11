const selectElement = document.querySelector('#source');
const branch = document.querySelector('.d-branch');
const comment = document.querySelector('.d-comment');
const jsonkeyIn = document.querySelector('#jsonkey-in');
const jsonkeyOut = document.querySelector('.d-jsonkey-output');

//Daniel Reznick.
var makeBranch = function (str) {
  if (!str) return '';
  let s = str.trim();
  const ticketMatch = s.match(/#(\d+)/);
  const ticket = ticketMatch ? ticketMatch[1] : '';
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
  const ticket = ticketMatch ? ticketMatch[1] : '';
  strOutcome = strOutcome.replace(/#\d+/, '').trim();
  const prefix = ticket ? `${type.value}(#${ticket}):` : `${type.value}:`;
  return `${prefix} ${strOutcome}`;
}

var makeJSONKey = function(str) {
  if (!str) return '';
  let tmpStrUpper = str.trim().replaceAll(' ', '_').toUpperCase();
  let tmpStrClient = str.trim().replaceAll(' ', '-').toLowerCase();
  tmpStrUpper = '\"' + tmpStrUpper + '\": \"' + upperCaseWords(str) + '\"'
  tmpStrClient = '\"' + tmpStrClient + '\": \"' + str.toLowerCase() + '\"'
  return tmpStrUpper + '\n' + tmpStrClient;
}

// Logic wrapped in a 0ms timeout to let the browser finish the "paste"
var makeOutput = function() {
  setTimeout(() => {
    const inputStr = selectElement.value;
    branch.value = makeBranch(inputStr);
    comment.value = makeComment(inputStr);
  }, 0);
};

var makeJSONKeyOutput = function() {
  setTimeout(() => {
    const inputStr = jsonkeyIn.value;
    jsonkeyOut.value = makeJSONKey(inputStr);
  }, 0);
};

// Simplified listeners to avoid "double-processing"
selectElement.addEventListener('input', makeOutput);
document.querySelector('.d-type').addEventListener('change', makeOutput);
jsonkeyIn.addEventListener('input', makeJSONKeyOutput);

// Explicitly mapping to window so your HTML onclick works
window.copyBranch = async function() {
  try { await navigator.clipboard.writeText(branch.value); } catch (err) {}
}

window.copyComment = async function() {
  try { await navigator.clipboard.writeText(comment.value); } catch (err) {}
}

window.copyJSONKey = async function() {
  try { await navigator.clipboard.writeText(jsonkeyOut.value); } catch (err) {}
}

function upperCaseWords(inStr) {
    let words = inStr.split(' ');
    let uppercasedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return uppercasedWords.join(' ');
}
