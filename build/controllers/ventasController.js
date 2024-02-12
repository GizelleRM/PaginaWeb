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
    mostrarFechasPeriodoPrendas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio, fechaFin } = req.params;
                // Validar que las fechas estén presentes
                if (!fechaInicio || !fechaFin) {
                    res.status(400).json({ mensaje: 'Se requieren ambas fechas: fechaInicio y fechaFin.' });
                    return;
                }
                // Consultar las ventas dentro del rango de fechas
                const ventas = yield database_1.default.query('SELECT * FROM ventas_generales WHERE fecha BETWEEN ? AND ?', [fechaInicio, fechaFin]);
                res.json({ ventas });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por fecha.' });
            }
        });
    }
    mostrarVentasPorDiaPrendas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fecha } = req.params; //get
                // Validar que la fecha esté presente
                if (!fecha) {
                    res.status(400).json({ mensaje: 'Se requiere la fecha para consultar las ventas de ese día.' });
                    return;
                }
                // Consultar todas las ventas de un día específico
                const ventas = yield database_1.default.query('SELECT * FROM ventas_generales WHERE DATE(fecha) = ?', [fecha]);
                res.json({ ventas });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por día.' });
            }
        });
    }
    registrarVentaPrendas(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idsPrendas = req.body.idsPrendas;
                const resultado = yield database_1.default.query('SELECT SUM(precio_venta) AS total, COUNT(*) AS cantidad FROM prendas WHERE id_prenda IN (?)', [idsPrendas]);
                const totalVenta = ((_a = resultado[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
                const cantidadPrendas = ((_b = resultado[0]) === null || _b === void 0 ? void 0 : _b.cantidad) || 0;
                const resultado2 = yield database_1.default.query('INSERT INTO ventas_generales(total, fecha, cantidad_productos) VALUES (?, NOW(), ?)', [totalVenta, cantidadPrendas]);
                const idVenta = resultado2.insertId;
                yield database_1.default.query('UPDATE prendas SET status = "VENDIDO" WHERE id_prenda IN (?)', [idsPrendas]);
                // Construir la consulta de inserción con múltiples filas
                let values = idsPrendas.map(idPrenda => `(${idPrenda}, ${idVenta})`).join(',');
                // Insertar las filas en la tabla ventas
                yield database_1.default.query(`INSERT INTO ventas (id_prenda, id_venta) VALUES ${values}`);
                res.json({ mensaje: 'Venta de prendas registrada correctamente', idVenta: idVenta });
            }
            catch (error) {
                console.error('Error al registrar la venta de prendas:', error);
                res.status(500).json({ mensaje: 'Error al registrar la venta de prendas' });
            }
        });
    }
    registrarVentaArticulos(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idsArticulos = req.body.idsArticulos;
                const resultado = yield database_1.default.query('SELECT SUM(precio_venta) AS total, COUNT(*) AS cantidad FROM articulos WHERE id_articulo IN (?)', [idsArticulos]);
                const totalVenta = ((_a = resultado[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
                const cantidadArticulos = ((_b = resultado[0]) === null || _b === void 0 ? void 0 : _b.cantidad) || 0;
                console.log(resultado);
                const resultado2 = yield database_1.default.query('INSERT INTO ventas_generales_articulos(total, fecha, cantidad_productos) VALUES (?, NOW(), ?)', [totalVenta, cantidadArticulos]);
                const idVenta = resultado2.insertId;
                console.log(idVenta);
                yield database_1.default.query('UPDATE articulos SET status = "VENDIDO" WHERE id_articulo IN (?)', [idsArticulos]);
                // Construir la consulta de inserción con múltiples filas
                let values = idsArticulos.map(idArticulo => `(${idArticulo}, ${idVenta})`).join(',');
                // Insertar las filas en la tabla ventas
                yield database_1.default.query(`INSERT INTO ventas_articulos (id_articulo, id_venta) VALUES ${values}`);
                res.json({ mensaje: 'Venta de prendas registrada correctamente', idVenta: idVenta });
            }
            catch (error) {
                console.error('Error al registrar la venta de prendas:', error);
                res.status(500).json({ mensaje: 'Error al registrar la venta de prendas' });
            }
        });
    }
    mostrarFechasPeriodoArticulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio, fechaFin } = req.params;
                // Validar que las fechas estén presentes
                if (!fechaInicio || !fechaFin) {
                    res.status(400).json({ mensaje: 'Se requieren ambas fechas: fechaInicio y fechaFin.' });
                    return;
                }
                // Consultar las ventas dentro del rango de fechas
                const ventas = yield database_1.default.query('SELECT * FROM ventas_generales_articulos WHERE fecha BETWEEN ? AND ?', [fechaInicio, fechaFin]);
                res.json({ ventas });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por fecha.' });
            }
        });
    }
    mostrarVentasPorDiaArticulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fecha } = req.params; //get
                // Validar que la fecha esté presente
                if (!fecha) {
                    res.status(400).json({ mensaje: 'Se requiere la fecha para consultar las ventas de ese día.' });
                    return;
                }
                // Consultar todas las ventas de un día específico
                const ventas = yield database_1.default.query('SELECT * FROM ventas_generales_articulos WHERE DATE(fecha) = ?', [fecha]);
                res.json({ ventas });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por día.' });
            }
        });
    }
    mostrarVentasPorPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio, fechaFin } = req.params;
                // Validar que las fechas estén presentes
                if (!fechaInicio || !fechaFin) {
                    res.status(400).json({ mensaje: 'Se requieren ambas fechas: fechaInicio y fechaFin.' });
                    return;
                }
                const ventas = yield database_1.default.query(`
      SELECT id_venta, total, cantidad_productos, fecha
      FROM ventas_generales
      WHERE fecha BETWEEN ? AND ?
      UNION ALL
      SELECT id_venta, total, cantidad_productos, fecha
      FROM ventas_generales_articulos
      WHERE fecha BETWEEN ? AND ?
    `, [fechaInicio, fechaFin, fechaInicio, fechaFin]);
                res.json({ ventas });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por fecha.' });
            }
        });
    }
    mostrarVentasPorDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio } = req.params;
                const ventas = yield database_1.default.query(`
      SELECT id_venta, total, cantidad_productos, fecha
      FROM ventas_generales
      WHERE DATE(fecha) = ?
      UNION ALL
      SELECT id_venta, total, cantidad_productos, fecha
      FROM ventas_generales_articulos
      WHERE DATE(fecha) = ?
    `, [fechaInicio, fechaInicio]);
                res.json({ ventas });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por fecha.' });
            }
        });
    }
    cortePorPeriodo(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio, fechaFin } = req.params;
                // Validar que las fechas estén presentes
                if (!fechaInicio || !fechaFin) {
                    res.status(400).json({ mensaje: 'Se requieren ambas fechas: fechaInicio y fechaFin.' });
                    return;
                }
                const resultado = yield database_1.default.query(`
      SELECT SUM(total) AS total_ventas
      FROM (
        SELECT total FROM ventas_generales WHERE fecha BETWEEN ? AND ?
        UNION ALL
        SELECT total FROM ventas_generales_articulos WHERE fecha BETWEEN ? AND ?
      ) AS ventas_combinadas
    `, [fechaInicio, fechaFin, fechaInicio, fechaFin]);
                const totalVentas = ((_a = resultado[0]) === null || _a === void 0 ? void 0 : _a.total_ventas) || 0;
                res.json({ totalVentas });
            }
            catch (error) {
                console.error('Error al consultar las ventas por fecha:', error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por fecha.' });
            }
        });
    }
    cortePorDia(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio } = req.params;
                // Consultar la suma total de las ventas dentro del rango de fechas
                const resultado = yield database_1.default.query(`
    SELECT SUM(total) AS total_ventas
    FROM (
      SELECT total FROM ventas_generales WHERE DATE(fecha) = ?
      UNION ALL
      SELECT total FROM ventas_generales_articulos WHERE DATE(fecha) = ?
    ) AS ventas_combinadas
  `, [fechaInicio, fechaInicio]);
                const totalVentas = ((_a = resultado[0]) === null || _a === void 0 ? void 0 : _a.total_ventas) || 0;
                res.json({ totalVentas });
            }
            catch (error) {
                console.error('Error al consultar las ventas por fecha:', error);
                res.status(500).json({ mensaje: 'Error al consultar las ventas por fecha.' });
            }
        });
    }
}
exports.ventasController = new VentasController();
