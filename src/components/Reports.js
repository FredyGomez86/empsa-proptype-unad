import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const ReportsView = ({ payments, users, onLogout }) => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState('');

  // Obtener la lista de clientes desde users
  const clients = users
    .filter((user) => user.role === 'client')
    .map((user) => user.email);

  // Estado para almacenar las estadísticas de productos
  const [productStats, setProductStats] = useState({});

  // Procesar los pagos para obtener las estadísticas por producto
  useEffect(() => {
    const stats = {};

    payments.forEach((payment) => {
      if (Array.isArray(payment.products)) {
        payment.products.forEach((product) => {
          if (stats[product.name]) {
            stats[product.name] += product.quantity;
          } else {
            stats[product.name] = product.quantity;
          }
        });
      } else {
        console.warn(`El pago con ID ${payment.invoiceId} no tiene productos.`);
      }
    });

    setProductStats(stats);
  }, [payments]);

  // Datos para la gráfica de productos
  const productLabels = Object.keys(productStats);
  const productDataValues = Object.values(productStats);

  const productData = {
    labels: productLabels,
    datasets: [
      {
        label: 'Cantidad Vendida',
        data: productDataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Función para manejar el clic en "Volver"
  const handleBackClick = () => {
    navigate('/admin');
  };

  // Filtrar pagos por cliente seleccionado
  const clientPayments = payments.filter(
    (payment) => payment.client === selectedClient
  );

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      {/* Barra Superior */}
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

      {/* Contenido */}
      <div className="container mt-4">
        {/* Sección para reportes por cliente */}
        <h2>
          Reporte de compras del cliente{' '}
          {selectedClient ? selectedClient : '[Seleccione un cliente]'}
        </h2>
        {selectedClient && (
          <p>Este es el histórico de compras de nuestro cliente</p>
        )}

        {/* Selector de clientes */}
        <div className="mb-3">
          <label htmlFor="clientSelect" className="form-label">
            Seleccione un cliente:
          </label>
          <select
            id="clientSelect"
            className="form-select"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">-- Seleccione un cliente --</option>
            {clients.map((client, index) => (
              <option key={index} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>

        {/* Mostrar tabla de pagos del cliente */}
        {selectedClient && clientPayments.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto</th>
                <th>ID de Factura</th>
              </tr>
            </thead>
            <tbody>
              {clientPayments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.date}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.invoiceId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : selectedClient ? (
          <p>No hay datos de pagos para este cliente.</p>
        ) : (
          <p>Por favor, seleccione un cliente para ver el reporte.</p>
        )}

        {/* Nueva sección para estadísticas de productos vendidos */}
        <h2 className="mt-5">Estadísticas de Productos Vendidos</h2>
        {productLabels.length > 0 ? (
          <Bar data={productData} />
        ) : (
          <p>No hay datos de productos para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
