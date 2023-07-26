// import { Buffer } from '../node_modules/buffer/buffer';
// Buffer = require('buffer').Buffer;

// const getKey = () => {
//   try {
    
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get(['openai-key'], (result) => {
//       if (result['openai-key']) {
//         // const decodedKey is a buffer of the decoded string from the storage
//         const decodedKey = Buffer.toString(result['openai-key'], 'base64');
//         resolve(decodedKey);
//         console.log(decodedKey);
//       }
//     });
//   });
// } catch (error) {
//     console.log(error);
// }
// };

const getKey = () => {

  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      if (result['openai-key']) {
        // const decodedKey is a buffer of the decoded string from the storage
        const decodedKey = atob(result['openai-key']);
        resolve(decodedKey);
        console.log(decodedKey);
      } else{
        reject(''); //rejects if no key is found
      }
    });
  });

};

const sendMessage = (content) => {
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.tabs.sendMessage(
      activeTab,
      { message: 'inject', content },
      (response) => {
        if (response.status === 'failed') {
          console.log('injection failed.');
        }
      }
    );
  });
};

const generate = async (prompt) => {
  // Get your API key from storage
  const key = await getKey();
  const url = 'https://api.openai.com/v1/completions';

  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 750,
      temperature: 0.7, //variable.Value
    }),
  });
	
  // Select the top choice and send back
  const completion = await completionResponse.json();
  console.log(completion);
  return completion.choices.pop();
}

const generateCompletionAction = async (info) => {
  try {
    console.log('Generating...');
    
    const { selectionText } = info;
    const basePromptPrefix = `
      Write me a blog post about Astrology in the style of Vettius Valens with the below title.
			Please make sure the blog post goes in-depth on the topic and shows that the writer did their research.
      Title:
      `;

    const baseCompletion = await generate(
      `${basePromptPrefix}${selectionText}`
    );
      console.log(baseCompletion.text);
      sendMessage(baseCompletion.text);
  } catch (error) {
    console.log(error);
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'context-run',
    title: 'Generate blog post',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);

// export {
//   getKey,
//   generate
//  }