const { getViajeActivoDataByNoOperador, getUbicacionDestinoDataByFolioViaje, getHorariosEstacionesByIdViaje } = require("../models/circuloServicioModel");

const get_viaje_activo_data_by_no_operador = async (req, res) => {
    const { no_operador } = req.query;

    try {
        if (!no_operador || parseInt(no_operador) === 0) {
            return res.status(404).json({ message: "Número de operador no válido o no especificado" });
        }

        const viajeActivoData = await getViajeActivoDataByNoOperador(no_operador);

        if (!viajeActivoData) {
            return res.status(204).json({ message: "No se encontró información de un viaje activo" });
        }

        if (!viajeActivoData || viajeActivoData.length === 0) {
            return res.status(200).json(null);
        }

        return res.status(200).json(viajeActivoData[0]);
    } catch (err) {
        return res.status(500).json({ message: `Error al intentar obtener la información del último viaje activo del operador no. ${no_operador}`, error: err.message });
    }
};

const get_ubicacion_destino_data_by_folio_viaje = async (req, res) => {
    const { no_viaje } = req.query;

    try {
        if (!no_viaje || parseInt(no_viaje) === 0) {
            return res.status(404).json({ message: "Número de viaje no válido o no especificado" });
        }

        const destinoData = await getUbicacionDestinoDataByFolioViaje(no_viaje);

        if (!destinoData) {
            return res.status(204).json({ message: "No se encontró información de la ubicación destino" });
        }

        if (!destinoData || destinoData.length === 0) {
            return res.status(200).json(null);
        }

        return res.status(200).json(destinoData[0]);
    } catch (err) {
        return res.status(500).json({ message: `Error al intentar obtener las coordenadas de ubicación destino del viaje activo no. ${no_viaje}`, error: err.message });
    }
};

const get_horarios_estaciones_by_id_viaje = async (req, res) => {
    const { local_ticket_id } = req.query;

    try {
        if (!local_ticket_id || parseInt(local_ticket_id) === 0) {
            return res.status(404).json({ message: "Id de viaje no válido o no especificado" });
        }

        const horariosEstaciones = await getHorariosEstacionesByIdViaje(local_ticket_id);

        if (!horariosEstaciones) {
            return res.status(204).json({ message: "No se encontró información sobre el viaje especificado" });
        }

        if (!horariosEstaciones || horariosEstaciones.length === 0) {
            return res.status(200).json(null);
        }

        return res.status(200).json(horariosEstaciones[0]);
    } catch (err) {
        return res.status(500).json({ message: `Error al intentar obtener los horarios registrados para el viaje con id: ${local_ticket_id}`, error: err.message });
    }
};

const notify_horario_pendiente_para_finalizar_viaje = async (req, res) => {
    const { local_ticket_id } = req.query;

    try {
        if (!local_ticket_id || parseInt(local_ticket_id) === 0) {
            return res.status(404).json({ message: "Id de viaje no válido o no especificado" });
        }

        // obtener unidad asignada al viaje
        // obtener coordinador de unidad/operador
        // obtener correo de coordinador
        // enviar correo
        // devolver respuesta
    } catch (err) {
        return res.status(500).json({ message: `Error al intentar enviar la notificación para el viaje con id: ${local_ticket_id}`, error: err.message });
    }
};

module.exports = {
    get_viaje_activo_data_by_no_operador,
    get_ubicacion_destino_data_by_folio_viaje,
    get_horarios_estaciones_by_id_viaje,
    notify_horario_pendiente_para_finalizar_viaje
};