import express, { Application,Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import AuthRouter from './Auth/Auth.routes';
import "./utils/cron"
import GraduationRouter from './services/graduation/graduation.routes';
import UsersRouter from './services/users/users.routes';
import ElectionRouter from './services/elections/elections.route';

dotenv.config();

const app: Application = express();

// Basic Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//default route
app.get('/', (req, res:Response) => {
    res.send("Laikipia University App is running");
});

//import route
const PORT = process.env.PORT || 5000;
app.use('/api/auth/',AuthRouter);
app.use('/api/graduation', GraduationRouter);
app.use('/api/users/', UsersRouter);
app.use('/api/elections/', ElectionRouter);


// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

export default app;
  