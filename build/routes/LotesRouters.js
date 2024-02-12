"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lotesController_1 = require("../controllers/lotesController");
class PrendasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/ObtenerLotePorId/:id', lotesController_1.lotesController.obtenerLotePorId);
        this.router.post('/CrearLote/', lotesController_1.lotesController.crearLote);
        this.router.put('/ActualizarLote/:id', lotesController_1.lotesController.actualizarLote);
        this.router.get('/MostrarLotes/', lotesController_1.lotesController.mostrarTodosLotes);
    }
}
const prendaRoutes = new PrendasRoutes();
exports.default = prendaRoutes.router;
