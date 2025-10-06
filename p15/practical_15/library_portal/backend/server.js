const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Setup session middleware
app.use(
  session({
    secret: "library_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  })
);

// 🟢 Login route: Store name & login time
app.post("/login", (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required" });

  const loginTime = new Date().toLocaleString();

  req.session.user = {
    name,
    loginTime,
    logoutTime: null, // will be set when user logs out
  };

  res.json({ message: "Login successful", user: req.session.user });
});

// 🟢 Profile route: Fetch session data
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json(req.session.user);
});

// 🟢 Logout route: Add logout time before destroying session
const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "logs.json");

app.post("/logout", (req, res) => {
  if (!req.session.user)
    return res.status(400).json({ error: "No session to log out" });

  const logoutTime = new Date().toLocaleString();
  const userData = { ...req.session.user, logoutTime };

  // Read existing logs safely
  let logs = [];
  try {
    if (fs.existsSync(LOG_FILE)) {
      const fileData = fs.readFileSync(LOG_FILE, "utf-8");
      logs = fileData ? JSON.parse(fileData) : [];
    }
  } catch (err) {
    console.error("Error reading logs.json:", err);
    logs = [];
  }

  // Append new record
  logs.push(userData);

  // Write back to file safely
  try {
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), "utf-8");
    console.log("User session saved:", userData);
  } catch (err) {
    console.error("Error writing logs.json:", err);
  }

  // Destroy session
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully", user: userData });
  });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
