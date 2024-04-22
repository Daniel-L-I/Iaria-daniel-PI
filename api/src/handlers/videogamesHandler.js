const axios = require('axios');
const { Videogame } = require('../db');
const { createVideoGame, getVideogameById, getVideogameByName, fetchAllGames } = require("../controllers/videogamesControl");


const getVideogamesHandler = async (req, res) => {
    const searchTerm = req.query.name;
    const videogames = searchTerm ? await getVideogameByName(searchTerm) : await fetchAllGames();

    res.send(videogames);
};

const getVideogameByIdHandler = async (req, res) => {
    const gameId = req.params.id;
    const source = isNaN(gameId) ? "db" : "api";
    try {
        const game = await getVideogameById(gameId, source);
        res.status(200).json(game);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Posting handlers
const postVideogamesHandler = async (req, res) => {
    const { name, description, platforms, image, released, rating, genre } = req.body;
    
    if (!name || !description || !platforms || !image || !released || !rating || !genre) {
        return res.status(400).json({ error: "Datos no disponibles" });
    }

    try {
        const newVideoGame = await createVideoGame(name, description, platforms, image, released, rating, genre);
        res.status(201).json(newVideoGame);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getVideogamesHandler,
    getVideogameByIdHandler,
    postVideogamesHandler
};