const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
require("./config/index")
const cors = require('cors');
const e = require("cors");
app.use(cors());
const port = process.env.PORT || 5005;

app.use(express.json());

app.use("/api", require("./routes/users"));
app.use("/api", require("./routes/teams"))

app.use(express.static("build"));

// Serve index.html for any unspecified routes
app.get("/*", function (req, res) {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(port, () => {
  console.log("server running on port " + port);
});
