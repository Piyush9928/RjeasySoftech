require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on port ${port}`));
