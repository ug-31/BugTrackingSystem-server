const router = require('express').Router();

router.get('/', async(req, res) => {
    try {

        res.send("working");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})


module.exports = router;