import express from "express";
import {createProject , updateProject} from '../controllers/project.controllers'

const projectRouter = express.Router();

projectRouter.post('/createProject', createProject);
projectRouter.post('/updateProject', updateProject);


export default projectRouter;


