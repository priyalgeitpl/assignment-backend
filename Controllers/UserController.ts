import { Request, Response } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const nodemailer = require('nodemailer');

const generateToken = (user: { id: any; email: any; }) => {
    return jwt.sign({ id: user.id, email: user.email }, 'secretKey', { expiresIn: '1h' });
};

const verifyToken = (token: string) => {
    return jwt.verify(token, 'secretKey');
};

export async function getAllUsers(req: Request, res: Response) {
    try {
        const allUsers = await prisma.user.findMany();
        res.json(allUsers);
    } catch (error) {
        console.error("errorr", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export async function saveCategories(req: Request, res: Response) {
    try {
        const { userId, categories } = req.body;

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                category: categories
            }
        });

        res.status(200).json({ message: 'Categories Saved !', user: updatedUser });

    } catch (error) {
        console.error("errorr", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function verifyEmail(req: Request, res: Response) {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (existingUser.code === code) {
            const updatedUser = await prisma.user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    isVerified: true
                }
            });
            res.status(201).json({ message: 'User Registered successfully' });
        }
        else if (existingUser.code !== code) {
            res.status(400).json({ message: 'Verification code is invalid !' });
        }

        else {
            res.status(500).json({ error: 'error registering user' });
        }


    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function sendEmail(req: Request, res: Response) {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'User Already Exists!' });
        }

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        const verificationCode = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                code: verificationCode,
                isVerified: false
            }
        });

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'tejas.p2468@gmail.com',
                pass: 'kcmd hqau lrfq akpk'
            }
        });

        const mailOptions = {
            from: 'tejas.p2468@gmail.com',
            to: email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, (error: any, info: { response: any; }) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Failed to send verification email' });
            } else {
                console.log('Email sent:', info.response);
                return res.status(200).json({ message: 'Email Send successfully !' });
            }
        });

    } catch (error) {
        throw error;
    }
}

export async function findUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            const passwordMatch = await bcrypt.compare(password, existingUser.password);
            if (passwordMatch) {
                const token = generateToken(existingUser);
                existingUser.token = token;

                res.status(200).json({ message: 'Logged In', user: existingUser });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = { getAllUsers, saveCategories, findUser, verifyEmail, sendEmail };

