import React, { useState } from "react";
import "jspdf-autotable";

const ClientView = ({ onLogout, invoices, setInvoices, setQuotes, quotes, onReportPayment }) => {
  const [currentTab, setCurrentTab] = useState("quotes");
  const [client, setClient] = useState({
    name: "Cliente Demo",
    email: "client@crm.com",
    profileImage: "https://via.placeholder.com/50",
  });

  const [formData, setFormData] = useState({
    email: client.email,
    password: "",
  });

  const [quoteRequest, setQuoteRequest] = useState({
    description: "",
    additionalDetails: "",
  });

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    document: null,
    date: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = () => {
    setClient({ ...client, email: formData.email });
    alert("Perfil actualizado exitosamente.");
  };

  const handleQuoteSubmit = () => {
    const newQuote = {
      id: quotes.length + 1,
      client: client.email,
      date: new Date().toLocaleDateString(),
      description: quoteRequest.description,
      additionalDetails: quoteRequest.additionalDetails,
    };

    setQuotes([...quotes, newQuote]);
    alert("Solicitud de cotización enviada.");
    setQuoteRequest({ description: "", additionalDetails: "" });
  };

  const handleReportPayment = () => {
    if (!selectedInvoice || !paymentDetails.document) {
      alert("Por favor, seleccione una factura y suba un soporte de pago.");
      return;
    }
  
    const updatedInvoices = invoices.map((invoice) => {
      if (invoice.id === selectedInvoice.id) {
        return { ...invoice, status: "cancelado" };
      }
      return invoice;
    });
    setInvoices(updatedInvoices);
  

    const payment = {
      client: client.email,
      invoiceId: selectedInvoice.id,
      amount: selectedInvoice.total,
      date: paymentDetails.date,
      products: selectedInvoice.products,
    };
  
    console.log('Enviando pago al App:', payment);
  
    onReportPayment(payment);
    alert("Pago reportado exitosamente.");
  
    setSelectedInvoice(null);
    setPaymentDetails({ document: null, date: new Date().toISOString().split("T")[0] });
  };
  

  const unpaidInvoices = invoices.filter(
    (invoice) => invoice.client === client.email && invoice.status !== "cancelado"
  );

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <div className="d-flex justify-content-between align-items-center bg-light p-3 shadow">
        <div className="d-flex align-items-center">
          <img
            src={client.profileImage}
            alt="Client Icon"
            className="rounded-circle me-2"
          />
          <span>{client.name}</span>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-danger" onClick={onLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="container mt-4">
        <div className="btn-group mb-4" role="group">
          <button
            className={`btn ${currentTab === "profile" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setCurrentTab("profile")}
          >
            Editar Perfil
          </button>

          <button
            className={`btn ${currentTab === "quotes" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setCurrentTab("quotes")}
          >
            Solicitar Cotización
          </button>

          <button
            className={`btn ${currentTab === "invoices" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setCurrentTab("invoices")}
          >
            Facturas Pendientes{" "}
            <span className="badge bg-secondary">{unpaidInvoices.length}</span>
          </button>
        </div>

        {currentTab === "quotes" && (
          <div className="card shadow">
            <div className="card-body">
              <h5>Solicitar Cotización</h5>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={quoteRequest.description}
                  onChange={(e) =>
                    setQuoteRequest({ ...quoteRequest, description: e.target.value })
                  }
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Detalles Adicionales</label>
                <textarea
                  className="form-control"
                  value={quoteRequest.additionalDetails}
                  onChange={(e) =>
                    setQuoteRequest({ ...quoteRequest, additionalDetails: e.target.value })
                  }
                  rows="3"
                />
              </div>
              <button className="btn btn-success" onClick={handleQuoteSubmit}>
                Enviar Solicitud
              </button>
            </div>
          </div>
        )}

        {currentTab === "invoices" && (
          <div className="card shadow">
            <div className="card-body">
              <h5>Facturas Pendientes</h5>
              {unpaidInvoices.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidInvoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>{invoice.date}</td>
                        <td>${invoice.total}</td>
                        <td>{invoice.status}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => setSelectedInvoice(invoice)}
                            data-bs-toggle="modal"
                            data-bs-target="#invoiceModal"
                          >
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay facturas pendientes.</p>
              )}
            </div>
          </div>
        )}

        {currentTab === "profile" && (
          <div className="card shadow">
            <div className="card-body">
              <h5>Editar Perfil</h5>
              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <button className="btn btn-success" onClick={handleSaveProfile}>
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="modal fade"
        id="invoiceModal"
        tabIndex="-1"
        aria-labelledby="invoiceModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="invoiceModalLabel">
                Detalles de la Factura
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setSelectedInvoice(null)}
              ></button>
            </div>
            <div className="modal-body">
              {selectedInvoice ? (
                <>
                  <p>
                    <strong>Factura ID:</strong> {selectedInvoice.id}
                  </p>
                  <p>
                    <strong>Total:</strong> ${selectedInvoice.total}
                  </p>
                  <div className="mb-3">
                    <label className="form-label">Subir Soporte</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        setPaymentDetails({ ...paymentDetails, document: e.target.files[0] })
                      }
                    />
                  </div>
                </>
              ) : (
                <p>No se seleccionó ninguna factura.</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setSelectedInvoice(null)}
              >
                Cerrar
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleReportPayment();
                  document.querySelector('#invoiceModal .btn-close').click();
                }}
              >
                Reportar Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientView;