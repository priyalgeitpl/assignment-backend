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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCategories = exports.generateCategories = exports.getCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const fs = require('fs');
const faker_1 = require("@faker-js/faker");
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.category.findMany({
            select: {
                title: true,
            },
        });
        res.send(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getCategory = getCategory;
function generateCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = [];
            for (let i = 0; i < 100; i++) {
                const category = faker_1.faker.commerce.department();
                categories.push(category);
            }
            const data_list = ["Industrial", "Jewelry", "Garden", "Home", "Outdoors", "Electronics", "Baby", "Books", "Electronics", "Computers", "Industrial", "Beauty", "Movies", "Industrial", "Beauty", "Movies", "Outdoors", "Games", "Grocery", "Kids", "Books", "Home", "Tools", "Automotive", "Garden", "Sports", "Games", "Health", "Beauty", "Computers", "Health", "Sports", "Books", "Games", "Kids", "Home", "Games", "Outdoors", "Shoes", "Garden", "Clothing", "Clothing", "Shoes", "Sports", "Grocery", "Clothing", "Kids", "Industrial", "Jewelry", "Home", "Industrial", "Clothing", "Industrial", "Automotive", "Music", "Clothing", "Kids", "Industrial", "Baby", "Music", "Outdoors", "Music", "Clothing", "Sports", "Jewelry", "Jewelry", "Toys", "Automotive", "Baby", "Clothing", "Computers", "Clothing", "Outdoors", "Home", "Home", "Outdoors", "Movies", "Computers", "Outdoors", "Music", "Toys", "Music", "Health", "Books", "Games", "Music", "Sports", "Shoes", "Home", "Music", "Games", "Music", "Computers", "Health", "Movies", "Tools", "Sports", "Home", "Industrial", "Sports"];
            const newCategories = yield prisma.category.createMany({
                data: data_list.map((title) => ({
                    title,
                })),
            });
            res.send(categories);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.generateCategories = generateCategories;
const saveCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, selectedCategories } = req.body;
        // Check if the user exists
        const user = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Save selected categories for the user
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: {
                category: {
                    set: selectedCategories, // Set the selected categories for the user
                },
            },
            select: {
                id: true,
                category: true,
            },
        });
        res.send(updatedUser);
    }
    catch (error) {
        console.error('Error saving categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.saveCategories = saveCategories;
exports.default = { getCategory: exports.getCategory, generateCategories, saveCategories: exports.saveCategories };
