// src/pages/RegisterPage.jsx
import { useState } from 'react';

function RegisterPage() {
  // 1. Creamos "estados" para guardar el email y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. Esta función se ejecutará cuando se envíe el formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita que la página se recargue

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`¡Usuario registrado con éxito! ID: ${data.id}`);
        // Aquí, más adelante, redirigiremos al usuario a la página de login.
      } else {
        const errorData = await response.json();
        alert(`Error al registrar: ${errorData.detail}`);
      }
    } catch (error) {
      alert('Error de conexión. ¿El servidor del backend está encendido?');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h1>Crear una Cuenta</h1>
      {/* 3. Conectamos la función handleSubmit al formulario */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email} // 4. Conectamos el input al estado "email"
            onChange={(e) => setEmail(e.target.value)} // Y lo actualizamos al escribir
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password} // 5. Conectamos el input al estado "password"
            onChange={(e) => setPassword(e.target.value)} // Y lo actualizamos
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ padding: '0.75rem 1.5rem', border: 'none', background: '#6B46C1', color: 'white', cursor: 'pointer' }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;