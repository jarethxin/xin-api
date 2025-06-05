const { getViajeActivoDataByNoOperador, getUbicacionDestinoDataByFolioViaje, getHorariosEstacionesByIdViaje, getViajeDataByIdViaje, getCoordinadorByIdentificadorUnidad } = require("../models/circuloServicioModel");
const sendEmail = require("../helpers/sendEmail");
require("dotenv").config();
const validator = require('validator');

const get_viaje_activo_data_by_no_operador = async (req, res) => {
    const { no_operador } = req.query;

    try {
        if (!no_operador || parseInt(no_operador) === 0) {
            return res.status(400).json({ message: "Número de operador no válido o no especificado" });
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
            return res.status(400).json({ message: "Número de viaje no válido o no especificado" });
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
            return res.status(400).json({ message: "Id de viaje no válido o no especificado" });
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
            return res.status(400).json({ message: "Id de viaje no válido o no especificado" });
        }

        // obtener datos de viaje
        const viajeResult = await getViajeDataByIdViaje(local_ticket_id);
        if (viajeResult.rowCount === 0) {
            return res.status(404).json({ message: "Datos de viaje no encontrados" });
        }
        const { viaje_numero, viaje_operador_numero, viaje_operador_nombre, viaje_unidad } = viajeResult[0];
        
        // obtener datos de coordinador de unidad/operador
        const coordinadorResult = await getCoordinadorByIdentificadorUnidad(viaje_unidad);
        if (coordinadorResult.rowCount === 0) {
            return res.status(404).json({ message: "Datos de coordinador no encontrados" });
        }
        const { coordinador_nombre, coordinador_correo } = coordinadorResult[0];
        
        // validar correo de coordinador
        if (!validator.isEmail(coordinador_correo)) {
            return res.status(400).json({ message: "El correo del coordinador no es válido" });
        }
        
        // obtener link directo al viaje
        const tripBaseUrl = process.env.DAT_TRIP_BASE_URL;
        if (!tripBaseUrl) {
            return res.status(500).json({ message: "La URL base para el viaje no está definida en las variables de entorno" });
        }
        const viaje_url = tripBaseUrl.replace('{id}', local_ticket_id);
        
        // enviar correo
        await sendEmail({
            // to: coordinador_correo,
            to: "jarethr@xpressinternacional.com",
            subject: `Viaje no puede finalizarse por falta de captura de horarios`,
            html: `
            <p>Hola <strong>${coordinador_nombre}</strong>,</p>
            <p>El viaje <strong>#${viaje_numero}</strong> de la unidad <strong>${viaje_unidad}</strong> / operador <strong>${viaje_operador_numero} ${viaje_operador_nombre}</strong> <span style="color: red;">no puede finalizarse</span> porque está pendiente de capturar al menos un horario de entrada/salida.</p>
            <p>Por favor, verifícalo en el siguiente enlace:</p>
            <p><a href="${viaje_url}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Validar ahora</a></p>
            <p>Gracias.</p>
            `
        });
        
        // devolver respuesta
        return res.status(200).json({ message: "Notificación enviada con éxito." });

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