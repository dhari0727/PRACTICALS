// app.js - Tax Form Website
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to read form data
app.use(express.urlencoded({ extended: false }));

// Serve static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Show form on GET /
app.get("/", (req, res) => {
  res.render("index", { error: null, result: null, inputs: { income1: "", income2: "" } });
});

// Handle form submission
app.post("/calculate", (req, res) => {
  let { income1 = "", income2 = "" } = req.body;

  // Trim inputs
  income1 = income1.trim();
  income2 = income2.trim();

  const n1 = parseFloat(income1.replace(",", "."));
  const n2 = parseFloat(income2.replace(",", "."));

  let error = null;
  let result = null;

  if (!income1 || !income2) {
    error = "Both income fields are required.";
  } else if (!isFinite(n1) || !isFinite(n2)) {
    error = "Please enter valid numbers only.";
  } else {
    result = +(n1 + n2).toFixed(2); // Round to 2 decimal places
  }

  res.render("index", { error, result, inputs: { income1, income2 } });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
