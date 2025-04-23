const { pgPool } = require("../config/postgresql");

const getLiquidacionesListByNoOperador = async (no_operador) => {
    const SQL = `
    SELECT liquidated_at            AS fecha_liquidacion,
           fl.folio                 AS no_liquidacion,
           lt.start_date            AS fecha_viaje,
           lt.folio                 AS no_viaje,
           r.identifier             AS remolque
    FROM   foreign_liquidations       fl
    LEFT JOIN employees               e   ON fl.employee_id = e.id
    LEFT JOIN trip_liquidations       tl  ON tl.foreign_liquidation_id = fl.id
                                           AND tl.deleted_at IS NULL
    LEFT JOIN local_tickets           lt  ON lt.id = tl.liquidable_id
                                           AND tl.liquidable_type = 'LocalTicket'
    LEFT JOIN local_ticket_shipments  lts ON lt.id = lts.local_ticket_id
    LEFT JOIN vehicles                r   ON lts.container_id = r.id
    WHERE  fl.deleted_at IS NULL
      AND  e.employee_number = $1
    ORDER BY fl.id DESC;
  `;
  const { rows } = await pgPool.query(SQL, [no_operador]);
  return rows;
  };

  module.exports = {
    getLiquidacionesListByNoOperador
  };