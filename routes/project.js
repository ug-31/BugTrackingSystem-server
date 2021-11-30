const router = require("express").Router();
const authorization = require("../middleware/authorization");
const pool = require("../db.js");

router.get("/", authorization, async (req, res) => {
  try {
    const id = req.user;

    const data = await pool.query("SELECT * FROM projects WHERE uid = $1", [
      id,
    ]);

    const projects = data.rows;

    return res.status(200).json({ projects });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/add", authorization, async (req, res) => {
  try {
    const id = req.user;

    const { pname } = req.body;
    const { startdate } = req.body;
    const { description } = req.body;
    const newProject = await pool.query(
      "INSERT INTO projects(pname, startdate, description, uid) VALUES ($1, $2, $3, $4)",
      [pname, startdate, description, id]
    );

    // console.log(newProject);

    return res.status(200).json("Added");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Project already exit or server Error");
  }
});

router.delete("/", authorization, async (req, res) => {
  const { id } = req.body;

  try {
    const deleteBugs = await pool.query("DELETE FROM bugs WHERE pid = $1", [
      id,
    ]);

    const deleteVersion = await pool.query(
      "DELETE FROM versions WHERE pid = $1",
      [id]
    );

    const deleteProject = await pool.query(
      "DELETE FROM projects WHERE id = $1",
      [id]
    );

    res.status(200).json("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
