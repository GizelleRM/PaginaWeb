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
exports.prendasController = void 0;
const database_1 = __importDefault(require("../database")); // Acceso a la base de datos
class PrendasController {
    verificarPrenda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const respuesta = yield database_1.default.query('SELECT p.id_prenda, p.id_lote, p.precio_venta, t.talla AS talla, p.fecha_alta, p.status FROM prendas p JOIN tallas t ON p.id_talla = t.id_talla WHERE p.id_prenda = ? AND p.status = "EN VENTA"', [id]);
                if (respuesta.length > 0) {
                    res.json(respuesta[0]);
                    return;
                }
                res.status(404).json({ mensaje: 'Prenda no disponible' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener los detalles de la prenda' });
            }
        });
    }
    mostrarPrenda(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const respuesta = yield database_1.default.query(` SELECT p.id_prenda, p.precio_venta, p.id_lote	, p.genero, p.fecha_alta,	
      p.status, t.talla, tp.prenda AS tipo
      FROM prendas p
      INNER JOIN tallas t ON p.id_talla = t.id_talla
      INNER JOIN tipos_prendas tp ON p.id_tipo = tp.id_tipo WHERE p.id_prenda = ? `, [id]);
                if (respuesta.length > 0) {
                    res.json(respuesta[0]);
                    return;
                }
                res.status(404).json({ mensaje: 'Prenda no encontrada' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener los detalles de la prenda' });
            }
        });
    }
    crearPrenda(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_lote, precio_venta, talla, genero, tipo } = req.body;
                console.log(id_lote);
                console.log(precio_venta);
                console.log(talla);
                console.log(genero);
                console.log(tipo);
                const idTallaResult = yield database_1.default.query('SELECT id_talla FROM tallas WHERE talla = ?', [talla]);
                const id_talla = (_a = idTallaResult[0]) === null || _a === void 0 ? void 0 : _a.id_talla;
                const idPrendaResult = yield database_1.default.query('SELECT id_tipo FROM tipos_prendas WHERE prenda = ?', [tipo]);
                const id_tipo = (_b = idPrendaResult[0]) === null || _b === void 0 ? void 0 : _b.id_tipo;
                if (!id_lote || !precio_venta || !id_talla || !genero) {
                    res.status(400).json({ mensaje: 'Se requieren todos los campos para crear una prenda' });
                    return;
                }
                const statusLoteResult = yield database_1.default.query('SELECT status FROM lotes WHERE id_lote = ?', [id_lote]);
                const statusLote = (_c = statusLoteResult[0]) === null || _c === void 0 ? void 0 : _c.status; // Obtener el valor del estado desde el resultado
                if (statusLote === 'FINALIZADO') {
                    res.status(400).json({ mensaje: 'Lote finalizado, no se pueden agregar más prendas' });
                    return;
                }
                const resp = yield database_1.default.query('INSERT INTO prendas (id_lote, precio_venta, id_talla, genero, id_tipo) VALUES (?, ?, ?, ?, ?)', [id_lote, precio_venta, id_talla, genero, id_tipo]);
                const respLote = yield database_1.default.query('UPDATE lotes SET prendas_en_alta = prendas_en_alta + 1 WHERE id_lote = ?', [id_lote]);
                const cantidad = yield database_1.default.query('SELECT cantidad FROM lotes WHERE id_lote = ?', [id_lote]);
                const prendas_en_alta = yield database_1.default.query('SELECT prendas_en_alta FROM lotes WHERE id_lote = ?', [id_lote]);
                if (cantidad == prendas_en_alta) {
                    const actualiza = yield database_1.default.query('UPDATE lotes SET status = ? WHERE id_lote = ?', ['FINALIZADO', id_lote]);
                }
                res.json({ mensaje: 'Prenda creada exitosamente' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al crear la prenda' });
            }
        });
    }
    // CRUD - Actualizar prenda por id
    actualizarPrenda(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_prenda, tipo, talla, id_lote, genero, precio_venta } = req.body;
                console.log(id_prenda);
                const idTallaResult = yield database_1.default.query('SELECT id_talla FROM tallas WHERE talla = ?', [talla]);
                const id_talla = (_a = idTallaResult[0]) === null || _a === void 0 ? void 0 : _a.id_talla;
                const idPrendaResult = yield database_1.default.query('SELECT id_tipo FROM tipos_prendas WHERE prenda = ?', [tipo]);
                const id_tipo = (_b = idPrendaResult[0]) === null || _b === void 0 ? void 0 : _b.id_tipo;
                const respuesta = yield database_1.default.query('UPDATE prendas SET id_tipo = ?, id_talla = ?, id_lote = ?, genero = ?, precio_venta = ? WHERE id_prenda = ?', [id_tipo, id_talla, id_lote, genero, precio_venta, id_prenda]);
                if (respuesta.affectedRows > 0) {
                    res.json({ mensaje: 'Prenda actualizada correctamente' });
                }
                else {
                    res.status(404).json({ mensaje: 'Prenda no encontrada' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al actualizar la prenda' });
            }
        });
    }
    mostrarTodasPrendas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield database_1.default.query(`
      SELECT p.id_prenda, p.precio_venta, p.id_lote	, p.genero, p.fecha_alta,	
      p.status, t.talla, tp.prenda AS tipo
      FROM prendas p
      INNER JOIN tallas t ON p.id_talla = t.id_talla
      INNER JOIN tipos_prendas tp ON p.id_tipo = tp.id_tipo
    `);
                res.json(respuesta);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener las prendas' });
            }
        });
    }
    eliminarPrenda(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Realizar una subconsulta para obtener el id_lote correspondiente al id_prenda
                const idLoteResult = yield database_1.default.query('SELECT id_lote FROM prendas WHERE id_prenda = ?', [id]);
                const id_lote = (_a = idLoteResult[0]) === null || _a === void 0 ? void 0 : _a.id_lote;
                // Realizar la consulta para obtener el status del lote actual
                const statusLoteResult = yield database_1.default.query('SELECT status, prendas_en_alta FROM lotes WHERE id_lote = ?', [id_lote]);
                const statusLote = (_b = statusLoteResult[0]) === null || _b === void 0 ? void 0 : _b.status;
                const prendasEnAlta = (_c = statusLoteResult[0]) === null || _c === void 0 ? void 0 : _c.prendas_en_alta;
                if (statusLote === 'FINALIZADO') {
                    // Si el status del lote es 'FINALIZADO', actualizarlo a 'EN PROCESO'
                    yield database_1.default.query('UPDATE lotes SET status = ? WHERE id_lote = ?', ['EN PROCESO', id_lote]);
                }
                // Realizar la eliminación de la prenda
                yield database_1.default.query('DELETE FROM prendas WHERE id_prenda = ?', [id]);
                // Actualizar la cantidad de prendas_en_alta en el lote disminuyendo en 1
                yield database_1.default.query('UPDATE lotes SET prendas_en_alta = ? -1 WHERE id_lote = ?', [prendasEnAlta, id_lote]);
                res.json({ mensaje: 'Prenda eliminada exitosamente' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al eliminar la prenda' });
            }
        });
    }
    mostrarPrendasPorFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio, fechaFin } = req.body;
                // Realizar la consulta para obtener las prendas dentro del rango de fechas
                const resultado = yield database_1.default.query(`
      SELECT prendas.id_prenda, prendas.precio_venta, prendas.genero, prendas.fecha_alta,	
      prendas.status, lotes.id_lote, t.talla, tp.prenda AS tipo
      FROM prendas
      INNER JOIN lotes ON prendas.id_lote = lotes.id_lote
      INNER JOIN tallas t ON prendas.id_talla = t.id_talla
      INNER JOIN tipos_prendas tp ON prendas.id_tipo = tp.id_tipo
      WHERE prendas.fecha_alta BETWEEN ? AND ?
    `, [fechaInicio, fechaFin]);
                // Enviar el resultado como respuesta
                res.json({ prendas: resultado });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener las prendas por fecha' });
            }
        });
    }
    mostrarPrendasPorDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio } = req.body;
                // Realizar la consulta para obtener las prendas del día especificado
                const resultado = yield database_1.default.query(`
      SELECT prendas.id_prenda, prendas.precio_venta, prendas.genero, prendas.fecha_alta,	
      prendas.status, lotes.id_lote, t.talla, tp.prenda AS tipo
      FROM prendas
      INNER JOIN lotes ON prendas.id_lote = lotes.id_lote
      INNER JOIN tallas t ON prendas.id_talla = t.id_talla
      INNER JOIN tipos_prendas tp ON prendas.id_tipo = tp.id_tipo
        WHERE DATE(prendas.fecha_alta) = DATE(?)
      `, [fechaInicio]);
                // Enviar el resultado como respuesta
                res.json({ prendas: resultado });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener las prendas por fecha' });
            }
        });
    }
    stockDisponible(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultado = yield database_1.default.query(`
        SELECT *
        FROM prendas
        WHERE status = 'EN VENTA'
      `);
                // Enviar la cantidad de prendas como respuesta
                res.json(resultado);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener la cantidad de prendas' });
            }
        });
    }
    stockDisponible2(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { talla, prenda } = req.body;
                // Obtener el id de la talla
                const idTallaResult = yield database_1.default.query('SELECT id_talla FROM tallas WHERE talla = ?', [talla]);
                const idTalla = (_a = idTallaResult[0]) === null || _a === void 0 ? void 0 : _a.id_talla;
                // Obtener el id de la prenda
                const idPrendaResult = yield database_1.default.query('SELECT id_tipo FROM tipos_prendas WHERE prenda = ?', [prenda]);
                const idPrenda = (_b = idPrendaResult[0]) === null || _b === void 0 ? void 0 : _b.id_tipo;
                // Obtener la cantidad de prendas con los id_talla e id_prenda correspondientes
                const resultado = yield database_1.default.query(`
        SELECT COUNT(*) AS cantidad_prendas
        FROM prendas
        WHERE id_tipo = ? AND id_talla = ? AND status = 'EN VENTA'
      `, [idPrenda, idTalla]);
                // Extraer la cantidad de prendas del resultado
                const cantidadPrendas = ((_c = resultado[0]) === null || _c === void 0 ? void 0 : _c.cantidad_prendas) || 0;
                // Enviar la cantidad de prendas como respuesta
                res.json({ cantidad_prendas: cantidadPrendas });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener la cantidad de prendas' });
            }
        });
    }
    StockPorTipo(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { prenda } = req.body;
                // Obtener el id de la prenda
                const idPrendaResult = yield database_1.default.query('SELECT id_tipo FROM tipos_prendas WHERE prenda = ?', [prenda]);
                const idPrenda = (_a = idPrendaResult[0]) === null || _a === void 0 ? void 0 : _a.id_tipo;
                console.log(idPrenda);
                // Consulta para obtener la lista de prendas con sus detalles
                const resultado = yield database_1.default.query(`
      SELECT prendas.id_prenda, tallas.talla, prendas.precio_venta, prendas.id_lote
        FROM prendas
        JOIN tallas ON prendas.id_talla = tallas.id_talla
        WHERE prendas.id_tipo = ? AND status = 'EN VENTA'
      `, [idPrenda]);
                // Enviar la lista de prendas como respuesta
                res.json({ prendas: resultado });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener la lista de prendas' });
            }
        });
    }
    mostrarTallas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Consultar todas las tallas desde la base de datos
                const tallas = yield database_1.default.query('SELECT tallas.talla FROM tallas');
                // Responder a la solicitud HTTP con las tallas obtenidas
                res.json({ tallas: tallas });
            }
            catch (error) {
                console.error('Error al obtener las tallas:', error);
                res.status(500).json({ mensaje: 'Error al obtener las tallas' });
            }
        });
    }
    mostrarTiposPrendas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Consultar todos los tipos desde la base de datos
                const tipos = yield database_1.default.query('SELECT tipos_prendas.prenda FROM tipos_prendas');
                // Responder a la solicitud HTTP con los tipos obtenidos
                res.json(tipos);
            }
            catch (error) {
                console.error('Error al obtener los tipos:', error);
                res.status(500).json({ mensaje: 'Error al obtener los tipos' });
            }
        });
    }
}
exports.prendasController = new PrendasController();
