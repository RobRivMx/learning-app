// src/exercises/PronunciationExercise.jsx
import { useState, useRef, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
}

function PronunciationExercise({ exerciseData, onCorrectAnswer }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const token = localStorage.getItem('token');

  // Función para leer la palabra en voz alta
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Lo siento, tu navegador no soporta la lectura en voz alta.");
    }
  };

  const handleToggleListening = () => {
    if (!recognition) {
      alert("Lo siento, tu navegador no soporta el reconocimiento de voz.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      setFeedback(null);
      recognition.start();
    }
  };

  useEffect(() => {
    if (!recognition) return;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      setIsProcessing(true);
      getAIFeedback(currentTranscript);
    };
    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
      setIsListening(false);
    };
  }, []);

  const getAIFeedback = async (textToEvaluate) => {
    try {
      const feedbackResponse = await fetch('http://127.0.0.1:8000/api/writing/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          text: textToEvaluate,
          prompt: `Evalúa qué tan bien el usuario pronunció la palabra "${exerciseData.word}". La transcripción de su intento fue "${textToEvaluate}".`
        }),
      });
      const feedbackData = await feedbackResponse.json();
      setFeedback(feedbackData);
      if (feedbackData.score >= 3) onCorrectAnswer();
    } catch (error) {
      console.error("Error al obtener feedback de la IA:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">🎤 {exerciseData.title || 'Práctica de Pronunciación'}</h2>
      <p className="exercise-instruction">{exerciseData.instruction}</p>
      
      <div className="pronunciation-word">{exerciseData.word}</div>
      <div className="phonetic">{exerciseData.phonetic}</div>

      <div className="audio-controls">
        <button className="audio-btn" onClick={() => speak(exerciseData.word)} title="Escuchar">🔊</button>
        <button 
          className={`audio-btn ${isListening ? 'recording' : ''}`} 
          onClick={handleToggleListening} 
          disabled={isProcessing}
          title="Grabar"
        >
          {isListening ? '⏹️' : '🎤'}
        </button>
      </div>
      
      {isProcessing && <p style={{ textAlign: 'center', color: '#666' }}>Evaluando...</p>}

      {transcript && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <h4>Tu transcripción:</h4>
          <p><em>"{transcript}"</em></p>
        </div>
      )}

      {feedback && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <h4>Feedback de Spacy:</h4>
          <p><strong>Comentario:</strong> {feedback.feedback}</p>
          <p><strong>Calificación:</strong> {'⭐'.repeat(feedback.score)}{'⚫'.repeat(5 - feedback.score)}</p>
        </div>
      )}
    </div>
  );
}

export default PronunciationExercise;