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
exports.articulosController = void 0;
const database_1 = __importDefault(require("../database")); // Asegúrate de tener configurada la conexión a la base de datos
class ArticulosController {
    mostrarArticulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_articulo } = req.params;
                console.log(id_articulo);
                const respuesta = yield database_1.default.query(`
      
      SELECT a.id_articulo, a.precio_venta, a.precio_compra, a.fecha_alta, a.status, ta.articulo AS tipo_articulos
      FROM articulos a
      INNER JOIN tipos_articulos ta ON a.id_tipo = ta.id_articulo
      WHERE a.id_articulo = ?`, [id_articulo]);
                if (respuesta.length > 0) {
                    res.json(respuesta[0]);
                    return;
                }
                res.status(404).json({ mensaje: 'Artículo no encontrado' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener el artículo' });
            }
        });
    }
    insertarArticulo(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { precio_venta, tipo, precio_compra } = req.body;
                const idPrendaResult = yield database_1.default.query('SELECT id_articulo FROM tipos_articulos WHERE articulo = ?', [tipo]);
                const id_tipo = (_a = idPrendaResult[0]) === null || _a === void 0 ? void 0 : _a.id_articulo;
                // Verificar si los precios son números
                if (isNaN(Number(precio_venta)) || isNaN(Number(precio_compra))) {
                    res.status(400).json({ mensaje: 'Precio inválido' });
                    return;
                }
                const resp = yield database_1.default.query('INSERT INTO articulos (precio_venta, id_tipo, precio_compra) VALUES (?, ?, ?)', [precio_venta, id_tipo, precio_compra]);
                res.json({ mensaje: 'Articulo creado exitosamente' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al crear el artículo' });
            }
        });
    }
    actualizarArticulo(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, precio_venta, tipo, precio_compra, status } = req.body;
                const idPrendaResult = yield database_1.default.query('SELECT id_articulo FROM tipos_articulos WHERE articulo = ?', [tipo]);
                const id_tipo = (_a = idPrendaResult[0]) === null || _a === void 0 ? void 0 : _a.id_articulo;
                if (isNaN(Number(precio_venta)) || isNaN(Number(precio_compra))) {
                    res.status(400).json({ mensaje: 'Precio inválido' });
                    return;
                }
                // Si el id_tipo existe, proceder a actualizar el artículo
                const resp = yield database_1.default.query('UPDATE articulos SET precio_venta = ?, id_tipo = ?, precio_compra = ?, status = ? WHERE id_articulo = ?', [precio_venta, id_tipo, precio_compra, status, id]);
                res.json(resp);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al actualizar el artículo' });
            }
        });
    }
    eliminarArticulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const respuesta = yield database_1.default.query('DELETE FROM articulos WHERE id_articulo = ?', [id]);
                if (respuesta.affectedRows > 0) {
                    res.json({ mensaje: 'Artículo eliminado correctamente' });
                }
                else {
                    res.status(404).json({ mensaje: 'Artículo no encontrado' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al eliminar el artículo' });
            }
        });
    }
    articulosPorFecha(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio, fechaFin } = req.body;
                if (!fechaInicio || !fechaFin) {
                    res.status(400).json({ mensaje: 'Se requieren ambas fechas (fechaInicio y fechaFin)' });
                    return;
                }
                if (new Date(fechaInicio) > new Date(fechaFin)) {
                    res.status(400).json({ mensaje: 'La fecha de inicio debe ser anterior o igual a la fecha de fin' });
                    return;
                }
                const respuesta = yield database_1.default.query(`
      SELECT a.id_articulo, a.precio_venta, a.precio_compra, a.fecha_alta, a.status, ta.articulo AS tipo_articulos
      FROM articulos a
      INNER JOIN tipos_articulos ta ON a.id_tipo = ta.id_articulo
      WHERE fecha_alta BETWEEN ? AND ?`, [fechaInicio, fechaFin]);
                if (respuesta.length > 0) {
                    res.json(respuesta);
                    return;
                }
                res.status(404).json({ mensaje: 'Artículos no encontrados' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener los artículos por fecha' });
            }
        });
    }
    mostrarTodosArticulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultado = yield database_1.default.query(`
      SELECT a.id_articulo, a.precio_venta, a.precio_compra, a.fecha_alta, a.status, ta.articulo AS tipo_articulos
      FROM articulos a
      INNER JOIN tipos_articulos ta ON a.id_tipo = ta.id_articulo`);
                res.json(resultado);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener los artículos' });
            }
        });
    }
    mostrarArticulosPorDia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fechaInicio } = req.body;
                // Realizar la consulta para obtener los artículos del día especificado
                const resultado = yield database_1.default.query(`
      SELECT a.id_articulo, a.precio_venta, a.precio_compra, a.fecha_alta, a.status, ta.articulo AS tipo_articulos
      FROM articulos a
      INNER JOIN tipos_articulos ta ON a.id_tipo = ta.id_articulo
        WHERE DATE(fecha_alta) = DATE(?)
      `, [fechaInicio]);
                // Enviar el resultado como respuesta
                res.json({ articulos: resultado });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener los artículos por fecha' });
            }
        });
    }
    stockDisponible(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultado = yield database_1.default.query(`
        SELECT *
        FROM articulos
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tipo } = req.params;
                const idTallaResult = yield database_1.default.query('SELECT id_articulo FROM tipos_articulos  WHERE articulo = ?', [tipo]);
                const idTipo = (_a = idTallaResult[0]) === null || _a === void 0 ? void 0 : _a.id_articulo;
                const resultado = yield database_1.default.query(`
        SELECT COUNT(*) AS cantidad_articulos
        FROM articulos
        WHERE id_tipo = ?  AND status = 'EN VENTA'
      `, [idTipo]);
                // Extraer la cantidad de prendas del resultado
                const cantidadArticulos = ((_b = resultado[0]) === null || _b === void 0 ? void 0 : _b.cantidad_articulos) || 0;
                // Enviar la cantidad de prendas como respuesta
                res.json({ cantidad_articulos: cantidadArticulos });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ mensaje: 'Error al obtener la cantidad de articulos' });
            }
        });
    }
    mostrarTiposArticulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Consultar todos los tipos desde la base de datos
                const tipos = yield database_1.default.query('SELECT tipos_articulos.articulo FROM tipos_articulos');
                // Responder a la solicitud HTTP con los tipos obtenidos
                res.json({ tipos: tipos });
            }
            catch (error) {
                console.error('Error al obtener los tipos:', error);
                res.status(500).json({ mensaje: 'Error al obtener los tipos' });
            }
        });
    }
}
exports.articulosController = new ArticulosController();
