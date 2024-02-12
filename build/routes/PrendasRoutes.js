"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prendasController_1 = require("../controllers/prendasController");
class PrendasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/MostrarPrenda/:id', prendasController_1.prendasController.mostrarPrenda);
        this.router.get('/MostrarPrendas/', prendasController_1.prendasController.mostrarTodasPrendas);
        this.router.post('/CrearPrenda/', prendasController_1.prendasController.crearPrenda);
        this.router.delete('/EliminarPrenda/:id', prendasController_1.prendasController.eliminarPrenda);
        this.router.put('/ActualizarPrenda/', prendasController_1.prendasController.actualizarPrenda);
        this.router.get('/MostrarPrendasPorFecha/', prendasController_1.prendasController.mostrarPrendasPorFecha);
        this.router.get('/MostrarPrendasPorDia/', prendasController_1.prendasController.mostrarPrendasPorDia);
        this.router.get('/StockDisponible/', prendasController_1.prendasController.stockDisponible);
        this.router.get('/StockPorTipo/', prendasController_1.prendasController.StockPorTipo);
        this.router.get('/MostrarTallas/', prendasController_1.prendasController.mostrarTallas);
        this.router.get('/MostrarTiposPrendas/', prendasController_1.prendasController.mostrarTiposPrendas);
        this.router.get('/VerificarPrenda/:id', prendasController_1.prendasController.verificarPrenda);
    }
}
const prendaRoutes = new PrendasRoutes();
exports.default = prendaRoutes.router;
