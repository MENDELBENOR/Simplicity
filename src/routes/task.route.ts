import express from "express";
import { getTaskByGroup } from '../controllers/task.controller';

const taskRouter = express.Router();

taskRouter.get('/getTaskByGroup/:_id', getTaskByGroup);

export default taskRouter;