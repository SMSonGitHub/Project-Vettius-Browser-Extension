//import buffer from 'buffer';
// import { Buffer } from './node_modules/buffer';

const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      resolve(result['openai-key']);
    });
  });
};

// //return a buffer of the encoded string
// const encode = (input) => {

//   return Buffer.toString(input, "base64");

// };

const encode = (input) => {
  return btoa(input);
};


const saveKey = () => {
  const input = document.getElementById('key_input');

  if (input) {
    const { value } = input;

    // Encode String
    const encodedValue = encode(value);

    // Save to google storage
    chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
      document.getElementById('key_needed').style.display = 'none';
      document.getElementById('key_entered').style.display = 'block';
    });
  }
  
};

const changeKey = () => {
  document.getElementById('key_needed').style.display = 'block';
  document.getElementById('key_entered').style.display = 'none';
};


var heatSlider = document.getElementById("tempRange");
var output = document.getElementById("tempNum");
output.innerHTML = heatSlider.value;

//updates the value on screen as the slider is moved
heatSlider.oninput = function() {
  output.innerHTML= this.value;
}

var wordSlider = document.getElementById("wordCount");
var countOutput = document.getElementById("wordCt");
countOutput.innerHTML = wordSlider.value;

wordSlider.oninput = function() {
  countOutput.innerHTML= this.value;
}

document.getElementById('save_key_button').addEventListener('click', saveKey);
document.getElementById('change_key_button').addEventListener('click', changeKey);

  checkForKey().then((response) => {
    if (response) {
      document.getElementById('key_needed').style.display = 'none';
      document.getElementById('key_entered').style.display = 'block';
    }
  });


  export {checkForKey, saveKey, changeKey}