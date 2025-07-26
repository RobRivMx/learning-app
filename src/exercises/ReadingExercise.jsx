// src/exercises/ReadingExercise.jsx
import { useState } from 'react';

// Reutilizamos el sub-componente del Quiz para las preguntas de comprensión
function ComprehensionQuestion({ questionData, onAnswered }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option) => {
    if (submitted) return;
    setSelectedOption(option);
    setSubmitted(true);
    const correct = option === questionData.answer;
    setIsCorrect(correct);
    onAnswered(correct);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{questionData.question}</p>
      <div className="quiz-options">
        {questionData.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleSelect(option)}
            className={`
              quiz-option
              ${selectedOption === option ? 'selected' : ''}
              ${submitted && option === questionData.answer ? 'correct' : ''}
              ${submitted && selectedOption === option && option !== questionData.answer ? 'incorrect' : ''}
            `}
            style={{ cursor: submitted ? 'default' : 'pointer' }}
          >
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


function ReadingExercise({ exerciseData, onCorrectAnswer }) {
  const [correctCount, setCorrectCount] = useState(0);

  const handleQuestionAnswered = (wasCorrect) => {
    if (wasCorrect) {
      const newCount = correctCount + 1;
      setCorrectCount(newCount);
      if (newCount === exerciseData.comprehension_quiz.questions.length) {
        onCorrectAnswer();
      }
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">📚 {exerciseData.title || 'Reading Comprehension'}</h2>
      <p className="exercise-instruction">{exerciseData.instruction}</p>
      
      {exerciseData.image_url && (
        <img src={exerciseData.image_url} alt="Reading context" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
      )}
      
      <div style={{ background: 'var(--light-gray)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
        <p>{exerciseData.text}</p>
      </div>

      <hr style={{margin: '2rem 0'}}/>

      <h4>Comprensión:</h4>
      {exerciseData.comprehension_quiz.questions.map(q => (
        <ComprehensionQuestion 
          key={q.id}
          questionData={q}
          onAnswered={handleQuestionAnswered}
        />
      ))}
    </div>
  );
}

export default ReadingExercise;