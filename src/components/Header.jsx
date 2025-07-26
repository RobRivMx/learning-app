// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    // Borramos los datos del usuario del almacenamiento
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navegamos a la página de login
    navigate('/login');
  };

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
          {/* Hacemos que el avatar sea un botón para cerrar sesión */}
          <div 
            className="user-avatar" 
            onClick={handleLogout} 
            title="Cerrar Sesión"
            style={{cursor: 'pointer'}}
          >
            {user ? user.email.substring(0, 2).toUpperCase() : 'G'}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;