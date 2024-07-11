const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
require("dotenv").config();

app.use(express.json());
app.use(cors());
const db = require("./models");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(uploadsDir));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routers
const noteRouter = require("./routes/Notes");
const usersRouter = require("./routes/Users");

app.use("/Notes", noteRouter);
app.use("/auth", usersRouter);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
});
