// src/exercises/FillInTheBlankExercise.jsx
import { useState } from 'react';

// Sub-componente para una sola frase
function FillBlankSentence({ sentenceData, onAnswered }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const parts = sentenceData.start.split('___');
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitted) return;

    setSubmitted(true);
    const correct = userAnswer.trim().toLowerCase() === sentenceData.answer.toLowerCase();
    setIsCorrect(correct);
    onAnswered(correct);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
      <div className="fill-blank-sentence">
        {sentenceData.start}
        <input
          type="text"
          className="blank-input"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={submitted}
          autoComplete="off"
          style={{
            borderColor: submitted ? (isCorrect ? 'var(--success)' : 'var(--danger)') : '#E5E7EB'
          }}
        />
        {sentenceData.end}
      </div>
      {!submitted && (
        <button type="submit" className="btn btn-secondary" style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}}>
          Check
        </button>
      )}
      {submitted && !isCorrect && (
         <p style={{color: 'var(--danger)', fontSize: '0.9rem', marginTop: '0.5rem'}}>
            La respuesta correcta era: <strong>{sentenceData.answer}</strong>
         </p>
      )}
    </form>
  );
}


// Componente principal del ejercicio
function FillInTheBlankExercise({ exerciseData, onCorrectAnswer }) {
  const [correctCount, setCorrectCount] = useState(0);

  const handleSingleSentenceAnswered = (wasCorrect) => {
    if (wasCorrect) {
      const newCount = correctCount + 1;
      setCorrectCount(newCount);

      // Si todas las frases son correctas, suma los puntos de XP
      if (newCount === exerciseData.sentences.length) {
        onCorrectAnswer();
      }
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">✏️ {exerciseData.title || 'Fill in the Blank'}</h2>
      <p className="exercise-instruction">{exerciseData.instruction}</p>
      
      {exerciseData.sentences.map((sentence) => (
        <FillBlankSentence
          key={sentence.id}
          sentenceData={sentence}
          onAnswered={handleSingleSentenceAnswered}
        />
      ))}
    </div>
  );
}

export default FillInTheBlankExercise;