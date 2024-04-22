const { Router } = require('express');
const videogamesRout = Router();

const { getVideogamesHandler,
    getVideogameByIdHandler,
    postVideogamesHandler } = require('../handlers/videogamesHandler');

videogamesRout.get('/', getVideogamesHandler);
videogamesRout.get('/:id', getVideogameByIdHandler);
videogamesRout.post('/', postVideogamesHandler);

module.exports = videogamesRout;
