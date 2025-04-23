const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
    getLiquidacionesListByNoOperador,
  } = require("../models/liquidacionesModel");

const get_liquidaciones_by_no_operador = async (req, res) => {
    const { no_operador } = req.query;

    try {
      if (!no_operador) {
          return res.status(404).json({ message: "Número de operador no especificado" });
      }

      if (no_operador === 0) {
        return res.status(404).json({ message: "Número de operador no válido" });
    }
      
      const liquidaciones = await getLiquidacionesListByNoOperador(no_operador);
      
      if (!liquidaciones || liquidaciones.length === 0) {
          return res.status(400).json({ message: "No se obtuvo el listado solicitado" });
      }

      return res.status(200).json(liquidaciones);
  } catch (err) {
      res
          .status(500)
          .json({ message: `Error al intentar obtener el listado de liquidaciones del operador no. ${no_operador}`, error: err.message });
  }
};

module.exports = {
    get_liquidaciones_by_no_operador
};