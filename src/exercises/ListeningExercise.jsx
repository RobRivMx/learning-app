// src/exercises/ListeningExercise.jsx
import { useState } from 'react';

function ListeningExercise({ exerciseData, onCorrectAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (selectedOption === exerciseData.answer) {
      setIsCorrect(true);
      onCorrectAnswer();
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="exercise-card">
      <h2 className="exercise-title">🎧 Listening Comprehension</h2>
      <p className="exercise-instruction">{exerciseData.instruction}</p>

      {/* Reproductor de Audio Nativo de HTML */}
      <audio controls src={exerciseData.audio_url} style={{ width: '100%', marginBottom: '1.5rem' }}>
        Your browser does not support the audio element.
      </audio>

      <p className="exercise-instruction">{exerciseData.question}</p>

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
                name="listeningOption"
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
        <div className="feedback success show">¡Correcto! Muy bien.</div>
      )}
      {submitted && isCorrect === false && (
        <div className="feedback error show">
          Inténtalo de nuevo. La respuesta correcta era: <strong>{exerciseData.answer}</strong>
        </div>
      )}
    </div>
  );
}

export default ListeningExercise;