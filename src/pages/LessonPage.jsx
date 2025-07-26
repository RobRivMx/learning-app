// src/pages/LessonPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import GrammarNotes from '../exercises/GrammarNotes';
import QuizExercise from '../exercises/QuizExercise';
import FillInTheBlankExercise from '../exercises/FillInTheBlankExercise';
import MatchingExercise from '../exercises/MatchingExercise';
import WritingExercise from '../exercises/WritingExercise';
import ListeningExercise from '../exercises/ListeningExercise';
import SpeakingExercise from '../exercises/SpeakingExercise';
import ErrorDetectionExercise from '../exercises/ErrorDetectionExercise'; 
import ReadingExercise from '../exercises/ReadingExercise';
import PronunciationExercise from '../exercises/PronunciationExercise';
import SpacyInLesson from '../components/SpacyInLesson';

function LessonPage() {
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { lesson_id } = useParams();
  const [userXP, setUserXP] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.xp : 0;
  });

  const handleCorrectAnswer = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/progress/correct_answer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserXP(updatedUser.xp);
        console.log("¡Puntos sumados! Nuevo XP:", updatedUser.xp);
      }
    } catch (error) {
      console.error("Error al sumar puntos:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:8000/api/lessons/${lesson_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setLesson(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar la lección:", error);
        setIsLoading(false);
      });
  }, [lesson_id]);

  if (isLoading) return <div>Cargando lección...</div>;
  if (!lesson) return <div>Lección no encontrada.</div>;

  return (
    <div>
      <Header key={userXP} />
      <main className="main-container">
        <h1>{lesson.title}</h1>
        
        {lesson.exercises.map(exercise => {
          if (exercise.exercise_type === 'grammar_notes') {
            return <GrammarNotes key={exercise.id} exerciseData={exercise.data} />;
          }
          else if (exercise.exercise_type === 'quiz') {
            return <QuizExercise key={exercise.id} exerciseData={exercise.data} onCorrectAnswer={handleCorrectAnswer} />;
          } 
          else if (exercise.exercise_type === 'fill_in_the_blank') {
            return <FillInTheBlankExercise key={exercise.id} exerciseData={exercise.data} onCorrectAnswer={handleCorrectAnswer} />;
          }
          else if (exercise.exercise_type === 'matching') {
            return <MatchingExercise key={exercise.id} exerciseData={exercise.data} onCorrectAnswer={handleCorrectAnswer} />;
          }
          else if (exercise.exercise_type === 'listening') {
            return <ListeningExercise key={exercise.id} exerciseData={exercise.data} onCorrectAnswer={handleCorrectAnswer} />;
          }
          else if (exercise.exercise_type === 'pronunciation') {
            return <PronunciationExercise key={exercise.id} exerciseData={exercise.data} onCorrectAnswer={handleCorrectAnswer} />;
          }
          else if (exercise.exercise_type === 'error_detection') {
            return <ErrorDetectionExercise key={exercise.id} exerciseData={exercise.data} onCorrectAnswer={handleCorrectAnswer} />;
          }
          else if (exercise.exercise_type === 'reading') {
            return <ReadingExercise key={exercise.id} exerciseData={exercise.data} onCorrectAnswer={handleCorrectAnswer} />;
          }
          else if (exercise.exercise_type === 'writing') {
            return <WritingExercise key={exercise.id} exerciseData={exercise.data} onCorrectAnswer={handleCorrectAnswer} />;
          }
          else if (exercise.exercise_type === 'speaking') {
            return <SpeakingExercise key={exercise.id} exerciseData={exercise.data} onCorrectAnswer={handleCorrectAnswer} />;
          }
          return null;
        })}

        <SpacyInLesson lessonTopic={lesson.title} />
      </main>
    </div>
  );
}

export default LessonPage;