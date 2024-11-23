import React, { useState } from 'react';

const Registration = ({ onLogin, users, setUsers }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'login') {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === loginData.email && u.password === loginData.password
    );

    if (user) {
      onLogin(user);
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
    } else {
      const existingUser = users.find((u) => u.email === registerData.email);
      if (existingUser) {
        setError('El correo ya está registrado');
      } else {
        const newUser = {
          email: registerData.email,
          password: registerData.password,
          role: 'client',
        };
        setUsers([...users, newUser]);
        alert('Registro exitoso. Por favor, verifica tu correo electrónico.');
        setIsRegistering(false);
        setError('');
      }
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">

      <div
        className="col-md-6 d-flex align-items-center justify-content-center bg-primary text-white"
        style={{ padding: 0, margin: 0, height: '100vh' }}
      >
        <img
          src={require('../img/crm.jpg')}
          alt="CRM Illustration"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

  <div className="col-md-6 d-flex align-items-center justify-content-center">
    <div className="w-75">
      <h1 className="text-center">Bienvenido a EMPSA</h1>
      <p className="text-center">Administra tus clientes y mejora tu productividad.</p>
      <div className="card-body">
        {!isRegistering ? (
          <>
            <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label">Correo:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={loginData.email}
                  onChange={(e) => handleInputChange(e, 'login')}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={loginData.password}
                  onChange={(e) => handleInputChange(e, 'login')}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Iniciar Sesión
              </button>
            </form>
            {error && <p className="text-danger mt-3 text-center">{error}</p>}

            <p className="text-center mt-3">
              ¿No está registrado?{' '}
              <button
                className="btn btn-link"
                onClick={() => setIsRegistering(true)}
              >
                Regístrese aquí
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="card-title text-center mb-4">Registrarse</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-3">
                <label className="form-label">Correo:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={registerData.email}
                  onChange={(e) => handleInputChange(e, 'register')}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={registerData.password}
                  onChange={(e) => handleInputChange(e, 'register')}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar Contraseña:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={registerData.confirmPassword}
                  onChange={(e) => handleInputChange(e, 'register')}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Registrarse
              </button>
            </form>
            {error && <p className="text-danger mt-3 text-center">{error}</p>}

            <p className="text-center mt-3">
              ¿Ya tiene una cuenta?{' '}
              <button
                className="btn btn-link"
                onClick={() => setIsRegistering(false)}
              >
                Inicie Sesión
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  </div>
</div>
  );
};

export default Registration;

