const { poolPromise, sql } = require("../config/db");

const getAndenesList = async (terminal_id) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("terminal_id", sql.Int, terminal_id)
        .query("EXECUTE [control_equipo].[sp_get_andenes_list] @terminal_id");
      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  const createMainInventarioRegister = async (empresa_id, terminal_id, observaciones, creado_por) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("empresa_id", sql.Int, empresa_id)
        .input("terminal_id", sql.Int, terminal_id)
        .input("observaciones", sql.NVarChar, observaciones)
        .input("creado_por", sql.Int, creado_por)
        .query(
          "EXECUTE [control_equipo].[sp_ins_inventario_general] @empresa_id, @terminal_id, @observaciones, @creado_por"
        );
      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  const createDetailInventarioRegister = async (inventario_id, captura_manual, linea_transportista_id, linea_transportista, tipo_unidad_id, unidad_id, identificador, anden_id, cargado, creado_por, estatus_id) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("inventario_id", sql.Int, inventario_id)
        .input("captura_manual", sql.Bit, captura_manual)
        .input("linea_transportista_id", sql.Int, linea_transportista_id)
        .input("linea_transportista", sql.NVarChar, linea_transportista)
        .input("tipo_unidad_id", sql.Int, tipo_unidad_id)
        .input("unidad_id", sql.Int, unidad_id)
        .input("identificador", sql.NVarChar, identificador)
        .input("anden_id", sql.Int, anden_id)
        .input("cargado", sql.Bit, cargado)
        .input("creado_por", sql.Int, creado_por)
        .input("estatus_id", sql.Int, estatus_id)
        .query(
          "EXECUTE [control_equipo].[sp_ins_inventario_detalle] @inventario_id, @captura_manual, @linea_transportista_id, @linea_transportista, @tipo_unidad_id, @unidad_id, @identificador, @anden_id, @cargado, @creado_por, @estatus_id"
        );
      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  const createDetailInventarioSimplifiedV1Register = async (inventario_id, captura_manual, identificador, anden_id, cargado, creado_por) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("inventario_id", sql.Int, inventario_id)
        .input("captura_manual", sql.Bit, captura_manual)
        .input("identificador", sql.NVarChar, identificador)
        .input("anden_id", sql.Int, anden_id)
        .input("cargado", sql.Bit, cargado)
        .input("creado_por", sql.Int, creado_por)
        .query(
          "EXECUTE [control_equipo].[sp_ins_inventario_detalle_simplified_v1] @inventario_id, @captura_manual, @identificador, @anden_id, @cargado, @creado_por"
        );
      return result.recordset;
    } catch (err) {
      throw err;
    }
  };

  module.exports = {
    getAndenesList,
    createMainInventarioRegister,
    createDetailInventarioRegister,
    createDetailInventarioSimplifiedV1Register
  }