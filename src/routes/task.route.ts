import express from "express";
import { createTask, deleteTask, editTask, getTaskByGroup, exportTaskList } from '../controllers/task.controller';

const taskRouter = express.Router();

taskRouter.get('/getTaskByGroup/:_id', getTaskByGroup);
taskRouter.post('/createTask', createTask);
taskRouter.post('/updateTask', editTask);
taskRouter.post('/deleteTask', deleteTask);
taskRouter.post('/exportTaskList', exportTaskList);


export default taskRouter;