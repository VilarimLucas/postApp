/*
neon: https://console.neon.tech/
DATABASE_URL: postgresql://VilarimLucas:7UvSaiw8GzqC@ep-divine-dawn-717288.us-east-2.aws.neon.tech/neondb
*/

const Sequelize = require('sequelize');

//Conexão com o banco de dados
const sequelize = new Sequelize('postapp', 'root', 'root', {
    host: "localhost",
    port: "3306",
    dialect: 'mysql'
});

//Vamos exportar as variáveis
module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}