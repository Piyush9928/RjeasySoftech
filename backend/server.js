const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

// root test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// API routes here
app.use("/api", require("./routes/auth"));

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
