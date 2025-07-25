// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TutorPage from './pages/TutorPage.jsx';
import LessonPage from './pages/LessonPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './components/Header.jsx';
import ProgressCard from './components/ProgressCard.jsx';
import LevelCard from './components/LevelCard.jsx';

// Componente para la página principal
function HomePage() {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/levels")
      .then(response => response.json())
      .then(data => setLevels(data))
      .catch(error => console.error("Error al conectar con la API:", error));
  }, []);

  return (
    <div>
      <Header />
      <main className="main-container">
        <ProgressCard />
        {/* Mapeamos sobre los niveles y creamos una LevelCard para cada uno */}
        {levels.map(level => (
          <LevelCard
            key={level.level_code}
            level_code={level.level_code}
            title={level.title}
            description={level.description}
            progress="---" // Dato temporal
            lessons={level.lessons} // Pasamos la lista de lecciones al componente LevelCard
          />
        ))}
      </main>
    </div>
  );
}


// Componente principal que maneja las rutas
function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutor" element={<TutorPage />} />
        <Route path="/lesson/:lesson_id" element={<LessonPage />} />
      </Route>
    </Routes>
  )
}

export default App;