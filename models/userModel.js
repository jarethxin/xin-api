const { poolPromise, sql } = require("../config/db");

// probablemente será necesario colocar "[xidb]." al principio de cada query o establecer bd base xidb

const createUser = async (username, hash, employeeNumber) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("usuario", sql.NVarChar, username)
      .input("clave_hash", sql.NVarChar, hash)
      .input("id_personal", sql.Int, employeeNumber)
      .query(
        "EXECUTE [seguridad].[registrar_nuevo_usuario] @usuario, @clave_hash, @id_personal"
      );
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

const findUserById = async (id) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("EXECUTE [seguridad].[get_user_data_by_id] @id");
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

const findUserByUsername = async (username) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("usuario", sql.VarChar, username)
      .query("EXECUTE [seguridad].[get_user_data_by_usuario] @usuario");
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
    createUser,
    findUserById,
    findUserByUsername
}