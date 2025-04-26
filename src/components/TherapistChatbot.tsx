import React, { useState, useEffect } from 'react';

interface TherapistChatbotProps {
  emotion: string | null;
}

const TherapistChatbot: React.FC<TherapistChatbotProps> = ({ emotion }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  
  // Default greeting message
  const defaultMessages = [
    "Hello! How are you feeling today?",
  ];

  useEffect(() => {
    // If the emotion is passed, adjust the chatbot's response
    if (emotion) {
      setMessages([
        `I see you're feeling ${emotion}. How can I help you with that?`,
      ]);
    } else {
      setMessages(defaultMessages);
    }
  }, [emotion]);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages(prevMessages => [...prevMessages, `You: ${userInput}`]);
      setUserInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">{message}</div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default TherapistChatbot;
