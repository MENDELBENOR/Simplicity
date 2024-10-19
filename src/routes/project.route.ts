import express from "express";
import {createProject , updateProject, getAllProjects} from '../controllers/project.controllers'

const projectRouter = express.Router();

projectRouter.post('/createProject', createProject);
projectRouter.post('/updateProject', updateProject);
projectRouter.get('/getAllProjects', getAllProjects);

export default projectRouter;


