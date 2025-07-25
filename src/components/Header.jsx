// src/components/Header.jsx
import { Link } from 'react-router-dom';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon">📚</div>
          <span>LinguaQuest</span>
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/tutor">Tutor AI</Link>
        </nav>
        <div className="user-section">
          {user && <span className="xp-badge">{user.xp} XP</span>}
          <button className="notification-btn">🔔</button>
          <div className="user-avatar">
            {user ? user.email.substring(0, 2).toUpperCase() : 'G'}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;