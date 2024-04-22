const { DataTypes } = require('sequelize');

module.exports = (Sequelize) => {
    return Sequelize.define('genre', {
        id: {
            type: DataTypes.UUID, // se genera en el momento con numeros y letras
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
}