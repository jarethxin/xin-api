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

const getUbicacionDestinoDataByFolioViaje = async (no_viaje) => {
    const SQL = `
        SELECT 
        lt.folio AS lt_folio
        , lts.operator_id AS lts_operator_id
        , lts.destination_id AS lts_destination_id
        , stops.name AS stops_name
        , ST_X(stops.center) AS stops_latitude
        , ST_Y(stops.center) AS stops_longitude
        FROM local_tickets lt
        LEFT JOIN local_ticket_shipments lts ON lt.id = lts.local_ticket_id
        LEFT JOIN local_route_versions lrv ON lt.local_route_version_id = lrv.id
        LEFT JOIN (
        	SELECT id, name, center, 'BaseStop' AS stop_type FROM base_stops WHERE deleted_at IS NULL
        	UNION ALL
        	SELECT id, name, center, 'SharedStop' AS stop_type FROM shared_stops WHERE deleted_at IS NULL
        ) AS stops ON stops.id = lrv.destination_id AND stops.stop_type = lrv.destination_type
        WHERE lt.deleted_at IS NULL
        AND lt.replacement = false
        AND lt.status = 0
        AND lt.folio = $1
        ORDER BY lt.id DESC
        LIMIT 1;
    `;

    try {
        const { rows } = await pgPool.query(SQL, [no_viaje]);
        return rows;
        } catch (error) {
        console.error("Error al obtener coordenadas de ubicación destino:", error);
        throw error;
    }
};

const getHorariosEstacionesByIdViaje = async (id) => {
    const SQL = `
        SELECT
          id AS local_ticket_shipment_id
        , local_ticket_id
        -- , route_type
        -- , completed
        -- , local_ticket_shipments.foreign
        -- , operation_type
        -- , operation_department_id
        , origin_entrance AS origen_entrada
        , exit AS origen_salida
        , modulation_entrance AS modulacion_entrada
        , modulation_exit AS modulacion_salida
        , us_entrance AS us_entrada
        , us_exit AS us_salida
        , mx_entrance AS mx_entrada
        , mx_exit AS mx_salida
        , destination_entrance AS destino_entrada
        , destination_exit AS destino_salida
        FROM public.local_ticket_shipments
        WHERE local_ticket_id = $1
        ORDER BY id DESC;
    `;

    try {
        const { rows } = await pgPool.query(SQL, [id]);
        return rows;
        } catch (error) {
        console.error("Error al obtener los horarios del viaje especificado:", error);
        throw error;
    }
};

module.exports = {
  getViajeActivoDataByNoOperador,
  getUbicacionDestinoDataByFolioViaje,
  getHorariosEstacionesByIdViaje
};