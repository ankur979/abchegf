const express = require("express");
const router = express.Router();
const User = require("../models/users");

// Example route: /api/users
router.get("/users", async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 20,
      search,
      domain,
      gender,
      availability,
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { first_name: { $regex: new RegExp(search, "i") } },
        { last_name: { $regex: new RegExp(search, "i") } },
      ];
    }
    if (domain) filter.domain = domain;
    if (gender) filter.gender = gender;
    if (availability)
      filter.availability = availability.toLowerCase() === "true";

    const users = await User.find(filter)
      .limit(parseInt(pageSize))
      .skip((parseInt(page) - 1) * parseInt(pageSize));
    let userLength = await User.find(filter).countDocuments();

    res.json({ users, userLength });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Example route: /api/users/:id
router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Example route: /api/users
router.post("/users", async (req, res) => {
  try {
    const userData = req.body;

    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Example route: /api/users/:id
router.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Example route: /api/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
