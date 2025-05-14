const { pgPool } = require("../config/postgresql");

const getViajeActivoDataByNoOperador = async (no_operador) => {
    if (!no_operador) throw new Error("no_operador es requerido");

    const SQL = `
        SELECT
        v.id AS v_id
        , v.folio AS v_folio
        , v.created_at AS v_created_at
        , lts.operator_id AS lts_operator_id
        , e.employee_number AS e_employee_number
        , e.full_name AS e_full_name
        , lts.vehicle_id AS lts_vehicle_id
        , u.identifier AS u_identifier
        , lts.container_id AS lts_container_id
        , r.identifier AS r_identifier
        , lts.destination_name AS lts_destination_name
        FROM local_tickets v
        LEFT JOIN local_ticket_shipments lts ON v.id = lts.local_ticket_id
        LEFT JOIN employees e ON lts.operator_id = e.id
        LEFT JOIN vehicles u ON lts.vehicle_id = u.id
        LEFT JOIN vehicles r ON lts.container_id = r.id
        WHERE v.deleted_at IS NULL
        AND v.replacement = false
        AND v.status = 0
        AND e.employee_number = $1
        ORDER BY v.id DESC
        LIMIT 1;
    `;

    try {
        const { rows } = await pgPool.query(SQL, [no_operador]);
        return rows;
        } catch (error) {
        console.error("Error al obtener viaje activo:", error);
        throw error;
    }
};

module.exports = {
  getViajeActivoDataByNoOperador
};