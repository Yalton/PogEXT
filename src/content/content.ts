// src/content.ts
const chatWindow: HTMLDivElement = document.createElement('div');
chatWindow.id = 'chat-overlay';
document.body.appendChild(chatWindow);

// Simulate random chat messages
setInterval(() => {
  const message: HTMLParagraphElement = document.createElement('p');
  message.textContent = 'Random Message'; // Can be replaced with actual emotes or messages
  chatWindow.appendChild(message);
}, 1000);


// Function to handle dragging
const dragStart = (e: MouseEvent) => {
    const offset = {
      x: e.clientX - chatWindow.offsetLeft,
      y: e.clientY - chatWindow.offsetTop
    };
    const drag = (e: MouseEvent) => {
      chatWindow.style.left = e.clientX - offset.x + 'px';
      chatWindow.style.top = e.clientY - offset.y + 'px';
    };
    const dragEnd = () => {
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('mouseup', dragEnd);
    };
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragEnd);
  };
  
  chatWindow.addEventListener('mousedown', dragStart);
  