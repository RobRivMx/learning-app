// src/exercises/ErrorDetectionExercise.jsx
import { useState } from 'react';

function ErrorDetectionExercise({ exerciseData, onCorrectAnswer }) {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (userAnswer) => {
    if (submitted) return;
    setSubmitted(true);

    if (userAnswer === exerciseData.answer) {
      setFeedback('¡Correcto! ' + exerciseData.explanation);
      onCorrectAnswer();
    } else {
      setFeedback('Incorrecto. ' + exerciseData.explanation);
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">🕵️‍♂️ {exerciseData.title || 'Detecta el Error'}</h2>
      <p className="exercise-instruction">{exerciseData.instruction}</p>
      
      <div style={{ background: 'var(--light-gray)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '1.2rem', textAlign: 'center' }}>
        <strong>"{exerciseData.sentence}"</strong>
      </div>

      {!submitted && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn btn-success" onClick={() => handleAnswer('Correct')}>
            Correcto ✓
          </button>
          <button className="btn btn-danger" onClick={() => handleAnswer('Incorrect')}>
            Incorrecto ✗
          </button>
        </div>
      )}

      {submitted && (
        <div className={`feedback ${feedback.includes('Correcto') ? 'success' : 'error'} show`}>
          {feedback}
        </div>
      )}
    </div>
  );
}

export default ErrorDetectionExercise;