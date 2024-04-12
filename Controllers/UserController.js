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
exports.findUser = exports.signUp = exports.verifyEmail = exports.getAllUsers = void 0;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer = require('nodemailer');
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allUsers = yield prisma.user.findMany();
            res.json(allUsers);
        }
        catch (error) {
            console.error("errorr", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.getAllUsers = getAllUsers;
function verifyEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {

            const { email, code, password, name } = req.body;

            if (!email || !code) {
                return res.status(400).json({ error: 'Invalid input data' });
            }
            const verifiedUser = yield prisma.user.findFirst({
                where: {
                    email: email,
                    code: code
                },
            });
            if (verifiedUser) {
                res.status(200).json({ message: 'Email verified successfully' });
            }
            else {
                res.status(400).json({ error: 'Invalid verification code or email' });
            }
        }
        catch (error) {
            console.error('Error verifying email:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}

exports.verifyEmail = verifyEmail;
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        try {
            const existingUser = yield prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if (existingUser) {
                return res.status(409).json({ error: 'User Already Exists!' });
            }
            const verificationCode = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'tejas.p2468@gmail.com',
                    pass: 'fhdx ceer bdhj avfr'
                }
            });
            const mailOptions = {
                from: 'tejas.p2468@gmail.com',
                to: email,
                subject: 'Verification Code',
                text: `Your verification code is: ${verificationCode}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Failed to send verification email' });
                }
                console.log('Email sent:', info.response);
                return res.status(201).json();
            });

            const hashedPassword = bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
            const newUser = yield prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    code: verificationCode
                }
            });
        }
        catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}

function findUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const existingUser = yield prisma.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (existingUser) {
                const passwordMatch = yield bcrypt_1.default.compare(password, existingUser.password);
                if (passwordMatch) {
                    res.status(200).json({ message: 'Logged In' });
                }
                else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            }
            else {
                res.status(404).json({ error: 'User not found' });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
module.exports = { getAllUsers, signUp, findUser, verifyEmail };
