//chatWindow.tsx

import React, { useState, useEffect, useRef } from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { emotes } from '../../utils/emotes';


const ChatWindow = () => {
    const [usernames, setUsernames] = useState<{ name: string; color: string }[]>([]);
    const [messages, setMessages] = useState<{
        emote: string | undefined; user: string; text: string; color: string
    }[]>([]);
    const [messageFrequency, setMessageFrequency] = useState(1000);
    const [isPaused, setIsPaused] = useState(false); // New state for pause status
    const chatContainerRef = useRef<HTMLDivElement>(null);
    let totalMessagesLocal = 0;

    const colors = ["red", "blue", "green", "purple"];

    const getRandomMessage = () => {
        const texts = ["Hello!", "How are you?", "This is a test.", "Random Message"];
        const randomUser = usernames[Math.floor(Math.random() * usernames.length)];
        const randomEmote = emotes[Math.floor(Math.random() * emotes.length)]; // Select a random emote
        return { user: randomUser.name, text: texts[Math.floor(Math.random() * texts.length)], color: randomUser.color, emote: randomEmote };
    };

    // Retrieve the current total messages count from storage
    chrome.storage.sync.get('totalMessages', (data) => {
        totalMessagesLocal = data.totalMessages || 0;
    });

    // Retrieve message frequency and users in chat from storage
    useEffect(() => {
        chrome.storage.sync.get(['messageFrequency', 'usersInChat'], (data) => {
            if (data.messageFrequency) {
                setMessageFrequency((100 - data.messageFrequency) * 20);
            }
            if (data.usersInChat) {
                const names = Array.from({ length: data.usersInChat }, (_, i) => ({
                    name: `User${i + 1}`,
                    color: colors[i % colors.length]
                }));
                setUsernames(names);
            }
        });
    }, []);

    // Simulate random chat messages
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('isPaused:', isPaused); // Log the pause status
            if (!isPaused) { // Check if the chat is paused

                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages, getRandomMessage()];
                    // Increment the local total messages count
                    totalMessagesLocal++;
                    return newMessages;
                });
            }
        }, messageFrequency);

        // Periodically update the total messages count in storage
        const updateStorageInterval = setInterval(() => {
            chrome.storage.sync.set({ totalMessages: totalMessagesLocal });
        }, 5000); // Update every 5 seconds, you can adjust the interval

        return () => {
            clearInterval(interval);
            clearInterval(updateStorageInterval);
        };
    }, [messageFrequency, usernames, isPaused]);

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            // console.log("scrollHeight:", chatContainer.scrollHeight);
            // console.log("scrollTop:", chatContainer.scrollTop);
            // console.log("clientHeight:", chatContainer.clientHeight);
            setTimeout(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 0);
        }
    }, [messages]);


    return (
        <div className="chat-window">
            <div className="sticky-header">
                <h2>PogEXT Chat</h2>
            </div>
            <div className="chat-content"> {/* New wrapper div */}
                <div className="chat-container" ref={chatContainerRef}>
                    {messages.map((message, index) => (
                        <div key={index} className="slide-in-message">
                            {/* <p><strong style={{ color: message.color }}>{message.user}:</strong> {message.text}</p> */}
                            <strong style={{ color: message.color }}>{message.user}:</strong>
                            {message.text}
                            <img src={message.emote} alt="emote" className="emote-image" />
                        </div>
                    ))}
                </div>
                <div className="pause-button"> {/* Updated class */}
                    <button onClick={() => {
                        console.log('Button clicked, current state:', isPaused);
                        setIsPaused(!isPaused);
                    }}>
                        {isPaused ? "Resume Chat" : "Pause Chat"}
                    </button>

                </div>
            </div>
        </div>
    );

}
export default ChatWindow;

const root = document.querySelector('#root');
if (root) {
    createRoot(root).render(<ChatWindow />);
} else {
    console.error("Root element not found");
}