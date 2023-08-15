import React, { useState, useEffect } from 'react';


const App = (): JSX.Element => {
  const [autoReact, setAutoReact] = useState(false);
  const [usersInChat, setUsersInChat] = useState(50);
  const [messageFrequency, setMessageFrequency] = useState(50);
  // const [messageTemperature, setMessageTemperature] = useState(50);
  // const [pauseChat, setPauseChat] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);

  const toggleChat = () => {
    // Save the message frequency
    chrome.storage.sync.set({ messageFrequency });
  
    chrome.runtime.sendMessage({ action: 'openChatWindow' });
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { action: 'toggleChat' });
    });
  };

  const fetchTotalMessages = () => {
    chrome.storage.sync.get('totalMessages', (data) => {
      setTotalMessages(data.totalMessages || 0);
    });
  };
  useEffect(() => {
    // Save the users in chat to storage
    chrome.storage.sync.set({ usersInChat, messageFrequency });
  }, [usersInChat, messageFrequency]);
  
  useEffect(() => {
    fetchTotalMessages();
  
    // Listen for changes in Chrome storage
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.totalMessages) {
        setTotalMessages(changes.totalMessages.newValue);
      }
    });
  }, []);

  return (
    <div className="popup">
      <div className='popup-div'>
        Total Messages Sent: <span>{totalMessages}</span>
      </div>
      <div className='popup-div'>
        <label>
          Auto React to Content:
          <input type="checkbox" checked={autoReact} onChange={(e) => setAutoReact(e.target.checked)} />
        </label>
      </div>
      <div className='popup-div'>
        Users in Chat:
        <input type="range" min="0" max="100" value={usersInChat} onChange={(e) => setUsersInChat(Number(e.target.value))} />
      </div>
      <div className='popup-div'>
        Message Frequency:
        <input type="range" min="0" max="100" value={messageFrequency} onChange={(e) => setMessageFrequency(Number(e.target.value))} />
      </div>
      {/* <div className='popup-div'>
        Message Temperature:
        <input type="range" min="0" max="100" value={messageTemperature} onChange={(e) => setMessageTemperature(Number(e.target.value))} />
      </div> */}
      {/* <div className='popup-div'>
        <label>
          Pause Chat:
          <input type="checkbox" checked={pauseChat} onChange={(e) => setPauseChat(e.target.checked)} />
        </label>
      </div> */}
      <div className='popup-div'>
        <button id="toggleChat" onClick={toggleChat}>
          Toggle Chat
        </button>
      </div>
    </div>
  );
};

export default App;


