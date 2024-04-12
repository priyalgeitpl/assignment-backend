import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()
const fs = require('fs');

export const getCategory = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                title: true,
            },
        });

        res.send(categories);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
};

export async function generateCategories(req: Request, res: Response) {
    try {
        const categories = [];

        for (let i = 0; i < 100; i++) {
            const category = faker.commerce.department();
            categories.push(category);
        }

        const data_list = ["Industrial", "Jewelry", "Garden", "Home", "Outdoors", "Electronics", "Baby", "Books", "Electronics", "Computers", "Industrial", "Beauty", "Movies", "Industrial", "Beauty", "Movies", "Outdoors", "Games", "Grocery", "Kids", "Books", "Home", "Tools", "Automotive", "Garden", "Sports", "Games", "Health", "Beauty", "Computers", "Health", "Sports", "Books", "Games", "Kids", "Home", "Games", "Outdoors", "Shoes", "Garden", "Clothing", "Clothing", "Shoes", "Sports", "Grocery", "Clothing", "Kids", "Industrial", "Jewelry", "Home", "Industrial", "Clothing", "Industrial", "Automotive", "Music", "Clothing", "Kids", "Industrial", "Baby", "Music", "Outdoors", "Music", "Clothing", "Sports", "Jewelry", "Jewelry", "Toys", "Automotive", "Baby", "Clothing", "Computers", "Clothing", "Outdoors", "Home", "Home", "Outdoors", "Movies", "Computers", "Outdoors", "Music", "Toys", "Music", "Health", "Books", "Games", "Music", "Sports", "Shoes", "Home", "Music", "Games", "Music", "Computers", "Health", "Movies", "Tools", "Sports", "Home", "Industrial", "Sports"]

        const newCategories = await prisma.category.createMany({
            data: data_list.map((title) => ({
                title,
            })),
        });

        res.send(categories);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const saveCategories = async (req: Request, res: Response) => {
    try {
        const { userId, selectedCategories } = req.body;

        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Save selected categories for the user
        const updatedUser = await prisma.user.update({
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
    } catch (error) {
        console.error('Error saving categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
};

export default { getCategory, generateCategories, saveCategories };
