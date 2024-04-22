const { Router } = require('express');
const videogamesRout = require('./videogamesRout');
const genresRout = require('./genresRout');

const router = Router();

router.use('/videogames', videogamesRout);
router.use('/genres', genresRout);

module.exports = router;