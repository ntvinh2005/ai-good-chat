'use client'

import { useState } from 'react';
import axios from 'axios';

interface ChatMessage {
  text: string | JSX.Element;
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
      const generateResponse = await axios.post('/api/generate', { prompt: input });
  
      console.log('Generate response:', generateResponse.data);
      
      // Check if the response has an error or is incomplete
      if (!generateResponse.data || !generateResponse.data.ingredients) {
        throw new Error('Invalid response or model still loading');
      }
  
      // Handle the case where ingredients are returned as a string
      const ingredientsString: string = generateResponse.data.ingredients;
      const detectedIngredients: string[] = ingredientsString ? ingredientsString.split(',').map(ingredient => ingredient.trim()) : [];
      
      console.log('Detected ingredients:', detectedIngredients); // Debug log
  
      if (detectedIngredients.length > 0) {
        const recipesResponse = await axios.get('/api/recipes', { params: { q: detectedIngredients.join(',') } });
        const recipes = recipesResponse.data.hits;
  
        let recipesContent: JSX.Element | string = 'No recipes found. Please try different ingredients.';
        if (recipes.length > 0) {
          recipesContent = (
            <div>
              {recipes.map((recipe: any) => {
                const { recipe: { label, image, url } } = recipe;
                return (
                  <div key={url} className="mb-4 p-2 rounded-lg bg-white shadow-md">
                    <h3 className="text-lg font-bold">{label}</h3>
                    <img src={image} alt={label} className="w-full h-32 object-cover rounded-lg mb-2" />
                    <a href={url} className="text-blue-500" target="_blank" rel="noopener noreferrer">View Recipe</a>
                  </div>
                );
              })}
            </div>
          );
        }
  
        const recipeMessage: ChatMessage = {
          text: <div>Here are some recipes you can make with {detectedIngredients.join(', ')}: {recipesContent}</div>,
          sender: 'bot'
        };
        setMessages([...messages, userMessage, recipeMessage]);
      } else {
        // Return a hardcoded "Sorry" message if no ingredients are detected
        const errorMessage: ChatMessage = { text: 'Sorry, I couldn\'t find any ingredients in your message.', sender: 'bot' };
        setMessages([...messages, userMessage, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
  
      // Handle specific loading or invalid response errors
      const errorMessage: ChatMessage = { text: 'Sorry, there was an issue processing your request. Please try again later.', sender: 'bot' };
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
            {typeof msg.text === 'string' ? msg.text : msg.text}
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
