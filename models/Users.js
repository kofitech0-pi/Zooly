import { DataTypes } from "sequelize";
import connection from "../config/sequelize-config.js";

const Users = connection.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  codigo_escola: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  tipo_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "professor",
  },
});

export default Users;