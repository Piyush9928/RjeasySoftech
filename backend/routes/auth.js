const express = require("express");
const router = express.Router();
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const config = require("../config/db");
require("dotenv").config();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Step 1: Check Master Credentials
  if (
    username === process.env.MASTER_USERNAME &&
    password === process.env.MASTER_PASSWORD
  ) {
    const token = jwt.sign({ id: 0, isMaster: true }, process.env.JWT_SECRET);

    return res.json({
      status: "success",
      message: "Master login success",
      token,
      fullname: "Master Admin",
    });
  }

  // Step 2: If not master, then check DB
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM tbl_users WHERE username=@username AND isactive=1");

    if (result.recordset.length === 0) {
      return res.json({ status: "failed", message: "User not found" });
    }

    const user = result.recordset[0];

    if (user.passw !== password) {
      return res.json({ status: "failed", message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.userid }, process.env.JWT_SECRET);

    return res.json({
      status: "success",
      token,
      userid: user.userid,
      fullname: user.fullname,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: "error", message: "Server error" });
  }
});

module.exports = router;
