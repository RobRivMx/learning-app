// src/exercises/WritingExercise.jsx
import { useState } from 'react';

function WritingExercise({ exerciseData, onCorrectAnswer }) {
  const [studentText, setStudentText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [toolFeedback, setToolFeedback] = useState(''); 
  const token = localStorage.getItem('token');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsChecking(true);
    setFeedback(null);
    setToolFeedback(''); 
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/writing/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: studentText,
          prompt: exerciseData.instruction
        }),
      });

      if (response.ok) {
        const feedbackData = await response.json();
        setFeedback(feedbackData);
        if (feedbackData.score >= 3) {
          onCorrectAnswer();
        }
      } else {
        setFeedback({ correction: "Error", feedback: "No se pudo obtener el feedback.", score: 0 });
      }
    } catch (error) {
      console.error("Error al enviar el texto:", error);
      setFeedback({ correction: "Error de conexión", feedback: "No se pudo conectar con el servidor.", score: 0 });
    } finally {
      setIsChecking(false);
    }
  };

  const handleToolClick = async (toolType) => {
    setToolFeedback('Obteniendo ayuda de Spacy...');
    let endpoint = '';
    let body = {};

    if (toolType === 'grammar_check') {
      endpoint = 'grammar_check';
      body = { text: studentText, prompt: exerciseData.instruction };
    } else {
      endpoint = toolType;
      body = { prompt: exerciseData.instruction };
    }
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/writing/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (toolType === 'example') {
        setStudentText(data.result);
        setToolFeedback('');
      } else {
        setToolFeedback(data.result);
      }
    } catch (error) {
      setToolFeedback("Error al usar la herramienta de IA.");
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">✍️ {exerciseData.title || 'Writing Exercise'}</h2>
      <p className="exercise-instruction">{exerciseData.instruction}</p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          className="writing-area"
          placeholder="Escribe tu respuesta aquí..."
          value={studentText}
          onChange={(e) => setStudentText(e.target.value)}
          disabled={isChecking}
        />

        <div className="writing-tools" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="tool-btn" onClick={() => handleToolClick('grammar_check')}>📝 Grammar Check</button>
          <button type="button" className="tool-btn" onClick={() => handleToolClick('verb_suggestions')}>📚 Verb Suggestions</button>
          <button type="button" className="tool-btn" onClick={() => handleToolClick('example')}>💡 Show Example</button>
        </div>

        {toolFeedback && (
          <div className="feedback success show" style={{ marginTop: '1rem' }}>
            {toolFeedback}
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={isChecking}>
          {isChecking ? 'Calificando...' : 'Submit Writing'}
        </button>
      </form>

      {feedback && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <h4>Feedback de Spacy:</h4>
          <p><strong>Corrección:</strong> {feedback.correction}</p>
          <p><strong>Comentario:</strong> {feedback.feedback}</p>
          <p><strong>Calificación:</strong> {'⭐'.repeat(feedback.score)}{'⚫'.repeat(5 - feedback.score)}</p>
        </div>
      )}
    </div>
  );
}

export default WritingExercise;