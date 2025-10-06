const express = require("express");
const cors = require("cors");
const upload = require("./middleware/upload");

const app = express();
const PORT = 5000;

app.use(cors());

// API health check
app.get("/", (req, res) => res.send("Job Portal API running..."));

// Upload route
app.post("/upload", upload.single("resume"), (req, res) => {
  res.json({ message: "Resume uploaded successfully!", file: req.file });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size exceeds 2MB limit" });
  }
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
