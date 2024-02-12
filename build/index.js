"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const PrendasRoutes_1 = __importDefault(require("./routes/PrendasRoutes"));
const ArticulosRouters_1 = __importDefault(require("./routes/ArticulosRouters"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const LoginRouters_1 = __importDefault(require("./routes/LoginRouters"));
const VentasRouters_1 = __importDefault(require("./routes/VentasRouters"));
const LotesRouters_1 = __importDefault(require("./routes/LotesRouters"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.app.use('/documentacion', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use('/api/prendas', PrendasRoutes_1.default);
        this.app.use('/api/articulos', ArticulosRouters_1.default);
        this.app.use('/api/usuarios', LoginRouters_1.default);
        this.app.use('/api/ventas', VentasRouters_1.default);
        this.app.use('/api/lotes', LotesRouters_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
