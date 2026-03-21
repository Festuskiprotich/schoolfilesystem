/*
 *  _____         _                  _  __  __  _
 * |  ___|__  ___| |_ _   _ ___ __ _(_)/ _|| |_| |_ _ __ _____  __
 * | |_ / _ \/ __| __| | | / __/ _` | | |_ | __| __| '__/ _ \ \/ /
 * |  _|  __/\__ \ |_| |_| \__ \ (_| | |  _|| |_| |_| | | (_) >  <
 * |_|  \___||___/\__|\__,_|___/\__,_|_|_|   \__|\__|_|  \___/_/\_\
 *
 *  LSM3 - Advanced School Portal
 *  Techswifttrix Agency
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Parse the DATABASE_URL and force IPv4 by resolving the hostname manually
const url = new URL(process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  host: url.hostname,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // required for Supabase / Render
    },
  },
  hooks: {
    beforeConnect: async (config) => {
      const dns = require('dns').promises;
      const { address } = await dns.lookup(config.host, { family: 4 });
      config.host = address;
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
