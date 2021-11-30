const router = require("express").Router();
const validInfo = require("../middleware/validInfo");
const pool = require("../db.js");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtgenerator");
const authorization = require("../middleware/authorization");

router.post("/register", validInfo, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await pool.query("SELECT email from users WHERE email=$1", [
      email,
    ]);

    if (data.rows.length != 0) {
      return res.status(400).json("email exists please use another or login");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await pool.query(
        "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *",
        [name, email, hashedPassword]
      );
      const id = newUser.rows[0].id;
      const token = jwtGenerator(id);
      return res.status(200).json({ token });
    }
  } catch (error) {
    return res.status(500).json("Server Error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await pool.query("SELECT email from users WHERE email=$1", [
      email,
    ]);

    if (data.rows.length === 0) {
      return res.status(400).json("email doesn't exists please register");
    } else {
      const data = await pool.query(
        "SELECT id, password FROM users WHERE email=$1",
        [email]
      );
      const hashedPassword = data.rows[0].password;
      const id = data.rows[0].id;

      const validPassword = await bcrypt.compare(password, hashedPassword);

      if (!validPassword) {
        return res.status(400).json("Wrong combination of email and password");
      } else {
        const token = jwtGenerator(id);

        return res.status(200).json({ token });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("server error");
  }
});

router.get("/verify", authorization, (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Message");
  }
});

module.exports = router;
