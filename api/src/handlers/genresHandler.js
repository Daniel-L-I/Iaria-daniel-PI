const createGenres = require('../controllers/genresControl');
const getGenresHandler = async (req, res) => {
    try {
        await createGenres();
        res.status(201).json({
            success: true,
            message: 'Generos cargados correctamente en la base de datos'
        });
    } catch {
        res.status(400).json({ error: 'Fallo al cargar géneros' });
    }
};

module.exports = getGenresHandler