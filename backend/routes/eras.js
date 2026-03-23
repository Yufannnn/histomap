const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(req.app.locals.ERAS);
});

module.exports = router;
