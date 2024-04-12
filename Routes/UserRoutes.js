"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../Controllers/UserController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/user', UserController_1.getAllUsers);
router.post('/login', UserController_1.findUser);
router.post('/verify/email', UserController_1.verifyEmail);
router.post('/send/email', UserController_1.sendEmail);
router.post('/categories', UserController_1.saveCategories);
exports.default = router;
