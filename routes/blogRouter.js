const express = require('express');
const router = express.Router();
const controller = require('../controllers/blogController')

router.get("/", controller.show);
router.get("/:id", controller.showDetails);

module.exports = router;