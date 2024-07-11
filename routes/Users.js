const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/upload");
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10); // Hash the password asynchronously
    await Users.create({
      // Wait for the user to be created
      username: username,
      password: hash,
      email: email,
    });
    res.json("Registered Successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ where: { username: username } });

    if (!user) {
      console.log("User not found:", username);
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Wrong password for user:", username);
      return res
        .status(401)
        .json({ error: "Wrong username and password combination" });
    }

    console.log("User logged in successfully:", username);
    const accessToken = sign(
      { username: user.username, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" } // Optional: Set an expiration time
    );

    return res.json({ accessToken, id: user.id }); // Include user ID in response
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

router.get("/userInfo/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const userInfo = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    res.json(userInfo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user info" });
  }
});

router.put("/editProfile", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  console.log("Received data:", req.body); // Add this line to log the received data

  try {
    const user = await Users.findOne({
      where: { username: req.user.username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!oldPassword || !user.password) {
      return res
        .status(400)
        .json({ error: "Old password or user password is missing" });
    }

    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({ error: "Wrong password entered" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await Users.update(
      { password: hash },
      { where: { username: req.user.username } }
    );

    return res.status(200).json("Successfully updated");
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating profile" });
  }
});

router.put(
  "/uploadProfileImage",
  validateToken,
  upload.single("profileImage"),
  async (req, res) => {
    const userId = req.user.id; // Ensure validateToken sets req.user
    const profileImage = req.file ? req.file.filename : null;

    if (!profileImage) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      await Users.update({ profileImage }, { where: { id: userId } });
      res.status(200).json({ message: "Profile image uploaded successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload profile image" });
    }
  }
);

module.exports = router;
