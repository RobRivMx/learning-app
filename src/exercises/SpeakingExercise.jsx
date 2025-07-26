// src/exercises/SpeakingExercise.jsx
import { useState, useRef, useEffect } from 'react';

// Comprobamos si el navegador soporta la API al inicio
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
}

function SpeakingExercise({ exerciseData, onCorrectAnswer }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const token = localStorage.getItem('token');

  const handleToggleListening = () => {
    if (!recognition) {
      alert("Lo siento, tu navegador no soporta el reconocimiento de voz.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      // No procesamos inmediatamente, esperamos al evento 'onend'
    } else {
      setTranscript('');
      setFeedback(null);
      recognition.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (!recognition) return;

    // Se activa cuando el navegador tiene un resultado final
    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      console.log("Transcripción recibida:", currentTranscript);
      setTranscript(currentTranscript);
      setIsProcessing(true); // Inicia el procesamiento justo después de recibir el texto
    };

    // Se activa cuando la grabación termina
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Error en reconocimiento de voz:", event.error);
      setIsListening(false);
      setIsProcessing(false);
    };

    // Limpiamos los listeners cuando el componente se desmonta
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
  }, []);

  // Este useEffect se activa para pedir el feedback a la IA cuando la transcripción está lista
  useEffect(() => {
    if (transcript && isProcessing) {
      getAIFeedback(transcript);
    }
  }, [transcript, isProcessing]);


  const getAIFeedback = async (textToEvaluate) => {
    try {
      const feedbackResponse = await fetch('http://127.0.0.1:8000/api/writing/feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          text: textToEvaluate, 
          prompt: `Evalúa la pronunciación de la siguiente transcripción. La frase original era: "${exerciseData.sentence_to_read}"`
        }),
      });

      if (!feedbackResponse.ok) {
          throw new Error('La respuesta de la API de feedback no fue exitosa');
      }

      const feedbackData = await feedbackResponse.json();
      setFeedback(feedbackData);
      if (feedbackData.score >= 3) onCorrectAnswer();

    } catch (error) {
      console.error("Error al obtener feedback de la IA:", error);
      setFeedback({ correction: "Error", feedback: "Hubo un problema al obtener el feedback.", score: 0 });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">🗣️ Speaking Practice</h2>
      <p className="exercise-instruction">{exerciseData.instruction}</p>
      
      <div style={{ background: 'var(--light-gray)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '1.2rem', textAlign: 'center' }}>
        <strong>{exerciseData.sentence_to_read}</strong>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleToggleListening} 
          className="audio-btn"
          disabled={isProcessing}
          style={{ width: '80px', height: '80px', fontSize: '2rem', background: isListening ? 'var(--danger)' : 'var(--primary)' }}
        >
          {isListening ? '⏹️' : '🎙️'}
        </button>
        <p style={{ marginTop: '1rem', color: 'var(--gray)' }}>
          {isProcessing ? 'Procesando...' : (isListening ? 'Escuchando...' : 'Haz clic para grabar')}
        </p>
      </div>

      {transcript && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4>Tu transcripción:</h4>
          <p><em>"{transcript}"</em></p>
        </div>
      )}

      {feedback && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          <h4>Feedback de Spacy:</h4>
          <p><strong>Comentario:</strong> {feedback.feedback}</p>
          <p><strong>Calificación:</strong> {'⭐'.repeat(feedback.score)}{'⚫'.repeat(5 - feedback.score)}</p>
        </div>
      )}
    </div>
  );
}

export default SpeakingExercise;