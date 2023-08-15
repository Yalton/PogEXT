let chatWindowId: number | null = null;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'openChatWindow') {
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
    }
  }
});
