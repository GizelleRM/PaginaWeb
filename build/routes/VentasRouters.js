"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ventasController_1 = require("../controllers/ventasController");
class VentasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/MostrarVentasPeriodoPrendas/:fechaInicio/:fechaFin', ventasController_1.ventasController.mostrarFechasPeriodoPrendas);
        this.router.get('/MostrarVentasPorDiaPrendas/:fecha', ventasController_1.ventasController.mostrarVentasPorDiaPrendas);
        this.router.post('/RegistrarVentaPrendas/', ventasController_1.ventasController.registrarVentaPrendas);
        this.router.post('/RegistrarVentaArticulos/', ventasController_1.ventasController.registrarVentaArticulos);
        this.router.get('/MostrarVentasPeriodoArticulos/:fechaInicio/:fechaFin', ventasController_1.ventasController.mostrarFechasPeriodoArticulos);
        this.router.get('/MostrarVentasPorDiaArticulos/:fecha', ventasController_1.ventasController.mostrarVentasPorDiaArticulos);
        this.router.get('/MostrarVentasPeriodo/:fechaInicio/:fechaFin', ventasController_1.ventasController.mostrarVentasPorPeriodo);
        this.router.get('/MostrarVentasPorDia/:fechaInicio/', ventasController_1.ventasController.mostrarVentasPorDia);
        this.router.get('/CortePorPeriodo/:fechaInicio/:fechaFin', ventasController_1.ventasController.cortePorPeriodo);
        this.router.get('/CortePorDia/:fechaInicio/', ventasController_1.ventasController.cortePorDia);
    }
}
const ventasRoutes = new VentasRoutes();
exports.default = ventasRoutes.router;
