// Name: content.js
// Description: Select and send selected text to the extension's background script

// Function to send selected text to the background script
function sendSelectedText() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText !== '') {
      chrome.runtime.sendMessage({ action: 'selectedText', text: selectedText });
    }
  }
  
  // Listen for mouseup events to detect text selection
  document.addEventListener('mouseup', sendSelectedText);
  