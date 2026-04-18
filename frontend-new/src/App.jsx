import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");

  // Employee states
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [employeeSort, setEmployeeSort] = useState("default");

  // Product / Inventory states
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productReorderLevel, setProductReorderLevel] = useState("");
  const [editProductId, setEditProductId] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [productSort, setProductSort] = useState("default");

  // Attendance states
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("Present");

  // Leave states
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveEmployeeId, setLeaveEmployeeId] = useState("");
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [leaveStatus, setLeaveStatus] = useState("Pending");
  const [editLeaveId, setEditLeaveId] = useState(null);

  // Orders / Sales states
  const [orders, setOrders] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");
  const [orderDate, setOrderDate] = useState("");

  // ================= EMPLOYEES =================
  const fetchEmployees = () => {
    fetch("http://localhost:5000/employees")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          setEmployees([]);
        }
      })
      .catch((err) => console.log("Error fetching employees:", err));
  };

  const addEmployee = () => {
    if (!name || !role) {
      alert("Fill all employee fields");
      return;
    }

    if (editId) {
      fetch(`http://localhost:5000/employees/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, role }),
      })
        .then((res) => res.json())
        .then(() => {
          fetchEmployees();
          setEditId(null);
          setName("");
          setRole("");
        })
        .catch((err) => console.log("Error updating employee:", err));

      return;
    }

    fetch("http://localhost:5000/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, role }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchEmployees();
        setName("");
        setRole("");
      })
      .catch((err) => console.log("Error adding employee:", err));
  };

  const deleteEmployee = (id) => {
    fetch(`http://localhost:5000/employees/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchEmployees();
        fetchAttendance();
        fetchLeaveRequests();
      })
      .catch((err) => console.log("Error deleting employee:", err));
  };

  const editEmployee = (emp) => {
    setName(emp.name);
    setRole(emp.role);
    setEditId(emp.id);
    setPage("employees");
  };

  // ================= PRODUCTS / INVENTORY =================
  const fetchProducts = () => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.log("Error fetching products:", err);
        setProducts([]);
      });
  };

  const addProduct = () => {
    if (
      !productName ||
      !productPrice ||
      !productQuantity ||
      !productReorderLevel
    ) {
      alert("Fill all product fields");
      return;
    }

    const payload = {
      name: productName,
      price: Number(productPrice),
      quantity: Number(productQuantity),
      reorderLevel: Number(productReorderLevel),
    };

    if (editProductId) {
      fetch(`http://localhost:5000/products/${editProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => {
          fetchProducts();
          setEditProductId(null);
          setProductName("");
          setProductPrice("");
          setProductQuantity("");
          setProductReorderLevel("");
        })
        .catch((err) => console.log("Error updating product:", err));

      return;
    }

    fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        fetchProducts();
        setProductName("");
        setProductPrice("");
        setProductQuantity("");
        setProductReorderLevel("");
      })
      .catch((err) => console.log("Error adding product:", err));
  };

  const deleteProduct = (id) => {
    fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchProducts();
        fetchOrders();
      })
      .catch((err) => console.log("Error deleting product:", err));
  };

  const editProduct = (product) => {
    setProductName(product.name);
    setProductPrice(product.price);
    setProductQuantity(product.quantity);
    setProductReorderLevel(product.reorderLevel);
    setEditProductId(product.id);
    setPage("products");
  };

  // ================= ATTENDANCE =================
  const fetchAttendance = () => {
    fetch("http://localhost:5000/attendance")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAttendanceRecords(data);
        } else {
          setAttendanceRecords([]);
        }
      })
      .catch((err) => {
        console.log("Error fetching attendance:", err);
        setAttendanceRecords([]);
      });
  };

  const addAttendance = () => {
    if (!selectedEmployeeId || !attendanceDate || !attendanceStatus) {
      alert("Fill all attendance fields");
      return;
    }

    fetch("http://localhost:5000/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: Number(selectedEmployeeId),
        date: new Date(attendanceDate).toISOString(),
        status: attendanceStatus,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchAttendance();
        setSelectedEmployeeId("");
        setAttendanceDate("");
        setAttendanceStatus("Present");
      })
      .catch((err) => console.log("Error adding attendance:", err));
  };

  const deleteAttendance = (id) => {
    fetch(`http://localhost:5000/attendance/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchAttendance();
      })
      .catch((err) => console.log("Error deleting attendance:", err));
  };

  // ================= LEAVE REQUESTS =================
  const fetchLeaveRequests = () => {
    fetch("http://localhost:5000/leave-requests")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLeaveRequests(data);
        } else {
          setLeaveRequests([]);
        }
      })
      .catch((err) => console.log("Error fetching leave requests:", err));
  };

  const addLeaveRequest = () => {
    if (
      !leaveEmployeeId ||
      !leaveType ||
      !leaveStartDate ||
      !leaveEndDate ||
      !leaveStatus
    ) {
      alert("Fill all leave fields");
      return;
    }

    const payload = {
      employeeId: Number(leaveEmployeeId),
      leaveType,
      startDate: new Date(leaveStartDate).toISOString(),
      endDate: new Date(leaveEndDate).toISOString(),
      status: leaveStatus,
    };

    if (editLeaveId) {
      fetch(`http://localhost:5000/leave-requests/${editLeaveId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaveType,
          startDate: new Date(leaveStartDate).toISOString(),
          endDate: new Date(leaveEndDate).toISOString(),
          status: leaveStatus,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          fetchLeaveRequests();
          setEditLeaveId(null);
          setLeaveEmployeeId("");
          setLeaveType("Sick Leave");
          setLeaveStartDate("");
          setLeaveEndDate("");
          setLeaveStatus("Pending");
        })
        .catch((err) => console.log("Error updating leave request:", err));
      return;
    }

    fetch("http://localhost:5000/leave-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        fetchLeaveRequests();
        setLeaveEmployeeId("");
        setLeaveType("Sick Leave");
        setLeaveStartDate("");
        setLeaveEndDate("");
        setLeaveStatus("Pending");
      })
      .catch((err) => console.log("Error adding leave request:", err));
  };

  const deleteLeaveRequest = (id) => {
    fetch(`http://localhost:5000/leave-requests/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => fetchLeaveRequests())
      .catch((err) => console.log("Error deleting leave request:", err));
  };

  const editLeaveRequest = (request) => {
    setLeaveEmployeeId(request.employeeId);
    setLeaveType(request.leaveType);
    setLeaveStartDate(new Date(request.startDate).toISOString().split("T")[0]);
    setLeaveEndDate(new Date(request.endDate).toISOString().split("T")[0]);
    setLeaveStatus(request.status);
    setEditLeaveId(request.id);
    setPage("leave");
  };

  // ================= ORDERS / SALES =================
  const fetchOrders = () => {
    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => console.log("Error fetching orders:", err));
  };

  const addOrder = () => {
    if (!selectedProductId || !orderQuantity || !orderDate) {
      alert("Fill all order fields");
      return;
    }

    fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: Number(selectedProductId),
        quantity: Number(orderQuantity),
        orderDate: new Date(orderDate).toISOString(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.message === "Insufficient stock") {
          alert("Insufficient stock");
          return;
        }
        if (data?.message === "Product not found") {
          alert("Product not found");
          return;
        }
        fetchOrders();
        fetchProducts();
        setSelectedProductId("");
        setOrderQuantity("");
        setOrderDate("");
      })
      .catch((err) => console.log("Error adding order:", err));
  };

  const deleteOrder = (id) => {
    fetch(`http://localhost:5000/orders/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchOrders();
        fetchProducts();
      })
      .catch((err) => console.log("Error deleting order:", err));
  };

  // ================= LOGIN =================
  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Please fill all fields");
    } else {
      setIsLoggedIn(true);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchEmployees();
    fetchProducts();
    fetchAttendance();
    fetchLeaveRequests();
    fetchOrders();
  }, []);

  // ================= DERIVED DATA =================
  const lowStockProducts = products.filter(
    (p) => Number(p.quantity) <= Number(p.reorderLevel)
  );

  const presentCountToday = attendanceRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = attendanceRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const leaveCount = attendanceRecords.filter(
    (record) => record.status === "Leave"
  ).length;

  const pendingLeaves = leaveRequests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedLeaves = leaveRequests.filter(
    (request) => request.status === "Approved"
  ).length;

  const totalInventoryValue = products.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  const totalStockUnits = products.reduce(
    (sum, product) => sum + Number(product.quantity),
    0
  );

  const averageProductPrice =
    products.length > 0
      ? (
          products.reduce((sum, product) => sum + Number(product.price), 0) /
          products.length
        ).toFixed(2)
      : 0;

  const totalSalesAmount = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount),
    0
  );

  const sortedEmployees = [...employees]
    .filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (employeeSort === "name-asc") return a.name.localeCompare(b.name);
      if (employeeSort === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  const sortedProducts = [...products]
    .filter((p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (productSort === "name-asc") return a.name.localeCompare(b.name);
      if (productSort === "name-desc") return b.name.localeCompare(a.name);
      if (productSort === "price-low") return Number(a.price) - Number(b.price);
      if (productSort === "price-high") return Number(b.price) - Number(a.price);
      return 0;
    });

  // ================= LOGGED IN UI =================
  if (isLoggedIn) {
    return (
      <div className="layout">
        <div className="sidebar">
          <h2>ERP</h2>
          <ul>
            <li onClick={() => setPage("dashboard")}>Dashboard</li>
            <li onClick={() => setPage("employees")}>Employees</li>
            <li onClick={() => setPage("products")}>Products</li>
            <li onClick={() => setPage("attendance")}>Attendance</li>
            <li onClick={() => setPage("reports")}>Reports</li>
            <li onClick={() => setPage("leave")}>Leave</li>
            <li onClick={() => setPage("orders")}>Orders</li>
          </ul>

          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>
        </div>

        <div className="main">
          {page === "dashboard" && (
            <>
              <h1>Dashboard</h1>
              <p className="welcome-text">Welcome Admin</p>

              <div className="cards">
                <div className="card">Employees: {employees.length}</div>
                <div className="card">Products: {products.length}</div>
                <div className="card">Low Stock: {lowStockProducts.length}</div>
                <div className="card">Present Today: {presentCountToday}</div>
                <div className="card">Pending Leaves: {pendingLeaves}</div>
                <div className="card">
                  Sales: ₹{totalSalesAmount.toFixed(2)}
                </div>
              </div>

              <div className="section-box">
                <h2>Low Stock Alerts</h2>
                {lowStockProducts.length === 0 ? (
                  <p className="empty-text">All products are sufficiently stocked.</p>
                ) : (
                  <ul className="alert-list">
                    {lowStockProducts.map((product) => (
                      <li key={product.id}>
                        {product.name} — Qty: {product.quantity}, Reorder Level:{" "}
                        {product.reorderLevel}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="section-box">
                <h2>Quick Summary</h2>
                <p>Total Stock Units: {totalStockUnits}</p>
                <p>Inventory Value: ₹{totalInventoryValue.toFixed(2)}</p>
                <p>Approved Leaves: {approvedLeaves}</p>
                <p>Average Product Price: ₹{averageProductPrice}</p>
              </div>
            </>
          )}

          {page === "employees" && (
            <>
              <h1>Employees</h1>

              <input
                className="search-box"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={employeeSort}
                onChange={(e) => setEmployeeSort(e.target.value)}
                className="search-box"
              >
                <option value="default">Sort Employees</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>

              <div className="form-row">
                <input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  placeholder="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />

                <button onClick={addEmployee}>
                  {editId ? "Update Employee" : "Add Employee"}
                </button>
              </div>

              {employees.length === 0 ? (
                <p className="empty-text">No employees found.</p>
              ) : (
                <table border="1" cellPadding="10">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEmployees.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.name}</td>
                        <td>{emp.role}</td>
                        <td>
                          <button onClick={() => editEmployee(emp)}>Edit</button>
                          <button onClick={() => deleteEmployee(emp.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {page === "products" && (
            <>
              <h1>Products / Inventory</h1>

              <input
                className="search-box"
                placeholder="Search product..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />

              <select
                value={productSort}
                onChange={(e) => setProductSort(e.target.value)}
                className="search-box"
              >
                <option value="default">Sort Products</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-low">Price Low-High</option>
                <option value="price-high">Price High-Low</option>
              </select>

              <div className="form-row inventory-form">
                <input
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />

                <input
                  placeholder="Price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />

                <input
                  placeholder="Quantity"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                />

                <input
                  placeholder="Reorder Level"
                  value={productReorderLevel}
                  onChange={(e) => setProductReorderLevel(e.target.value)}
                />

                <button onClick={addProduct}>
                  {editProductId ? "Update Product" : "Add Product"}
                </button>
              </div>

              {products.length === 0 ? (
                <p className="empty-text">No products found.</p>
              ) : (
                <table border="1" cellPadding="10">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Reorder Level</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.quantity}</td>
                        <td>{p.reorderLevel}</td>
                        <td>
                          {Number(p.quantity) <= Number(p.reorderLevel) ? (
                            <span className="status-low">Low Stock</span>
                          ) : (
                            <span className="status-good">In Stock</span>
                          )}
                        </td>
                        <td>
                          <button onClick={() => editProduct(p)}>Edit</button>
                          <button onClick={() => deleteProduct(p.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {page === "attendance" && (
            <>
              <h1>Attendance</h1>

              <div className="form-row inventory-form">
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />

                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                </select>

                <button onClick={addAttendance}>Mark Attendance</button>
              </div>

              {attendanceRecords.length === 0 ? (
                <p className="empty-text">No attendance records found.</p>
              ) : (
                <table border="1" cellPadding="10">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.employee?.name}</td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.status}</td>
                        <td>
                          <button onClick={() => deleteAttendance(record.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {page === "reports" && (
            <>
              <h1>Reports</h1>

              <div className="cards">
                <div className="card">Total Employees: {employees.length}</div>
                <div className="card">Total Products: {products.length}</div>
                <div className="card">Total Stock Units: {totalStockUnits}</div>
                <div className="card">
                  Inventory Value: ₹{totalInventoryValue.toFixed(2)}
                </div>
              </div>

              <div className="cards" style={{ marginTop: "20px" }}>
                <div className="card">Present: {presentCountToday}</div>
                <div className="card">Absent: {absentCount}</div>
                <div className="card">Leave: {leaveCount}</div>
                <div className="card">
                  Avg Product Price: ₹{averageProductPrice}
                </div>
              </div>

              <div className="cards" style={{ marginTop: "20px" }}>
                <div className="card">Pending Leaves: {pendingLeaves}</div>
                <div className="card">Approved Leaves: {approvedLeaves}</div>
                <div className="card">
                  Total Sales: ₹{totalSalesAmount.toFixed(2)}
                </div>
              </div>

              <div className="section-box">
                <h2>Low Stock Report</h2>
                {lowStockProducts.length === 0 ? (
                  <p className="empty-text">No low stock products.</p>
                ) : (
                  <table border="1" cellPadding="10">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Reorder Level</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.quantity}</td>
                          <td>{product.reorderLevel}</td>
                          <td>Low Stock</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="section-box">
                <h2>Attendance Summary</h2>
                {attendanceRecords.length === 0 ? (
                  <p className="empty-text">No attendance records available.</p>
                ) : (
                  <table border="1" cellPadding="10">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{record.employee?.name}</td>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {page === "leave" && (
            <>
              <h1>Leave Management</h1>

              <div className="form-row inventory-form">
                <select
                  value={leaveEmployeeId}
                  onChange={(e) => setLeaveEmployeeId(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>

                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Vacation">Vacation</option>
                </select>

                <input
                  type="date"
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                />

                <input
                  type="date"
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                />

                <select
                  value={leaveStatus}
                  onChange={(e) => setLeaveStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button onClick={addLeaveRequest}>
                  {editLeaveId ? "Update Leave" : "Add Leave"}
                </button>
              </div>

              {leaveRequests.length === 0 ? (
                <p className="empty-text">No leave requests found.</p>
              ) : (
                <table border="1" cellPadding="10">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td>{request.employee?.name}</td>
                        <td>{request.leaveType}</td>
                        <td>{new Date(request.startDate).toLocaleDateString()}</td>
                        <td>{new Date(request.endDate).toLocaleDateString()}</td>
                        <td>{request.status}</td>
                        <td>
                          <button onClick={() => editLeaveRequest(request)}>
                            Edit
                          </button>
                          <button onClick={() => deleteLeaveRequest(request.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {page === "orders" && (
            <>
              <h1>Orders / Sales</h1>

              <div className="form-row inventory-form">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.quantity})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Quantity"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                />

                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />

                <button onClick={addOrder}>Add Order</button>
              </div>

              {orders.length === 0 ? (
                <p className="empty-text">No orders found.</p>
              ) : (
                <table border="1" cellPadding="10">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Total Amount</th>
                      <th>Order Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.product?.name}</td>
                        <td>{order.quantity}</td>
                        <td>₹{order.totalAmount}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>
                          <button onClick={() => deleteOrder(order.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ================= LOGIN UI =================
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>ERP Login</h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default App;