import React, { useState } from 'react';

const Admin = () => {
  const [query, setQuery] = useState('');
  // const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);


const getResponseFromGemini = async (query) => {
    const apiKey = 'AIzaSyDppGjoJyEjrypb5PPWc5SnVgmLrnLvgNo';
    const response = await fetch(`https://api.gemini.com/v1/query?api_key=${apiKey}&query=${query}`);
    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
     console.log('Gemini API response:', result); 
  return data;
};

// const getResponseFromGemini = async (userQuery) => {
//   const apiKey = 'AIzaSyDppGjoJyEjrypb5PPWc5SnVgmLrnLvgNo';
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

// const requestBody = {
//   contents: [
//     {
//       role: 'user',
//       parts: [{ text: userQuery }]
//     }
//   ],
//   generationConfig: {
//     temperature: 0.7,
//     topK: 1,
//     topP: 1,
//     maxOutputTokens: 256
//   }
// };


// const res = await fetch(url, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(requestBody),
// });


//   const data = await res.json();
//   console.log('Gemini API response:', data); 

//   const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//   return result || 'No response from Gemini.';
// };


const startConversation = async () => {
  if (!query.trim()) return;

  setLoading(true);

  // Add user message first
  setMessages(prev => [...prev, { role: 'user', text: query }]);

  try {
    const reply = await getResponseFromGemini(query);
    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
  } catch (err) {
    console.error('Error fetching Gemini response:', err);
    setMessages(prev => [...prev, { role: 'assistant', text: 'Error: ' + err.message }]);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <img src="/virtualAssistant.jpg" alt="Sifara" className="mx-auto w-48 mb-4" />
      <h1 className="text-2xl font-bold mb-4">I am your virtual assistant</h1>

      <textarea
        className="w-full border p-2 mb-4 rounded"
        placeholder="Type your query..."
        rows={3}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={startConversation}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Thinking...' : 'Click Here'}
      </button>


  <div className="chat-box">
  {messages.map((msg, i) => (
    <div key={i} className={`p-2 my-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
      <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
        {msg.text}
      </span>
    </div>
  ))}
</div>

    </div>
  );
};

export default Admin;
