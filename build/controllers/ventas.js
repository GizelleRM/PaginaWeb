"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ventasController = void 0;
const database_1 = __importDefault(require("../database"));
class VentasController {
    consultarVentasPorFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio, fechaFin } = req.params;
                // Validar que las fechas estén presentes
                if (!fechaInicio || !fechaFin) {
                    res.status(400).json({ mensaje: 'Se requieren ambas fechas: fechaInicio y fechaFin.' });
                    return;
                }
                // Consultar las ventas dentro del rango de fechas
                const ventas = yield database_1.default.query('SELECT * FROM ventas WHERE fecha_venta BETWEEN ? AND ?', [fechaInicio, fechaFin]);
                res.json({ ventas });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por fecha.' });
            }
        });
    }
    consultarVentasPorDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fecha } = req.params; //get
                // Validar que la fecha esté presente
                if (!fecha) {
                    res.status(400).json({ mensaje: 'Se requiere la fecha para consultar las ventas de ese día.' });
                    return;
                }
                // Consultar todas las ventas de un día específico
                const ventas = yield database_1.default.query('SELECT * FROM ventas WHERE DATE(fecha_venta) = ?', [fecha]);
                res.json({ ventas });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por día.' });
            }
        });
    }
}
exports.ventasController = new VentasController();
