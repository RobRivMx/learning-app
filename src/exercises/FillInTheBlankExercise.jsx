// src/exercises/FillInTheBlankExercise.jsx
import { useState } from 'react';

function FillInTheBlankExercise({ exerciseData, onCorrectAnswer }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Dividimos la frase en dos partes, usando '_____' como separador
  const parts = exerciseData.sentence.split('_____');

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    // Comparamos la respuesta del usuario (en minúsculas y sin espacios extra) con la correcta
    if (userAnswer.trim().toLowerCase() === exerciseData.answer.toLowerCase()) {
      setIsCorrect(true);
      onCorrectAnswer();
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">✏️ Fill in the Blank</h2>
      <p className="exercise-instruction">Completa la frase con la palabra correcta.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="fill-blank-sentence">
          {parts[0]}
          <input
            type="text"
            className="blank-input"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={submitted}
            autoComplete="off"
          />
          {parts[1]}
        </div>
        
        {!submitted && (
          <button type="submit" className="btn btn-primary">
            Check Answer
          </button>
        )}
      </form>

      {submitted && isCorrect && (
        <div className="feedback success show">¡Correcto! Excelente.</div>
      )}
      {submitted && isCorrect === false && (
        <div className="feedback error show">
          Casi. La respuesta correcta era: <strong>{exerciseData.answer}</strong>
        </div>
      )}
    </div>
  );
}

export default FillInTheBlankExercise;