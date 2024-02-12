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
exports.loginController = void 0;
const database_1 = __importDefault(require("../database")); // Asegúrate de tener configurada la conexión a la base de datos
class LoginController {
    existe(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { correo, contrasena } = req.body;
            console.log(correo);
            const result = yield database_1.default.query('SELECT * FROM usuarios WHERE correo = ? ', [correo]);
            console.log(result);
            const id_tipo = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.tipo_usuario;
            // Verificar si se encontró un usuario
            if (result.length > 0) {
                const usuario = result[0];
                console.log(usuario);
                // Verificar si la contraseña coincide
                if (usuario.contrasena === contrasena) {
                    res.json(result[0]);
                }
                else
                    res.json({ "tipo_usuario": "-1" });
            }
        });
    }
}
exports.loginController = new LoginController();
