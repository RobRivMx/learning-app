// src/components/ProgressCard.jsx

function ProgressCard() {
  // Por ahora, los datos son fijos. Más adelante los haremos dinámicos.
  const progressPercent = "60%";

  return (
    <div className="progress-card">
      <div className="progress-header">
        <h2 className="progress-title">Your Progress</h2>
        <div className="level-info">
          <span className="level-badge">Level 3: Intermediate</span>
          <span className="xp-badge">2500 XP</span>
        </div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-labels">
          <span>Level Progress</span>
          <span>{progressPercent}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: progressPercent }}></div>
        </div>
        <p className="progress-message">You're just 40% away from reaching Level 4!</p>
      </div>
    </div>
  );
}

export default ProgressCard;