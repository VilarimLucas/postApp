/*

PHPmyADMIN: http://www.phpmyadmin.co
Server: sql10.freemysqlhosting.net
Name: sql10615532
Username: sql10615532
Password: BN4RMrejfq
Port number: 3306

*/



const Sequelize = require('sequelize');

//Conexão com o banco de dados
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: "3306",
    dialect: 'mysql'
});

//Vamos exportar as variáveis
module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}