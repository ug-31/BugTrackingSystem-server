const router = require("express").Router();
const authorization = require("../middleware/authorization");
const pool = require("../db.js");

router.get("/", authorization, async (req, res) => {
  try {
    const id = req.user;

    const data = await pool.query("SELECT name FROM users WHERE id = $1", [id]);

    const name = data.rows[0].name;

    return res.status(200).json({ name });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
