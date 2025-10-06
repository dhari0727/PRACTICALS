// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // serve index.html + css

// Handle calculation
app.post("/calculate", (req, res) => {
  const num1 = parseFloat(req.body.num1);
  const num2 = parseFloat(req.body.num2);
  const operation = req.body.operation;

  let result;
  let error = null;

  if (isNaN(num1) || isNaN(num2)) {
    error = " Invalid input! Please enter valid numbers only.";
  } else {
    switch (operation) {
      case "add":
        result = num1 + num2;
        break;
      case "subtract":
        result = num1 - num2;
        break;
      case "multiply":
        result = num1 * num2;
        break;
      case "divide":
        if (num2 === 0) {
          error = " Division by zero is not allowed!";
        } else {
          result = num1 / num2;
        }
        break;
      default:
        error = " Unknown operation!";
    }
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Kids Calculator - Result</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; background: #f0f8ff; }
        .box { background: #fff; padding: 20px; border-radius: 10px; display: inline-block; box-shadow: 0px 4px 6px rgba(0,0,0,0.1); }
        .error { color: red; font-weight: bold; }
        .result { font-size: 24px; font-weight: bold; color: blue; }
        a { display: inline-block; margin-top: 20px; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
        a:hover { background: #45a049; }
      </style>
    </head>
    <body>
      <h1>Kids Calculator 🧮</h1>
      <div class="box">
        ${
          error
            ? `<p class="error">${error}</p>`
            : `<p class="result"> Result: ${result}</p>`
        }
        <a href="/"> Go Back</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Calculator app running at http://localhost:${port}`);
});
