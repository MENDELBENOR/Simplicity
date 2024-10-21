import express from "express";
import { createTask, getTaskByGroup } from '../controllers/task.controller';

const taskRouter = express.Router();

taskRouter.get('/getTaskByGroup/:_id', getTaskByGroup);
taskRouter.post('/createTask/', createTask);

export default taskRouter;