const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/dashboard", require("./routes/dashboard"));
app.use("/auth", require("./routes/authentication"));
app.use("/project", require("./routes/project"));
app.use("/version", require("./routes/version"));
app.use("/bug", require("./routes/bug"));

app.listen(5000, () => {
  console.log("Server is running");
});
