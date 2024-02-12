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
exports.lotesController = void 0;
const database_1 = __importDefault(require("../database"));
class LotesController {
    obtenerLotePorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const respuesta = yield database_1.default.query('SELECT * FROM lotes WHERE id_lote = ?', [id]);
                if (respuesta.length > 0) {
                    res.json(respuesta[0]);
                }
                else {
                    res.status(404).json({ mensaje: 'Lote no encontrado' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener el lote' });
            }
        });
    }
    //insertar un nuevo lote
    crearLote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cantidad, precio } = req.body;
                // Iniciar una transacción
                yield database_1.default.query('START TRANSACTION');
                // Insertar el nuevo lote con fecha actual
                const respuesta = yield database_1.default.query('INSERT INTO lotes (cantidad, precio, fecha_alta) VALUES (?, ?, NOW())', [cantidad, precio]);
                if (respuesta.affectedRows > 0) {
                    // Obtener el ID del lote recién insertado
                    const idLote = respuesta.insertId;
                    // Confirmar la transacción
                    yield database_1.default.query('COMMIT');
                    res.json({ mensaje: 'Lote creado correctamente id: ', idLote });
                }
                else {
                    // Si no se pudo insertar el lote, revertir la transacción
                    yield database_1.default.query('ROLLBACK');
                    res.status(500).json({ mensaje: 'Error al insertar el lote' });
                }
            }
            catch (error) {
                // Si ocurre un error, revertir la transacción
                yield database_1.default.query('ROLLBACK');
                console.error(error);
                res.status(500).json({ mensaje: 'Error al crear el lote' });
            }
        });
    }
    //actualizar un lote 
    actualizarLote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { cantidad, precio, fecha_alta } = req.body;
                // Iniciar una transacción
                yield database_1.default.query('START TRANSACTION');
                // Actualizar el lote
                const respuesta = yield database_1.default.query('UPDATE lotes SET cantidad = ?, precio = ?, fecha_alta = ? WHERE id_lote = ?', [cantidad, precio, fecha_alta, id]);
                if (respuesta.affectedRows > 0) {
                    // Confirmar la transacción
                    yield database_1.default.query('COMMIT');
                    res.json({ mensaje: 'Lote actualizado correctamente', idLote: id });
                }
                else {
                    // Si no se pudo actualizar el lote, revertir la transacción
                    yield database_1.default.query('ROLLBACK');
                    res.status(500).json({ mensaje: 'Error al actualizar el lote' });
                }
            }
            catch (error) {
                // Si ocurre un error, revertir la transacción
                yield database_1.default.query('ROLLBACK');
                console.error(error);
                res.status(500).json({ mensaje: 'Error al actualizar el lote' });
            }
        });
    }
    mostrarTodosLotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Realizar la consulta para obtener todos los lotes
                const lotes = yield database_1.default.query('SELECT * FROM lotes');
                // Enviar el resultado como respuesta
                res.json(lotes);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener los lotes' });
            }
        });
    }
}
exports.lotesController = new LotesController();
