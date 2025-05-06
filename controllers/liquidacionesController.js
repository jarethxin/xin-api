const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require('path');
const fs = require('fs');
const {
    getLiquidacionesListByNoOperador,
  } = require("../models/liquidacionesModel");

// const get_liquidaciones_by_no_operador = async (req, res) => {
//     const { no_operador } = req.query;

//     try {
//       if (!no_operador) {
//           return res.status(404).json({ message: "Número de operador no especificado" });
//       }

//       if (no_operador === 0) {
//         return res.status(404).json({ message: "Número de operador no válido" });
//     }
      
//       const liquidaciones = await getLiquidacionesListByNoOperador(no_operador);
      
//       if (!liquidaciones || liquidaciones.length === 0) {
//           return res.status(400).json({ message: "No se obtuvo el listado solicitado" });
//       }

//       return res.status(200).json(liquidaciones);
//   } catch (err) {
//       res
//           .status(500)
//           .json({ message: `Error al intentar obtener el listado de liquidaciones del operador no. ${no_operador}`, error: err.message });
//   }
// };

const get_liquidaciones_by_no_operador = async (req, res) => {
  const { no_operador, page = 0, pageSize = 20 } = req.query;

  const pageInt = parseInt(page);
  const pageSizeInt = parseInt(pageSize);
  const offset = pageInt * pageSizeInt;

  try {
    if (!no_operador || parseInt(no_operador) === 0) {
      return res.status(404).json({ message: "Número de operador no válido o no especificado" });
    }
    
    const liquidaciones = await getLiquidacionesListByNoOperador(no_operador, pageSizeInt, offset);
    
    if (!liquidaciones || liquidaciones.length === 0) {
      return res.status(204).json({ message: "No se encontró información para el operador." });
    }

    return res.status(200).json(liquidaciones);
  } catch (err) {
      return res.status(500).json({
        message: `Error al intentar obtener el listado de liquidaciones del operador no. ${no_operador}`,
        error: err.message
      });
    }
  };

const get_liquidacion_pdf_by_operador_and_liquidacion = async (req, res) => {
  const { noOperador, folioLiquidacion } = req.params;
  const basePath = process.env.RUTA_ARCHIVOS_LIQUIDACIONES;
  
  const filePath = path.join(basePath, noOperador, `L${folioLiquidacion}.pdf`);
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Error enviando archivo con el nombre: L${folioLiquidacion}.pdf`, err);
        res.status(500).send('Error al enviar el documento');
      }
    });
  } else {
    res.status(404).json({ message: 'Archivo PDF no encontrado' });
  }
};

module.exports = {
    get_liquidaciones_by_no_operador,
    get_liquidacion_pdf_by_operador_and_liquidacion
};