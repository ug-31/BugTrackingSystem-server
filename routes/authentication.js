const router = require("express").Router();

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  res.send("received from backend server");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  res.json("received from backend server");
});

module.exports = router;
