import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Atividade from "./Atividade.js";

const Questao = connection.define("questoes", {
  atividade_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  enunciado: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  pontos: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

Questao.belongsTo(Atividade, { foreignKey: "atividade_id" });
Atividade.hasMany(Questao, { foreignKey: "atividade_id" });

export default Questao;