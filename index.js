"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoutes_1 = __importDefault(require("./Routes/UserRoutes"));
const CategoryRoutes_1 = __importDefault(require("./Routes/CategoryRoutes"));
const app = (0, express_1.default)();
const port = 3002;
const cors = require('cors');
app.use(express_1.default.json());
app.use(cors());
app.use('/', UserRoutes_1.default);
app.use('/', CategoryRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello, World! This is your Node.js server.');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
