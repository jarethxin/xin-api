const { getViajeActivoDataByNoOperador } = require("../models/circuloServicioModel");

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

module.exports = {
    get_viaje_activo_data_by_no_operador
};