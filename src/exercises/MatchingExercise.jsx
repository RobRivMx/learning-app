// src/exercises/MatchingExercise.jsx
import { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

// Pequeño componente para los elementos que se pueden arrastrar
function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="vocab-word yellow">
      {children}
    </div>
  );
}

// Pequeño componente para las cajas donde se sueltan los elementos
function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    border: isOver ? '2px solid #6B46C1' : '2px dashed #E5E7EB',
  };

  return (
    <div ref={setNodeRef} style={style} className="definition-box">
      {children}
    </div>
  );
}

function MatchingExercise({ exerciseData, onCorrectAnswer }) {
  // Estado para guardar qué palabra está en qué caja
  const [parent, setParent] = useState({});

  function handleDragEnd(event) {
    const { over, active } = event;
    const wordId = active.id;
    const boxId = over ? over.id : null;

    setParent(prev => ({
      ...prev,
      [wordId]: boxId,
    }));

    // Verificamos si la respuesta es correcta
    if (boxId && exerciseData.solution[wordId] === boxId) {
      // Usamos un timeout para que el usuario vea el cambio antes de la alerta
      setTimeout(() => {
        alert("¡Correcto!");
        onCorrectAnswer();
      }, 200);
    }
  }

  // Organizamos las palabras que aún no han sido arrastradas
  const draggableWords = exerciseData.pairs.filter(p => !Object.values(parent).includes(p.id));

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="exercise-card">
        <h2 className="exercise-title">🔗 Vocabulary Matching</h2>
        <p className="exercise-instruction">{exerciseData.instruction}</p>

        {/* Palabras para arrastrar */}
        <div className="vocab-container">
          {exerciseData.pairs.map(word => (
            !parent[word.id] && <Draggable key={word.id} id={word.id}>{word.content}</Draggable>
          ))}
        </div>

        {/* Cajas para soltar */}
        <div>
          {exerciseData.matches.map(match => {
            const wordInBox = exerciseData.pairs.find(p => parent[p.id] === match.id);
            return (
              <Droppable key={match.id} id={match.id}>
                {wordInBox ? wordInBox.content : match.content}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DndContext>
  );
}

export default MatchingExercise;