import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

const Historia = connection.define("historias", {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao_curta: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  texto: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  nivel_leitura: {
    type: Sequelize.ENUM("Fácil", "Médio", "Difícil"),
    allowNull: false,
    defaultValue: "Fácil",
  },
  origem: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "Vale do Ribeira",
  },
  categoria: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "Folclore",
  },
  imagem: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM("Ativa", "Inativa"),
    allowNull: false,
    defaultValue: "Ativa",
  },
});

export default Historia;
