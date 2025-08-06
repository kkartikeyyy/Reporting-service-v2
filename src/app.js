require("dotenv").config();
const express = require("express");
const reportRoutes = require("./routes/report");

const app = express();
app.use(express.json({ limit: '10mb' })); // Increased limit for large scan data
app.use("/api/report", reportRoutes);

const PORT = 3500;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
