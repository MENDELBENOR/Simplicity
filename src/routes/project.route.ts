import express from "express";
import {createProject} from '../controllers/project.controllers'

const projectRouter = express.Router();

projectRouter.post('/createProject', createProject);


export default projectRouter;


