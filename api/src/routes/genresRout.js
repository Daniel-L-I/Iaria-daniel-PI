const { Router } = require('express');
const genresRout = Router();

const  getGenresHandler  = require('../handlers/genresHandler');

genresRout.get('/', getGenresHandler);

module.exports = genresRout

