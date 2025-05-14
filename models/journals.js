const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Journal = sequelize.define('Journal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  abstract: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  published: {
    type: DataTypes.DATE,
    allowNull: false
  },
  authors: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
    defaultValue: []
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  tableName: 'journals',
  timestamps: false
});

module.exports = Journal;