let chatWindowId: number | null = null;

chrome.runtime.onMessage.addListener((message) => {
  console.log('Background: Received a message', message);
  if (message.action === 'openChatWindow') {
    console.log('Background: Opening chat window');
    if (chatWindowId !== null) {
      // If the chat window is already open, close it
      chrome.windows.remove(chatWindowId, () => {
        chrome.storage.sync.set({ totalMessages: 0 }); // Reset total messages
        chatWindowId = null; // Set chatWindowId to null
      });
    } else {
      // Open the chat window
      chrome.windows.create(
        {
          url: chrome.runtime.getURL('pages/chatWindow/chatWindow.html'),
          type: 'popup',
          width: 400,
          height: 600,
        },
        (window) => {
          if (window && window.id !== undefined) {
            chatWindowId = window.id;
            // Poll to check if the window is closed
            const checkWindowClosed = setInterval(() => {
              chrome.windows.get(chatWindowId! as number, {}, (window) => {
                if (chrome.runtime.lastError) {
                  // Window is closed
                  clearInterval(checkWindowClosed);
                  chatWindowId = null;
                  chrome.storage.sync.set({ totalMessages: 0 }); // Reset total messages
                }
              });
            }, 1000);
          }
        }
      );

      // Send a message to the content script to start summarizing
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const activeTabId = activeTab?.id;
      
        if (activeTabId !== undefined) {
          console.log('Background: Sending summarizeContent message to content script');
          chrome.tabs.sendMessage(activeTabId, { action: 'summarizeContent' });
        } else {
          console.log('Background: Active tab is not found');
        }
      });
    }
  }
  else {
    console.log('Background: Unhandled message action', message.action);
  }

});
