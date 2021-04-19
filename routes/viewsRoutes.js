const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/tours/:slug', viewsController.getTour);
router.get('/login', viewsController.getLogin);
router.get('/logout', viewsController.logout);

module.exports = router;