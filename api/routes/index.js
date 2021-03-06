const express = require('express');
const mdlr = require('../middlewares');
const ctr = require('../controllers');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Easy Api' });
});

/* verify email. */
router.post('/activation/', ctr.activation);

/* Send Activation. */
router.post('/send-email-activation/', ctr.sendActivation);

/* AUTH USER */
router.post('/auth/', mdlr.auth, mdlr.genereteToken);

module.exports = router;
