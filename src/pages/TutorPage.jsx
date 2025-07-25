// src/pages/TutorPage.jsx
import { useState } from 'react';
import Header from '../components/Header'; // Asumimos que Header está en components

function TutorPage() {
  // Estado para guardar la conversación
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '¡Hola! Soy Spacy, tu tutor de IA. ¿En qué puedo ayudarte hoy?' }
  ]);
  // Estado para el mensaje que el usuario está escribiendo
  const [input, setInput] = useState('');
  // Estado para saber si la IA está "pensando"
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { sender: 'ai', text: 'Lo siento, no pude conectarme. Inténtalo de nuevo.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="main-container" style={{ maxWidth: '800px' }}>
        <h2>Spacy AI Tutor</h2>
        <div className="chat-window" style={{ height: '60vh', border: '1px solid #ccc', overflowY: 'auto', padding: '1rem', marginBottom: '1rem' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`} style={{ marginBottom: '1rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <p style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                backgroundColor: msg.sender === 'user' ? '#6B46C1' : '#F3F4F6',
                color: msg.sender === 'user' ? 'white' : 'black',
              }}>
                {msg.text}
              </p>
            </div>
          ))}
          {isLoading && <p style={{ textAlign: 'left', color: '#666' }}>Spacy está escribiendo...</p>}
        </div>
        <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc' }}
            disabled={isLoading}
          />
          <button type="submit" style={{ padding: '0.75rem 1.5rem', border: 'none', background: '#6B46C1', color: 'white' }} disabled={isLoading}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default TutorPage;