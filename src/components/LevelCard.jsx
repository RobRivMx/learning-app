// src/components/LevelCard.jsx
import LessonCard from './LessonCard.jsx';

function LevelCard(props) {
  return (
    <div className="level-card">
      <div className="level-card-header">
        <div className="level-name">
          <div className="level-icon">{props.level_code}</div>
          <div className="level-text">
            <h3>{props.title}</h3>
            <p>{props.description}</p>
          </div>
        </div>
        <div className="level-stats">
          <span className="level-progress">{props.progress}</span>
          <button className="expand-btn">⌄</button>
        </div>
      </div>

      <div className="lessons-container expanded">
        {/* Mapeamos sobre la lista de lecciones y creamos una tarjeta para cada una */}
        {props.lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            id={lesson.id}
            number={lesson.number}
            title={lesson.title}
            status={lesson.status}
            icon={lesson.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default LevelCard;