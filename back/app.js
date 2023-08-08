const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const taskRoutes = require("./routes/task");
const sellerTaskRoutes = require("./routes/sellerTask");
const authRoutes = require("./routes/auth");
const sellerAuthRoutes = require("./routes/sellerAuth");
const logVeryRoutes = require("./routes/logVerify");
const sellerlogVeryRoutes = require("./routes/sellerLogVerify");
const productTask = require("./routes/productTask");
;

dotenv.config({ path: "./config.env" });
require("./db/conn");
app.use(express.json());

app.use(cors({ origin: 'https://gorgeous-belekoy-ea6081.netlify.app', credentials: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api/task", taskRoutes);
app.use("/api/sellertask", sellerTaskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sellerauth", sellerAuthRoutes);
app.use("/api/logVerify", logVeryRoutes);
app.use("/api/sellerlogVerify", sellerlogVeryRoutes);
app.use("/api/producttask", productTask);
app.listen(5000, () => {
  console.log("Running on 5000");
});
