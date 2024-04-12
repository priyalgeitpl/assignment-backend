"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// productRoutes.js
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const CategoryController_1 = require("../Controllers/CategoryController");
router.get('/generatecategories', CategoryController_1.generateCategories);
router.get('/categories', CategoryController_1.getCategory);
router.post('/categories', CategoryController_1.saveCategories);
exports.default = router;
