import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Survey = ({ users, setUsers, onLogout }) => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'client',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddUser = () => {
    if (!newUser.email || !newUser.password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const userExists = users.some((user) => user.email === newUser.email);
    if (userExists) {
      alert('Ya existe un usuario con este correo electrónico.');
      return;
    }

    setUsers((prevUsers) => [...prevUsers, newUser]);
    alert('Usuario creado exitosamente.');
    setNewUser({ email: '', password: '', role: 'client' });
  };

  const handleBackClick = () => {
    navigate('/admin');
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <div className="d-flex justify-content-between align-items-center bg-light p-3 shadow">
        <div className="d-flex align-items-center">
          <img
            src="https://via.placeholder.com/50"
            alt="Admin Icon"
            className="rounded-circle me-2"
          />
          <span>Admin</span>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-secondary me-2" onClick={handleBackClick}>
            Volver
          </button>
          <button className="btn btn-outline-danger" onClick={onLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="container card shadow mt-4">
        <div className="card-body">
          <h5>Crear Nuevo Usuario</h5>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rol</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="client">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleAddUser}>
            Agregar Usuario
          </button>
        </div>
      </div>

      <div className="container card shadow mt-4">
        <div className="card-body">
          <h5>Usuarios Existentes</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Correo Electrónico</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Survey;
