const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
    getAndenesList,
    createMainInventarioRegister,
    createDetailInventarioRegister,
    createDetailInventarioSimplifiedV1Register,
  } = require("../models/invFisicoModel");

  const get_andenes = async (req, res) => {
      const { terminal_id } = req.query;

      try {
        if (!terminal_id) {
            return res.status(404).json({ message: "Terminal no especificada" });
        }
        
        const andenes = await getAndenesList(terminal_id);
        
        if (!andenes || andenes.length === 0) {
            return res.status(400).json({ message: "No se obtuvo el listado solicitado" });
        }

        return res.status(200).json(andenes);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error al intentar obtener el listado de andenes", error: err.message });
    }
  };

  const create_inventory = async (req, res) => {
    const { empresa_id, terminal_id, observaciones, creado_por } = req.body;

    try {
        if (!empresa_id) return res.status(400).json({ message: "Empresa no especificada" });
        if (!terminal_id) return res.status(400).json({ message: "Terminal no especificada" });
        if (!creado_por) return res.status(400).json({ message: "Usuario no especificado" });
        
        const inventory_id = await createMainInventarioRegister(empresa_id, terminal_id, observaciones, creado_por);
        
        if (!inventory_id) return res.status(400).json({ message: "No se ha podido generar el registro principal del inventario" });

        return res.status(200).json(inventory_id);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error al intentar generar un inventario", error: err.message });
    }
  };

  // const create_inventory_detail = async (req, res) => {
  //   const { inventario_id, captura_manual, linea_transportista_id, linea_transportista, tipo_unidad_id, unidad_id, identificador, anden_id, cargado, creado_por, estatus_id } = req.body;
    
  //   try {
  //       if (!inventario_id) return res.status(400).json({ message: "Id principal de inventario no especificado" });
  //       if (captura_manual === null) return res.status(400).json({ message: "No se ha especificado si se trata de una captura manual" });
  //       if (!linea_transportista_id) return res.status(400).json({ message: "Línea transportista no especificada" });
  //       if (!tipo_unidad_id) return res.status(400).json({ message: "Tipo de unidad no especificada" });
  //       if (!unidad_id) return res.status(400).json({ message: "Unidad no especificada" });
  //       if (!identificador) return res.status(400).json({ message: "Identificador de unidad no especificada" });
  //       if (!anden_id) return res.status(400).json({ message: "Anden no especificado" });
  //       if (cargado === null) return res.status(400).json({ message: "No se ha especificado si la unidad está cargada o vacía" });
  //       if (!creado_por) return res.status(400).json({ message: "Usuario no especificado" });
        
  //       const inventory_detail_id = await createDetailInventarioRegister(inventario_id, captura_manual, linea_transportista_id, linea_transportista, tipo_unidad_id, unidad_id, identificador, anden_id, cargado, creado_por, estatus_id);
        
  //       if (!inventory_detail_id) return res.status(400).json({ message: "No se ha podido generar el registro individual detallado" });
        
  //       return res.status(200).json(inventory_detail_id);
  //   } catch (err) {
  //       res
  //           .status(500)
  //           .json({ message: "Error al intentar generar un registro individual detallado", error: err.message });
  //   }
  // };

  const create_inventory_detail = async (req, res) => {
    const { inventario_id, captura_manual, identificador, anden_id, cargado, creado_por } = req.body;
    
    try {
        if (!inventario_id) return res.status(400).json({ message: "Id principal de inventario no especificado" });
        if (captura_manual === null) return res.status(400).json({ message: "No se ha especificado si se trata de una captura manual" });
        if (!identificador) return res.status(400).json({ message: "Identificador de unidad no especificada" });
        if (!anden_id) return res.status(400).json({ message: "Anden no especificado" });
        if (cargado === null) return res.status(400).json({ message: "No se ha especificado si la unidad está cargada o vacía" });
        if (!creado_por) return res.status(400).json({ message: "Usuario no especificado" });
        
        const inventory_detail_id = await createDetailInventarioSimplifiedV1Register(inventario_id, captura_manual, identificador, anden_id, cargado, creado_por);
        
        if (!inventory_detail_id) return res.status(400).json({ message: "No se ha podido generar el registro individual detallado" });
        
        return res.status(200).json(inventory_detail_id);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error al intentar generar un registro individual detallado", error: err.message });
    }
  };

  module.exports = {
    get_andenes,
    create_inventory,
    create_inventory_detail
  };