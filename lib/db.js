require('dotenv').config();

const { Client } = require('pg');

const db = new Client({
  application_name: 'cinema'
});

(async () => await db.connect())();

module.exports = {
  db
};
