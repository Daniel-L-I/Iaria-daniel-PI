const { Op } = require('sequelize'); //* Módulo para las operaciones de Sequelize
const axios = require('axios'); // *Módulo para hacer llamadas a la API
const { Videogame } = require('../db'); // *Módulo que hace referencia a la tabla en la base de datos
const { API_KEY, URL } = process.env; //* Variables de entorno

// ?Creamos una función asíncrona para crear un juego en la base de datos
const createVideoGame = async ({ name: gameName, description: gameDescription, platforms: gamePlatforms, image: gameImage, released: gameReleaseDate, rating: gameRating, genre: gameGenre }) => {
    // *Retornamos la promesa del método create de Videogame, pasando los datos del juego
    return await Videogame.create({
        name: gameName,
        description: gameDescription,
        platforms: gamePlatforms,
        image: gameImage,
        released: gameReleaseDate,
        rating: gameRating,
        genre: gameGenre,
    });
};

// ?Creamos una función asíncrona para obtener un juego por su ID, pueda venir de la base de datos o de la API
const getVideogameById = async (id, source) => {
    // *Verificamos si el juego proviene de la API o de la base de datos
    const apiResponse = source === "api"
        // *Si proviene de la API, hacemos una solicitud a la API con el ID del juego
        ? await axios.get(`${URL}/games/${id}?key=${API_KEY}`)
        // *Si proviene de la base de datos, buscamos el juego por su ID
        : await Videogame.findByPk(id);

    //* Si proviene de la API
    if (source === 'api') {
        // *Extraemos los datos necesarios del juego de la respuesta de la API
        const { name, description, platforms, image, released, rating, genre } = apiResponse.data;
        // *Extraemos los nombres de las plataformas y los géneros del juego
        const platformsNames = platforms.map(({ name }) => name);
        const genreNames = genre.map(({ name }) => name);
        // *Retornamos los datos del juego
        return { name, description, platformsNames, image, released, rating, genreNames };
    } else {
        // *Si proviene de la base de datos, retornamos la respuesta de la base de datos
        return apiResponse;
    }
};

// ?Creamos una función para limpiar los juegos obtenidos de la API, eliminando duplicados y agregando un campo 'created' a false
const cleanGames = (games) => {
    return games.map(game => {
        //* Extraemos las plataformas y géneros del juego, eliminando duplicados y agregando un campo 'created' a false
        const platforms = [game.platform, game.parent_platforms]
            .flatMap(platform => platform.map(platform => platform.name))
            .filter((name, index, array) => array.indexOf(name) === index);
        const genres = game.genres.map(genre => genre.name);
        // *Retornamos los datos del juego con los campos agregados
        return {
            id: game.id,
            name: game.name,
            description: game.description,
            platforms,
            image: game.background_image,
            released: game.released,
            rating: game.rating,
            genres,
            created: false
        };
    });
}

// ?Creamos una función asíncrona para obtener todos los juegos de la base de datos y de la API
const fetchAllGames = async () => {
    // *Obtenemos todos los juegos de la base de datos
    const dbGames = await Videogame.findAll();
    // *Obtenemos todos los juegos de la API
    const apiGames = (await axios.get(`${URL}/games?key=${API_KEY}`)).data.results;
    // *Limpiamos los juegos de la API
    const cleanedGames = cleanArr(apiGames);
    // *Retornamos todos los juegos de la base de datos y de la API
    return [...dbGames, ...cleanedGames];
}

// ?Creamos una función asíncrona para obtener un juego por su nombre, obteniendo los juegos de la base de datos y la API
const getVideogameByName = async (searchTerm) => {
    //* Buscamos los juegos en la base de datos que contengan el término de búsqueda
    const dbGames = await Videogame.findAll({
        where: {
            name: {
                [Op.iLike]: `%${searchTerm}%`
            }
        },
        limit: 15
    });
    // *Realizamos una solicitud a la API para obtener todos los juegos que contengan el término de búsqueda
    const apiResponse = await axios.get(`${URL}/games?search=${searchTerm}&key=${API_KEY}&pageSize=20`);
    // *Limpiamos los juegos de la API
    const apiGames = cleanArr(apiResponse.data.results);
    // *Filtramos los juegos de la API que contengan el término de búsqueda
    const filteredGames = apiGames.filter((game) => game.name.toLowerCase().includes(searchTerm.toLowerCase()));
    // *Retornamos todos los juegos encontrados, incluyendo los de la base de datos y los de la API
    const result = [...dbGames, ...filteredGames];
    // *Si no se encuentran juegos, lanzamos un error
    if (result.length === 0) {
        throw new Error(`No se han encontrado juegos con "${searchTerm}"`);
    }
    // *Retornamos los primeros 15 juegos encontrados
    return result.slice(0, 15);
}

// ?Exportamos las funciones
module.exports = {
    createVideoGame,
    getVideogameById,
    cleanGames,
    fetchAllGames,
    getVideogameByName
};
