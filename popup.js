// Name: popup.js 
// Description: Linked with popup.html to redirect to the respective page

//---------------Manage Button-----------
document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('addButton');
  
    generateButton.addEventListener('click', function () {
      chrome.tabs.create({ url: 'manage.html' });
    });
  });
  

//-----------------New Note-----------------
document.addEventListener('DOMContentLoaded', function () {
  const generateButton = document.getElementById('newNoteButton');

  generateButton.addEventListener('click', function () {
    chrome.tabs.create({ url: 'manage.html' });
  });
});

//-----------------New Tab-----------------
document.addEventListener('DOMContentLoaded', function () {
  const generateButton = document.getElementById('niceTabButton');

  generateButton.addEventListener('click', function () {
    chrome.tabs.create({ url: 'newtab.html' });
  });
});

//-------------OCR Tool--------------
document.addEventListener('DOMContentLoaded', function () {
  const convertBtn = document.getElementById('convertBtn');
  const imageInput = document.getElementById('imageInput');
  const resultContainer = document.getElementById('resultContainer');

  convertBtn.addEventListener('click', function () {
    const file = imageInput.files[0];
    if (file) {
      convertImageToText(file);
    } else {
      alert('Please select an image file.');
    }
  });

  function convertImageToText(file) {
    const formData = new FormData();
    formData.append('apikey', 'K82813283588957'); // My OCR API key-K82813283588957
    formData.append('file', file);

    fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.ParsedResults && data.ParsedResults.length > 0) {
        displayResult(data.ParsedResults[0].ParsedText);
      } else {
        displayResult('Unable to extract text from the image.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      displayResult('Error occurred during OCR processing.');
    });
  }

  function displayResult(text) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note-container');
  
    const noteContent = document.createElement('div');
    noteContent.classList.add('note-content');
    noteContent.innerText = text;
  
    const copyBtn = document.createElement('button');
    copyBtn.innerText = 'Copy';
    copyBtn.addEventListener('click', function () {
      copyToClipboard(text);
    });
  
    noteContainer.appendChild(noteContent);
    noteContainer.appendChild(copyBtn);
  
    // Append the note container to the resultContainer
    resultContainer.appendChild(noteContainer);
  }
  
  function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  
    alert('Text copied to clipboard!');
  }
  
});

//------------------SAVE AS--------------------
document.addEventListener('DOMContentLoaded', function () {
  const nameInput = document.getElementById('name');
  const urlInput = document.getElementById('url');
  const saveCurrentTabBtn = document.getElementById('saveCurrentTab');
  const saveAllTabsBtn = document.getElementById('saveAllTabs');
  const saveBookmarksBtn = document.getElementById('saveBookmarks');

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    if (currentTab) {
      nameInput.value = currentTab.title;
      urlInput.value = currentTab.url;
    }
  });

  saveCurrentTabBtn.addEventListener('click', function () {
    saveTabs([urlInput.value], nameInput.value);
  });

  saveAllTabsBtn.addEventListener('click', function () {
    chrome.tabs.query({}, function (tabs) {
      const tabUrls = tabs.map(tab => tab.url);
      saveTabs(tabUrls, nameInput.value);
    });
  });

  saveBookmarksBtn.addEventListener('click', function () {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      const bookmarkUrls = getAllBookmarkUrls(bookmarkTreeNodes);
      saveTabs(bookmarkUrls, nameInput.value);
    });
  });

  function saveTabs(urls, name) {
    const htmlContent = generateHtmlContent(urls);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.html`;
    a.click();

    // Revoke the Object URL to free up resources
    URL.revokeObjectURL(url);
  }

  function getAllBookmarkUrls(bookmarkNodes) {
    let urls = [];
    bookmarkNodes.forEach(node => {
      if (node.children) {
        urls = urls.concat(getAllBookmarkUrls(node.children));
      } else {
        urls.push(node.url);
      }
    }); 
    return urls;
  }

  function generateHtmlContent(urls) {
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Saved Pages</title>
    </head>
    <body>
      <h1>Saved Pages</h1>
      <ul>
        ${urls.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join('')}
      </ul>
    </body>
    </html>`;
  }
});

 
  
