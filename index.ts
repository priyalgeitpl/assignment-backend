import express from 'express';
import { Request, Response } from 'express';
import userRoutes from './Routes/UserRoutes';
import CategoryRoutes from './Routes/CategoryRoutes';

const app = express();
const port = 3002;
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/', userRoutes);
app.use('/', CategoryRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World! This is your Node.js server.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
