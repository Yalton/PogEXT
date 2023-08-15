/// <reference types="chrome"/>

document.getElementById('toggleChat')?.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { action: 'toggleChat' });
    });
  });
    