const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const logFilePath = path.join(__dirname, "logs", "error.txt");

app.get("/", (req, res) => {
    fs.readFile(logFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading log file:", err.message);
            if (err.code === "ENOENT") {
                return res.status(404).send("<h1>Log file not found.</h1>");
            } else {
                return res.status(500).send("<h1>Unable to read log file.</h1>");
            }
        }

        res.send(`
            <html>
                <head>
                    <title>Log Viewer</title>
                    <style>
                        body { font-family: monospace; background: #111; color: #eee; padding: 20px; }
                        pre { white-space: pre-wrap; word-wrap: break-word; }
                    </style>
                </head>
                <body>
                    <h1>Server Logs</h1>
                    <pre>${data}</pre>
                </body>
            </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`Log Viewer running at http://localhost:${PORT}`);
});
