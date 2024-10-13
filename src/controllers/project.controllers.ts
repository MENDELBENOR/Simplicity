import { Request, Response } from 'express';
import { buildResponse } from '../utils/helper';
import Project from '../models/Project.schema';




// Create A New Project //
const createProject = async (req: Request, res: Response) => {
    const { name, description, icon } = req.body;

    // checks that all fields are complete 
    if (!name || !description) {
        const response = buildResponse(
            false, 'Please provide all the required fields', null, 'One of the fields (or more) is missing', null);
        res.status(400).json(response);
        return;
    }

    try {
        // checks if the project exists
        const project = await Project.findOne({ name });
        if (project) {
            const response = buildResponse(false, 'Project already exists', null, null, null);
            res.status(400).json(response);
            return;
        }
        
        // Create a new project
        let newProject = new Project({ name, description, icon });
        await newProject.save();

        const response = buildResponse(true, 'New project successfully created', null, null, newProject)
        res.status(200).json(response);

    } catch (err) {
        const response = buildResponse(
            false, 'Error creating project', null, err instanceof Error ? err.message : 'Unknown error', null
        );
        res.status(500).json(response);
    }
};






export { createProject };
