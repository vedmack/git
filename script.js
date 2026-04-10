const selectElement = document.querySelector('#source');
const branch = document.querySelector('.d-branch');
const comment = document.querySelector('.d-comment');
const jsonkeyIn = document.querySelector('#jsonkey-in');
const jsonkeyOut = document.querySelector('.d-jsonkey-output');

// Utility to extract ticket number
const getTicket = (str) => {
  const match = str.match(/#(\d+)/);
  return match ? match : ''; // Returns just the digits (e.g., "3070")
};

var makeBranch = function (str) {
  if (!str) return '';
  let s = str.trim();
  const ticket = getTicket(s);

  // Remove ticket and clean special characters
  s = s.replace(/#\d+/, '').trim();
  s = s.replace(/[#>\(\)\+"'\t,:\.\[\]\\\/]/g, ''); 
  s = s.replace(/\s+/g, '-').toLowerCase();
  
  return ticket ? `${ticket}-${s}` : s;
};

var makeComment = function(str) {
  if (!str) return '';
  let strOutcome = str.trim();
  const type = document.querySelector('.d-type');
  const ticket = getTicket(strOutcome);

  strOutcome = strOutcome.replace(/#\d+/, '').trim();
  const prefix = ticket ? `${type.value}(#${ticket}):` : `${type.value}:`;
  
  return `${prefix} ${strOutcome}`;
};

var makeJSONKey = function(str) {
  if (!str) return '';
  let cleanStr = str.trim();
  let tmpStrUpper = cleanStr.replaceAll(' ', '_').toUpperCase();
  let tmpStrClient = cleanStr.replaceAll(' ', '-').toLowerCase();
  
  const line1 = `"${tmpStrUpper}": "${upperCaseWords(cleanStr)}"`;
  const line2 = `"${tmpStrClient}": "${cleanStr.toLowerCase()}"`;
  return line1 + '\n' + line2;
};

var makeOutput = function(event) {
  // Use a slight delay for paste events to ensure value is populated
  setTimeout(() => {
    const inputStr = selectElement.value;
    branch.value = makeBranch(inputStr);
    comment.value = makeComment(inputStr);
  }, 0);
};

var makeJSONKeyOutput = function(event) {
  setTimeout(() => {
    const inputStr = jsonkeyIn.value;
    jsonkeyOut.value = makeJSONKey(inputStr);
  }, 0);
};

// Event Listeners
selectElement.addEventListener('input', makeOutput);
jsonkeyIn.addEventListener('input', makeJSONKeyOutput);

// Global Copy Functions for HTML onclick
window.copyBranch = async function() {
  try {
    await navigator.clipboard.writeText(branch.value);
    console.log('Branch copied: ' + branch.value);
  } catch (err) { console.error('Copy failed', err); }
};

window.copyComment = async function() {
  try {
    await navigator.clipboard.writeText(comment.value);
    console.log('Comment copied: ' + comment.value);
  } catch (err) { console.error('Copy failed', err); }
};

window.copyJSONKey = async function() {
  try {
    await navigator.clipboard.writeText(jsonkeyOut.value);
    console.log('JSON Key copied');
  } catch (err) { console.error('Copy failed', err); }
};

function upperCaseWords(inStr) {
  return inStr.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}
