// src/exercises/QuizExercise.jsx
import { useState } from 'react';

// Un sub-componente para manejar una sola pregunta del quiz
function QuizQuestion({ questionData, onAnswered }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (option) => {
    if (submitted) return;
    setSelectedOption(option);
    setSubmitted(true);

    if (option === questionData.answer) {
      setIsCorrect(true);
      onAnswered(true); // Informa al padre que la respuesta fue correcta
    } else {
      setIsCorrect(false);
      onAnswered(false); // Informa al padre que fue incorrecta
    }
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


// El componente principal del ejercicio
function QuizExercise({ exerciseData, onCorrectAnswer }) {
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleQuestionAnswered = (wasCorrect) => {
    if (wasCorrect) {
      const newScore = correctAnswers + 1;
      setCorrectAnswers(newScore);

      // Si todas las preguntas son correctas, suma los puntos de XP
      if (newScore === exerciseData.questions.length) {
        onCorrectAnswer();
      }
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">📝 {exerciseData.title || 'Quiz'}</h2>
      <p className="exercise-instruction">{exerciseData.instruction}</p>
      
      {exerciseData.questions.map((question) => (
        <QuizQuestion 
          key={question.id}
          questionData={question}
          onAnswered={handleQuestionAnswered}
        />
      ))}
    </div>
  );
}

export default QuizExercise;