'use client'

import { useState } from 'react';
import axios from 'axios';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: ChatMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/generate', { prompt: input });
      const botMessage: ChatMessage = { text: response.data[0]?.generated_text || 'No response', sender: 'bot' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = { text: 'Error sending message. Please try again.', sender: 'bot' };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-md">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-200 text-right text-gray-800' : 'bg-gray-200 text-left text-gray-800'}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="mb-2 p-2 rounded-lg bg-gray-300 text-gray-800">Loading...</div>}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
          className="flex-1 p-2 border border-gray-300 rounded-lg mr-2 text-gray-900"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded-lg disabled:bg-gray-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
