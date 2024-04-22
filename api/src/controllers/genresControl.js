
const axios = require('axios');
const { Genre } = require('../db');
const { API_KEY, URL } = process.env;

const createGenre = async () => {
    const response = await axios.get(`${URL}/genres?key=${API_KEY}`);
    const genreNames = response.data.results.map(genre => genre.name);
    await Genre.bulkCreate(genreNames.map(name => ({ name })));
}

module.exports = createGenre;