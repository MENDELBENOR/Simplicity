import express from "express";
import { getAllGroups, createGroup } from '../controllers/group.controller'

const groupRouter = express.Router();

groupRouter.get('/getAllGroups', getAllGroups);
groupRouter.post('/createGroup', createGroup);

export default groupRouter;