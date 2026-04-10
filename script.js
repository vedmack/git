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
  s = s.replace(/[#>\(\)\+"'\t,:\.\[\]\\\/]/g, ''); // Simplified regex for cleaning
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
  let tmpStrUpper = str.trim().replaceAll(' ', '_').toUpperCase();
  let tmpStrClient = str.trim().replaceAll(' ', '-').toLowerCase();
  
  tmpStrUpper = '\"' + tmpStrUpper + '\": \"' + upperCaseWords(str) + '\"';
  tmpStrClient = '\"' + tmpStrClient + '\": \"' + str.toLowerCase() + '\"';
  return tmpStrUpper + '\n' + tmpStrClient;
}

var makeOutput = function(event) {
  let inputStr = (event.type === 'paste') 
    ? (event.clipboardData || window.clipboardData).getData("text") 
    : event.target.value;

  branch.value = makeBranch(inputStr); // Use .value for textareas
  comment.value = makeComment(inputStr);
};

var makeJSONKeyOutput = function(event) {
  let inputStr = (event.type === 'paste') 
    ? (event.clipboardData || window.clipboardData).getData("text") 
    : event.target.value;

  jsonkeyOut.value = makeJSONKey(inputStr);
};

// Listeners
selectElement.addEventListener('input', makeOutput); // 'input' covers change/keyup
jsonkeyIn.addEventListener('input', makeJSONKeyOutput);

// Global Copy Functions (Exported to window so HTML onclick works)
window.copyBranch = async function() {
  try {
    await navigator.clipboard.writeText(branch.value);
    console.log('Branch copied');
  } catch (err) { console.error(err); }
}

window.copyComment = async function() {
  try {
    await navigator.clipboard.writeText(comment.value);
    console.log('Comment copied');
  } catch (err) { console.error(err); }
}

window.copyJSONKey = async function() {
  try {
    await navigator.clipboard.writeText(jsonkeyOut.value);
    console.log('JSON Key copied');
  } catch (err) { console.error(err); }
}

function upperCaseWords(inStr) {
    return inStr.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
