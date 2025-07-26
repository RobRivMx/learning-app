// src/components/SpacyInLesson.jsx
import { useState, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
}

function SpacyInLesson({ lessonTopic }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const token = localStorage.getItem('token');

  // Función Text-to-Speech (TTS)
  const speak = (text) => {
    // Detiene cualquier locución anterior para evitar que se solapen
    window.speechSynthesis.cancel();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Puedes cambiarlo a 'es-ES' si Spacy responde en español
      window.speechSynthesis.speak(utterance);
    }
  };

  // Función Speech-to-Text (STT)
  const handleToggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    if (!recognition) return;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.onerror = (event) => console.error("Error de reconocimiento:", event.error);
    return () => {
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
    }
  }, []);


  const handleSendMessage = async (mode, messageText = input) => {
    const text = messageText.trim();
    if (!text && messages.length > 0) return;

    const userMessage = { sender: 'user', text };
    if (text) {
      setMessages(prev => [...prev, userMessage]);
    }
    
    setIsLoading(true);
    const messageToSend = text || `Hola, quiero ${mode} sobre ${lessonTopic}`;
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/lessons/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: messageToSend,
          lesson_topic: lessonTopic,
          mode: mode
        }),
      });

      if (!response.ok) throw new Error("Error en la respuesta de la API");
      
      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.reply };
      
      // Añadimos el mensaje de la IA al chat
      setMessages(prev => [...prev, aiMessage]);
      
      // ¡Y lo reproducimos en voz alta inmediatamente!
      speak(aiMessage.text);

    } catch (error) {
      const errorMessage = { sender: 'ai', text: 'Lo siento, hubo un error. Inténtalo de nuevo.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="exercise-card" style={{ marginTop: '3rem' }}>
      <h2 className="exercise-title">🤖 ¡Practica con Spacy!</h2>
      <p className="exercise-instruction">¿Tienes dudas o quieres practicar lo que aprendiste?</p>

      <div className="chat-window" style={{ height: '40vh', border: '1px solid #ccc', overflowY: 'auto', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`} style={{ marginBottom: '1rem', textAlign: msg.sender === 'user' ? 'right' : 'left', display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
            {/* El botón para escuchar de nuevo se mantiene */}
            {msg.sender === 'ai' && (
              <button onClick={() => speak(msg.text)} className="audio-btn" style={{width: '30px', height: '30px', fontSize: '0.8rem', marginRight: '0.5rem'}}>🔊</button>
            )}
            <p style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '10px', backgroundColor: msg.sender === 'user' ? '#6B46C1' : '#F3F4F6', color: msg.sender === 'user' ? 'white' : 'black' }}>
              {msg.text}
            </p>
          </div>
        ))}
        {isLoading && <p style={{ textAlign: 'left', color: '#666' }}>Spacy está escribiendo...</p>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage('practice'); }} style={{ display: 'flex', gap: '1rem' }}>
        <div style={{position: 'relative', flex: 1}}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe o presiona el micrófono para hablar..." style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', paddingRight: '40px' }} disabled={isLoading} />
          <button type="button" onClick={handleToggleListening} className="audio-btn" style={{position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', width: '30px', height: '30px', fontSize: '1rem', background: 'none', color: isListening ? 'var(--danger)' : 'var(--primary)'}}>🎙️</button>
        </div>
        {messages.length === 0 ? (
          <>
            <button type="button" onClick={() => handleSendMessage('question', 'Tengo una pregunta')} className="btn btn-secondary" disabled={isLoading}>Hacer Pregunta</button>
            <button type="button" onClick={() => handleSendMessage('practice', 'Vamos a practicar')} className="btn btn-primary" disabled={isLoading}>Practicar</button>
          </>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={isLoading || !input.trim()}>Enviar</button>
        )}
      </form>
    </div>
  );
}

export default SpacyInLesson;