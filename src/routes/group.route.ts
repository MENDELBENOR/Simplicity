import express from "express";
import { getGroupsByProject, createGroup, updateGroup } from '../controllers/group.controller'

const groupRouter = express.Router();

groupRouter.get('/getGroupsByProject/:_id', getGroupsByProject);
groupRouter.post('/createGroup', createGroup);
groupRouter.post('/updateGroup', updateGroup);

export default groupRouter;