import express from "express";
import { createTask, editTask, getTaskByGroup } from '../controllers/task.controller';

const taskRouter = express.Router();

taskRouter.get('/getTaskByGroup/:_id', getTaskByGroup);
taskRouter.post('/createTask', createTask);
taskRouter.post('/updateTask', editTask);

export default taskRouter;