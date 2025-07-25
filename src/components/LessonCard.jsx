// src/components/LessonCard.jsx
import { Link } from 'react-router-dom';

function LessonCard(props) {
  // El status y el icon ahora vendrán de los datos de la lección
  const statusClass = `lesson-card ${props.status}`;

  return (
    <Link to={`/lesson/${props.id}`} className={statusClass}>
      <div className="lesson-header">
        <div className="lesson-number">{props.number}</div>
        <div className="lesson-status">{props.icon}</div>
      </div>
      <h4 className="lesson-title">{props.title}</h4>
    </Link>
  );
}

export default LessonCard;