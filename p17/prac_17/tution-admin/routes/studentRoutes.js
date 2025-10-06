const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

// View all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.render("index", { students });
});

// Add student
router.post("/students", async (req, res) => {
  const { name, age, course } = req.body;
  await Student.create({ name, age, course });
  res.redirect("/");
});

// Edit form
router.get("/students/:id/edit", async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("edit", { student });
});

// Update student
router.put("/students/:id", async (req, res) => {
  const { name, age, course } = req.body;
  await Student.findByIdAndUpdate(req.params.id, { name, age, course });
  res.redirect("/");
});

// Delete student
router.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
