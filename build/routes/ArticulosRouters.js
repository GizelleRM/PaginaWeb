"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articulosController_1 = require("../controllers/articulosController");
class ArticulosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/MostrarArticulo/:id_articulo', articulosController_1.articulosController.mostrarArticulo);
        this.router.post('/InsertarArticulo/', articulosController_1.articulosController.insertarArticulo);
        this.router.put('/ActualizarArticulo/', articulosController_1.articulosController.actualizarArticulo);
        this.router.delete('/EliminarArticulo/:id', articulosController_1.articulosController.eliminarArticulo);
        this.router.get('/ArticulosPorFecha/', articulosController_1.articulosController.articulosPorFecha);
        this.router.get('/MostrarTodosArticulos/', articulosController_1.articulosController.mostrarTodosArticulos);
        this.router.get('/MostrarArticulosPorDia/', articulosController_1.articulosController.mostrarArticulosPorDia);
        this.router.get('/StockDisponible/', articulosController_1.articulosController.stockDisponible);
        this.router.get('/MostrarTiposArticulos/', articulosController_1.articulosController.mostrarTiposArticulos);
    }
}
const articulosRoutes = new ArticulosRoutes();
exports.default = articulosRoutes.router;
