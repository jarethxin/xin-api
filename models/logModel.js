const { poolPromise, sql } = require("../config/mssql");

const createLog = async (id_usuario, usuario, tipo_evento, entidad_afectada, descripcion) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id_usuario", sql.Int, id_usuario)
        .input("usuario", sql.VarChar, usuario)
        .input("tipo_evento", sql.VarChar, tipo_evento)
        .input("entidad_afectada", sql.VarChar, entidad_afectada)
        .input("descripcion", sql.VarChar, descripcion)
        .query(
          `INSERT INTO [log].[eventos] ([id_usuario], [usuario], [tipo_evento], [entidad_afectada], [descripcion])
          OUTPUT INSERTED.[id]
          VALUES (@id_usuario, @usuario, @tipo_evento, @entidad_afectada, @descripcion)`
    );
      return result.recordset;
    } catch (err) {
      throw err;
    }
  };