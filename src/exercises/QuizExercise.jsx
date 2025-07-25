// src/exercises/QuizExercise.jsx
import { useState } from 'react';

function QuizExercise({ exerciseData, onCorrectAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (selectedOption === exerciseData.answer) {
      setIsCorrect(true);
      onCorrectAnswer(); // Llama a la función del padre para sumar puntos
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">📝 Quiz</h2>
      <p className="exercise-instruction">{exerciseData.instruction}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="quiz-options">
          {exerciseData.options.map((option, index) => (
            <label
              key={index}
              className={`
                quiz-option
                ${selectedOption === option ? 'selected' : ''}
                ${submitted && option === exerciseData.answer ? 'correct' : ''}
                ${submitted && selectedOption === option && option !== exerciseData.answer ? 'incorrect' : ''}
              `}
            >
              <input
                type="radio"
                name="quizOption"
                value={option}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
                disabled={submitted}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        
        {!submitted && (
          <button type="submit" className="btn btn-primary">
            Check Answer
          </button>
        )}
      </form>

      {submitted && isCorrect && (
        <div className="feedback success show">¡Correcto! Bien hecho.</div>
      )}
      {submitted && isCorrect === false && (
        <div className="feedback error show">
          Respuesta incorrecta. La respuesta correcta era: <strong>{exerciseData.answer}</strong>
        </div>
      )}
    </div>
  );
}

export default QuizExercise;