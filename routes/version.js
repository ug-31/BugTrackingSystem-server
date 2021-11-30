const router = require("express").Router();
const authorization = require("../middleware/authorization");
const pool = require("../db.js");

router.get("/", authorization, async (req, res) => {
  try {
    const id = req.user;

    const pid = req.header("pid");

    const data = await pool.query("SELECT * FROM versions WHERE pid = $1", [
      pid,
    ]);

    const versions = data.rows;

    return res.status(200).json({ versions });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/add", authorization, async (req, res) => {
  try {
    const { pid, vname, vno, releasedate, releasedby, comment } = req.body;

    const newVersion = await pool.query(
      "INSERT INTO versions(pid, vname, vno, releasedate, releasedby, comment, activebugs) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [pid, vname, vno, releasedate, releasedby, comment, 0]
    );

    return res.status(200).json("Added");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server Error");
  }
});

router.delete("/", authorization, async (req, res) => {
  const { id } = req.body;

  try {
    const deleteBugs = await pool.query("DELETE FROM bugs WHERE vid = $1", [
      id,
    ]);

    const deleteVersion = await pool.query(
      "DELETE FROM versions WHERE id = $1",
      [id]
    );

    res.status(200).json("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
