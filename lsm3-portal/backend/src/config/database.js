/*
 *  _____         _                 
 * |  ___|__  ___| |_ _   _ ___ 
 * | |_ / _ \/ __| __| | | / __/ 
 * |  _|  __/\__ \ |_| |_| \__ \ 
 * |_|  \___||___/\__|\__,_|___/
 *
 *  LSM3 - Advanced School Portal
 *  Techswifttrix Agency
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  pool: {
    max: 5,       // keep low for Supabase free tier (max 15 connections)
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
