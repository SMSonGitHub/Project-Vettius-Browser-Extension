const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      resolve(result['openai-key']);
    });
  });
};

const insert = (content) => {
  const elements = document.getElementsByClassName('droid');

if (elements.length === 0) {
  return;
}

const element = elements[0];

const splitContent = content.split('\n');

const pToRemove = element.childNodes[0];
pToRemove.remove();

splitContent.forEach((content) => {
  const p = document.createElement('p');

  if (content === '') {
    const br = document.createElement('br');
    p.appendChild(br);
  } else {
    p.textContent = content;
  }

  // Insert into HTML one at a time
  element.appendChild(p);
});
return true;
}

chrome.runtime.onMessage.addListener(
  // This is the message listener
  (request, sender, sendResponse) => {
    if (request.message === 'inject') {
      const { content } = request;
			
      // Call this insert function
      const result = insert(content);
			
      // If something went wrong, send a failed status
      if (!result) {
        sendResponse({ status: 'failed' });
      }

      sendResponse({ status: 'success' });
    }
  }
);

checkForKey().then((response) => {
  if (response) {
    document.getElementById('key_needed').style.display = 'none';
    document.getElementById('key_entered').style.display = 'block';
  }
});