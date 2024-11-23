import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import AdminView from './components/AdminView';
import ClientView from './components/ClientView';
import ReportsView from './components/Reports';
import Survey from './components/Survey';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  
  const [users, setUsers] = useState([
    { email: 'admin@crm.com', password: 'admin123', role: 'admin' },
    { email: 'client@crm.com', password: 'client123', role: 'client' },
  ]);

  const [currentUser, setCurrentUser] = useState(null);
  const [invoices, setInvoices] = useState(() => {
    const storedInvoices = localStorage.getItem('invoices');
    return storedInvoices ? JSON.parse(storedInvoices) : [];
  });
  const [quotes, setQuotes] = useState(() => {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
  });
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }, [quotes]);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setRole(user.role);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('');
    setCurrentUser(null);
  };

  const handleReportPayment = (payment) => {
    setPayments((prevPayments) => [...prevPayments, payment]);
  };
  
  useEffect(() => {
  }, [payments]);
  
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={role === 'admin' ? '/admin' : '/client'} />
            ) : (
              <Registration onLogin={handleLogin} users={users} setUsers={setUsers} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && role === 'admin' ? (
              <AdminView
                onLogout={handleLogout}
                users={users}
                invoices={invoices}
                setInvoices={setInvoices}
                quotes={quotes}
                setQuotes={setQuotes}
                currentUser={currentUser}
                payments={payments}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/client"
          element={
            isAuthenticated && role === 'client' ? (
              <ClientView
                onLogout={handleLogout}
                invoices={invoices}
                setInvoices={setInvoices}
                quotes={quotes}
                setQuotes={setQuotes}
                currentUser={currentUser}
                onReportPayment={handleReportPayment}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/reports"
          element={
            isAuthenticated && role === 'admin' ? (
              <ReportsView payments={payments} onLogout={handleLogout} users={users}/>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/survey"
          element={
            isAuthenticated && role === 'admin' ? (
              <Survey users={users} setUsers={setUsers} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;