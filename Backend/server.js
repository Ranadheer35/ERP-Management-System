require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prisma = require("./prismaClient");

const app = express();

app.use(cors());
app.use(express.json());

const logAction = async (action, entity, details) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        details,
      },
    });
  } catch (err) {
    console.log("Audit log error:", err);
  }
};

// ================= EMPLOYEES APIs =================
app.get("/employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { id: "asc" },
    });
    res.json(employees);
  } catch (error) {
    console.error("GET /employees error:", error);
    res.status(500).json([]);
  }
});

app.post("/employees", async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: "Name and role required" });
    }

    const newEmployee = await prisma.employee.create({
      data: { name, role },
    });

    // ✅ AUDIT LOG
    await logAction("CREATE", "Employee", `Added ${newEmployee.name}`);

    res.json(newEmployee);
  } catch (error) {
    console.error("POST /employees error:", error);
    res.status(500).json({ message: "Failed to add employee" });
  }
});

app.put("/employees/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, role } = req.body;

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: { name, role },
    });

    // ✅ AUDIT LOG
    await logAction("UPDATE", "Employee", `Updated ${updatedEmployee.name}`);

    res.json(updatedEmployee);
  } catch (error) {
    console.error("PUT /employees error:", error);
    res.status(500).json({ message: "Failed to update employee" });
  }
});

app.delete("/employees/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.employee.delete({
      where: { id },
    });

    // ✅ AUDIT LOG
    await logAction("DELETE", "Employee", `Deleted employee ID ${id}`);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /employees error:", error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
});


// ================= PRODUCTS / INVENTORY APIs =================
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });
    res.json(products);
  } catch (error) {
    console.error("GET /products error:", error);
    res.status(500).json([]);
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, price, quantity, reorderLevel } = req.body;

    if (
      !name ||
      price === undefined ||
      quantity === undefined ||
      reorderLevel === undefined
    ) {
      return res.status(400).json({
        message: "Name, price, quantity and reorder level are required",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        quantity: Number(quantity),
        reorderLevel: Number(reorderLevel),
      },
    });

    res.json(product);
  } catch (error) {
    console.error("POST /products error:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, price, quantity, reorderLevel } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        quantity: Number(quantity),
        reorderLevel: Number(reorderLevel),
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("PUT /products error:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /products error:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// ================= ATTENDANCE APIs =================
app.get("/attendance", async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      include: { employee: true },
      orderBy: { id: "desc" },
    });
    res.json(records);
  } catch (error) {
    console.error("GET /attendance error:", error);
    res.status(500).json([]);
  }
});

app.post("/attendance", async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        message: "employeeId, date and status are required",
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: Number(employeeId),
        date: new Date(date),
        status,
      },
      include: { employee: true },
    });

    res.json(attendance);
  } catch (error) {
    console.error("POST /attendance error:", error);
    res.status(500).json({ message: "Error adding attendance" });
  }
});

app.delete("/attendance/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.attendance.delete({
      where: { id },
    });

    res.json({ message: "Attendance deleted successfully" });
  } catch (error) {
    console.error("DELETE /attendance error:", error);
    res.status(500).json({ message: "Error deleting attendance" });
  }
});

// ================= LEAVE REQUEST APIs =================
app.get("/leave-requests", async (req, res) => {
  try {
    const requests = await prisma.leaveRequest.findMany({
      include: { employee: true },
      orderBy: { id: "desc" },
    });
    res.json(requests);
  } catch (error) {
    console.error("GET /leave-requests error:", error);
    res.status(500).json([]);
  }
});

app.post("/leave-requests", async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, status } = req.body;

    if (!employeeId || !leaveType || !startDate || !endDate || !status) {
      return res.status(400).json({
        message: "employeeId, leaveType, startDate, endDate, status are required",
      });
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: Number(employeeId),
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      },
      include: { employee: true },
    });

    res.json(leaveRequest);
  } catch (error) {
    console.error("POST /leave-requests error:", error);
    res.status(500).json({ message: "Error adding leave request" });
  }
});

app.put("/leave-requests/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { leaveType, startDate, endDate, status } = req.body;

    const updatedRequest = await prisma.leaveRequest.update({
      where: { id },
      data: {
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      },
      include: { employee: true },
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error("PUT /leave-requests error:", error);
    res.status(500).json({ message: "Error updating leave request" });
  }
});

app.delete("/leave-requests/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.leaveRequest.delete({
      where: { id },
    });

    res.json({ message: "Leave request deleted successfully" });
  } catch (error) {
    console.error("DELETE /leave-requests error:", error);
    res.status(500).json({ message: "Error deleting leave request" });
  }
});

// ================= SALES / ORDERS APIs =================
app.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { product: true },
      orderBy: { id: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error("GET /orders error:", error);
    res.status(500).json([]);
  }
});

app.post("/orders", async (req, res) => {
  try {
    const { productId, quantity, orderDate } = req.body;

    if (!productId || !quantity || !orderDate) {
      return res.status(400).json({
        message: "productId, quantity and orderDate are required",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (Number(quantity) > Number(product.quantity)) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const totalAmount = Number(product.price) * Number(quantity);

    const order = await prisma.order.create({
      data: {
        productId: Number(productId),
        quantity: Number(quantity),
        totalAmount,
        orderDate: new Date(orderDate),
      },
      include: { product: true },
    });

    await prisma.product.update({
      where: { id: Number(productId) },
      data: {
        quantity: Number(product.quantity) - Number(quantity),
      },
    });

    res.json(order);
  } catch (error) {
    console.error("POST /orders error:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

app.delete("/orders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await prisma.product.update({
      where: { id: order.productId },
      data: {
        quantity: Number(order.product.quantity) + Number(order.quantity),
      },
    });

    await prisma.order.delete({
      where: { id },
    });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("DELETE /orders error:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
});

// ================= PAYROLL APIs =================
app.get("/payroll", async (req, res) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: { employee: true },
      orderBy: { id: "desc" },
    });
    res.json(payrolls);
  } catch (error) {
    console.error("GET /payroll error:", error);
    res.status(500).json([]);
  }
});

app.post("/payroll", async (req, res) => {
  try {
    const { employeeId, month, baseSalary, bonus, deduction } = req.body;

    if (
      !employeeId ||
      !month ||
      baseSalary === undefined ||
      bonus === undefined ||
      deduction === undefined
    ) {
      return res.status(400).json({
        message: "employeeId, month, baseSalary, bonus and deduction are required",
      });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: Number(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const netSalary =
      Number(baseSalary) + Number(bonus) - Number(deduction);

    const payroll = await prisma.payroll.create({
      data: {
        employeeId: Number(employeeId),
        month,
        baseSalary: Number(baseSalary),
        bonus: Number(bonus),
        deduction: Number(deduction),
        netSalary,
      },
      include: { employee: true },
    });

    res.json(payroll);
  } catch (error) {
    console.error("POST /payroll error:", error);
    res.status(500).json({ message: "Error adding payroll" });
  }
});

app.delete("/payroll/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.payroll.delete({
      where: { id },
    });

    res.json({ message: "Payroll deleted successfully" });
  } catch (error) {
    console.error("DELETE /payroll error:", error);
    res.status(500).json({ message: "Error deleting payroll" });
  }
});

// ================= PROJECT MANAGEMENT =================

// GET projects
app.get("/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "desc" },
    });
    res.json(projects);
  } catch (error) {
    console.error("GET /projects error:", error);
    res.status(500).json([]);
  }
});

// ADD project
app.post("/projects", async (req, res) => {
  try {
    const { name, description, budget, status } = req.body;

    if (!name || !description || !budget || !status) {
      return res.status(400).json({ message: "Fill all fields" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        budget: Number(budget),
        status,
      },
    });

    await logAction("CREATE", "Project", `Added ${project.name}`);

    res.json(project);
  } catch (error) {
    console.error("POST /projects error:", error);
    res.status(500).json({ message: "Error adding project" });
  }
});

// DELETE project
app.delete("/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.project.delete({
      where: { id },
    });

    await logAction("DELETE", "Project", `Deleted project ID ${id}`);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /projects error:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
});

// ================= NOTIFICATIONS APIs =================
app.get("/notifications", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    const leaveRequests = await prisma.leaveRequest.findMany({
      include: { employee: true },
    });
    const payrolls = await prisma.payroll.findMany({
      include: { employee: true },
    });
    const orders = await prisma.order.findMany({
      include: { product: true },
      orderBy: { id: "desc" },
      take: 5,
    });
    const employees = await prisma.employee.findMany();

    const notifications = [];

    products.forEach((product) => {
      if (Number(product.quantity) <= Number(product.reorderLevel)) {
        notifications.push({
          type: "Low Stock",
          message: `${product.name} is low on stock. Qty: ${product.quantity}, Reorder Level: ${product.reorderLevel}`,
        });
      }
    });

    leaveRequests.forEach((leave) => {
      if (leave.status === "Pending") {
        notifications.push({
          type: "Leave Pending",
          message: `${leave.employee?.name} has a pending ${leave.leaveType} request.`,
        });
      }
    });

    employees.forEach((employee) => {
      const hasPayroll = payrolls.some((p) => p.employeeId === employee.id);
      if (!hasPayroll) {
        notifications.push({
          type: "Payroll Missing",
          message: `Payroll record is missing for ${employee.name}.`,
        });
      }
    });

    orders.forEach((order) => {
      notifications.push({
        type: "Recent Order",
        message: `Order placed for ${order.product?.name} - Quantity: ${order.quantity}, Amount: ₹${order.totalAmount}`,
      });
    });

    res.json(notifications);
  } catch (error) {
    console.error("GET /notifications error:", error);
    res.status(500).json([]);
  }
});

// ================= AUDIT LOG API =================
app.get("/audit-logs", async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(logs);
  } catch (error) {
    console.error("Audit log fetch error:", error);
    res.status(500).json([]);
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});