const router = require("express").Router();
const authorization = require("../middleware/authorization");
const pool = require("../db.js");

router.get("/", authorization, async (req, res) => {
  try {
    const id = req.user;

    const vid = req.header("vid");

    const data = await pool.query("SELECT pid FROM versions WHERE id= $1", [
      vid,
    ]);

    // console.log(data.rows[0].pid);

    const pid = data.rows[0].pid;

    const data2 = await pool.query("SELECT uid FROM projects WHERE id= $1", [
      pid,
    ]);

    const uid = data2.rows[0].uid;

    if (id == uid) {
      const databug = await pool.query("SELECT * FROM bugs WHERE vid = $1", [
        vid,
      ]);

      if (databug.rows) {
        const bugs = databug.rows;
        res.status(200).json({ bugs });
      } else {
        res.status(401).json("Not Exits");
      }
    } else {
      res.status(401).json("Not Authorized");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

router.get("/bug", authorization, async (req, res) => {
  try {
    const id = req.user;
    const bid = req.header("bid");

    const data = await pool.query("SELECT pid FROM bugs WHERE id = $1", [bid]);

    const pid = data.rows[0].pid;

    const data2 = await pool.query("SELECT uid FROM projects WHERE id= $1", [
      pid,
    ]);

    const uid = data2.rows[0].uid;

    // console.log(uid, id);

    if (id == uid) {
      const data3 = await pool.query("SELECT * FROM bugs WHERE id= $1", [bid]);

      if (data3.rows) {
        const bugs = data3.rows[0];
        res.status(200).json({ bugs });
      } else {
        res.status(401).json("Not Exits");
      }
    } else {
      res.status(401).json("Not Authorized");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/add", authorization, async (req, res) => {
  try {
    const {
      vid,
      bname,
      reportedby,
      reportdate,
      comment,
      bugtype,
      bugpriority,
    } = req.body;

    const id = req.user;

    const data = await pool.query("SELECT pid FROM versions WHERE id= $1", [
      vid,
    ]);

    // console.log(data.rows[0].pid);

    const pid = data.rows[0].pid;

    const data2 = await pool.query("SELECT uid FROM projects WHERE id= $1", [
      pid,
    ]);

    const uid = data2.rows[0].uid;

    console.log(uid, id);

    if (id == uid) {
      const newBug = await pool.query(
        "INSERT INTO bugs(pid, vid, bname, reportdate, reportedby, bugpriority, comment, bugtype, bugstatus) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          pid,
          vid,
          bname,
          reportdate,
          reportedby,
          bugpriority,
          comment,
          bugtype,
          "not resolved",
        ]
      );

      updatecount(vid);

      res.status(200).json("Added");
    } else {
      res.status(401).json("Not Authorized");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json("server Error");
  }
});

router.delete("/", authorization, async (req, res) => {
  const { id } = req.body;
  try {
    const deleteBug = await pool.query("DELETE FROM bugs WHERE id = $1", [id]);
    res.status(200).json("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});

router.put("/", authorization, async (req, res) => {
  const { bid, comment, bugpriority, bugstatus } = req.body;
  try {
    const updateBug = await pool.query(
      "UPDATE bugs SET bugpriority = $1, comment = $2, bugstatus = $3 WHERE id = $4 RETURNING *",
      [bugpriority, comment, bugstatus, bid]
    );

    // console.log();

    updatecount(Number(updateBug.rows[0].vid));

    res.status(200).json("Updated");
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
  res.status(200);
});

const updatecount = async (vid) => {
  try {
    check = "not resolved";
    const getCount = await pool.query(
      "SELECT COUNT(*) FROM bugs WHERE bugstatus=$1 AND vid=$2",
      [check, vid]
    );
    activebug = Number(getCount.rows[0].count);
    const update = await pool.query(
      "UPDATE versions SET activebugs=$1 WHERE id=$2",
      [activebug, vid]
    );
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};

module.exports = router;
