const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads folder statically so images can be accessed
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
