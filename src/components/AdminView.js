import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminView = ({
  onLogout,
  users,
  invoices,
  setInvoices,
  quotes,
}) => {
  const [currentTab, setCurrentTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    email: 'admin@crm.com',
    password: 'admin123',
  });

  const [formData, setFormData] = useState({
    email: admin.email,
    password: '',
  });

  const [products, setProducts] = useState([
    { id: 1, name: 'Producto A', price: 100, stock: 50, quantity: 1 },
    { id: 2, name: 'Producto B', price: 200, stock: 30, quantity: 1 },
    { id: 3, name: 'Producto C', price: 300, stock: 20, quantity: 1 },
  ]);

  const [searchProduct, setSearchProduct] = useState('');
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const [invoiceData, setInvoiceData] = useState({
    client: '',
    products: [],
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
  });

  const handleSaveProfile = () => {
    setAdmin({ ...admin, email: formData.email, password: formData.password });
    setEditMode(false);
  };

  const handleCreateInvoice = () => {
    if (!invoiceData.client) {
      alert('Por favor, seleccione un cliente.');
      return;
    }
    if (invoiceData.products.length === 0) {
      alert('Por favor, agregue al menos un producto a la factura.');
      return;
    }

    const newInvoice = {
      id: invoices.length + 1,
      client: invoiceData.client,
      date: new Date().toLocaleDateString(),
      products: invoiceData.products, 
      total: calculateTotal(),
      status: 'pendiente',
    };

    setInvoices([...invoices, newInvoice]);
    alert('Factura creada exitosamente.');
    setInvoiceData({ client: '', products: [] });
  };

  const addProductToInvoice = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const quantityToAdd = product.quantity || 1;

    const existingProduct = invoiceData.products.find((p) => p.id === product.id);
    if (existingProduct) {
      const newQuantity = existingProduct.quantity + quantityToAdd;
      updateProductQuantity(
        invoiceData.products.indexOf(existingProduct),
        newQuantity
      );
    } else {
      setInvoiceData((prevData) => ({
        ...prevData,
        products: [
          ...prevData.products,
          { ...product, quantity: quantityToAdd },
        ],
      }));
    }

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, quantity: 1 } : p
      )
    );
  };

  const handleProductQuantityChange = (productId, quantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: parseInt(quantity, 10) || 1 }
          : product
      )
    );
  };

  const updateProductQuantity = (index, quantity) => {
    if (quantity < 1) {
      alert('La cantidad debe ser al menos 1.');
      return;
    }
    const updatedProducts = [...invoiceData.products];
    updatedProducts[index].quantity = quantity;
    setInvoiceData({ ...invoiceData, products: updatedProducts });
  };

  const calculateTotal = () => {
    return invoiceData.products.reduce(
      (total, product) => total + product.quantity * product.price,
      0
    );
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Factura', 20, 10);
    doc.autoTable({
      head: [['Producto', 'Cantidad', 'Precio', 'Subtotal']],
      body: invoiceData.products.map((product) => [
        product.name,
        product.quantity,
        `$${product.price}`,
        `$${product.quantity * product.price}`,
      ]),
    });
    doc.text(`Total: $${calculateTotal()}`, 20, doc.lastAutoTable.finalY + 10);
    doc.save('factura.pdf');
  };

  const sendToClient = () => {
    if (!invoiceData.client) {
      alert('No hay factura para enviar.');
      return;
    }
    generatePDF();
    alert(`Factura enviada al cliente: ${invoiceData.client}`);
  };

  const addNewProduct = () => {
    if (!newProduct.name || newProduct.price <= 0 || newProduct.stock < 0) {
      alert('Por favor, complete todos los campos correctamente para agregar un producto.');
      return;
    }
    setProducts((prevProducts) => [
      ...prevProducts,
      { ...newProduct, id: prevProducts.length + 1, quantity: 1 },
    ]);
    setNewProduct({ name: '', price: 0, stock: 0 });
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleReportsClick = () => {
    navigate('/reports');
  };

  const handleUserManagementClick = () => {
    navigate('/survey');
  };

  useEffect(() => {
    console.log('Users:', users);
    console.log('Filtered clients:', clients);
  }, [users]);

  const clients = users?.filter((user) => user?.role === 'client') || [];

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0">
      <div className="d-flex justify-content-between align-items-center bg-light p-3 shadow">
        <div className="d-flex align-items-center">
          <img
            src="https://via.placeholder.com/50"
            alt="Admin Icon"
            className="rounded-circle me-2"
          />
          <span>{admin.email}</span>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-secondary me-2" onClick={handleUserManagementClick}>
            Gestión de Usuarios
          </button>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={handleReportsClick}
          >
            Reportes
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="container mt-4">
        <div className="btn-group mb-4" role="group">
          <button
            className={`btn ${
              currentTab === 'profile' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setCurrentTab('profile')}
          >
            Editar Perfil
          </button>
          <button
            className={`btn ${
              currentTab === 'quotes' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setCurrentTab('quotes')}
          >
            Solicitudes de Cotización
          </button>
          <button
            className={`btn ${
              currentTab === 'invoices' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setCurrentTab('invoices')}
          >
            Generar Facturas
          </button>
          <button
            className={`btn ${
              currentTab === 'prices' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setCurrentTab('prices')}
          >
            Lista de Precios
          </button>
        </div>

        {currentTab === 'profile' && (
          <div className="card shadow">
            <div className="card-body">
              <h5>Editar Perfil</h5>
              {editMode ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="form-control"
                    />
                  </div>
                  <button
                    className="btn btn-success me-2"
                    onClick={handleSaveProfile}
                  >
                    Guardar Cambios
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <strong>Correo:</strong> {admin.email}
                  </p>
                  <p>
                    <strong>Contraseña:</strong> ********
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    Editar Perfil
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {currentTab === 'quotes' && (
          <div className="card shadow">
            <div className="card-body">
              <h5>Solicitudes de Cotización</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Correo</th>
                    <th>Descripción</th>
                    <th>Detalles Adicionales</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id}>
                      <td>{quote.id}</td>
                      <td>{quote.client}</td>
                      <td>{quote.email}</td>
                      <td>{quote.description}</td>
                      <td>{quote.additionalDetails}</td>
                      <td>{quote.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentTab === 'invoices' && (
          <div className="card shadow">
            <div className="card-body">
              <h5>Generar Factura</h5>
              <div className="mb-3">
                <label>Cliente:</label>
                <select
                  className="form-control"
                  value={invoiceData.client}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, client: e.target.value })
                  }
                >
                  <option value="">Seleccione un cliente</option>
                  {clients.map((client, index) => (
                    <option key={index} value={client.email}>
                      {client.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>Productos:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar productos..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
                <ul className="list-group mt-2">
                  {filteredProducts.map((product, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ cursor: 'pointer' }}
                    >
                      <div onClick={() => addProductToInvoice(product.id)}>
                        {product.name} - ${product.price}
                      </div>
                      <input
                        type="number"
                        className="form-control ms-2"
                        style={{ width: '80px' }}
                        min="1"
                        value={product.quantity || 1}
                        onChange={(e) =>
                          handleProductQuantityChange(product.id, e.target.value)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            updateProductQuantity(
                              index,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="form-control"
                          min="1"
                        />
                      </td>
                      <td>${product.price}</td>
                      <td>${product.quantity * product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h5>Total: ${calculateTotal()}</h5>
              <div className="d-flex">
                <button
                  className="btn btn-primary me-2"
                  onClick={handleCreateInvoice}
                >
                  Crear Factura
                </button>
                <button className="btn btn-success" onClick={sendToClient}>
                  Enviar al Cliente
                </button>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'prices' && (
          <div className="card shadow">
            <div className="card-body">
              <h5>Lista de Precios</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h5>Agregar Producto</h5>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del Producto"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Precio"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  min="0"
                  step="0.01"
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: parseInt(e.target.value, 10),
                    })
                  }
                  min="0"
                />
                <button className="btn btn-primary" onClick={addNewProduct}>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
