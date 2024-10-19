import express from "express";
import { getGroupsByProject, createGroup } from '../controllers/group.controller'

const groupRouter = express.Router();

groupRouter.get('/getGroupsByProject/:_id', getGroupsByProject);
groupRouter.post('/createGroup', createGroup);

export default groupRouter;