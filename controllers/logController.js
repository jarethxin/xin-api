const { createLog } = require("../models/logModel");

const create_log = async (req, res) => {
    const { id_usuario, usuario, tipo_evento, entidad_afectada, descripcion } = req.body;

    try {
        if (!id_usuario) return res.status(400).json({ message: "Id de usuario no especificado" });
        if (!usuario) return res.status(400).json({ message: "Usuario no especificado" });
        if (!tipo_evento) return res.status(400).json({ message: "Tipo de evento no especificado" });
        if (!entidad_afectada) return res.status(400).json({ message: "Entidad afectada no especificada" });
        if (!descripcion) return res.status(400).json({ message: "Descripción no especificada" });

        const id_evento = await createLog(id_usuario, usuario, tipo_evento, entidad_afectada, descripcion);

        if (!id_evento) return res.status(400).json({ message: "No se ha podido generar el registro del evento" });

        return res.status(200).json(id_evento);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error al intentar generar un log", error: err.message });
    }
};

module.exports = {
    create_log
};