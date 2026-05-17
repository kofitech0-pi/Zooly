import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

const Turma = connection.define("turmas", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  periodo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mascote: {
    type: Sequelize.STRING,
    allowNull: false,
  },
 codigo_turma: {
  type: Sequelize.STRING,
  allowNull: true,
  unique: true,
},
});

export default Turma;