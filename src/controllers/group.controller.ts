import { Request, Response } from 'express';
import Group from '../models/Gruop.schema';
import { buildResponse } from '../utils/helper';

const getAllGroups = async (req: Request, res: Response) => {
    const { _id } = req.body.params;

    if (!_id) {
        const response = buildResponse(false, "id is NOT valid", null, null);
        res.status(400).send(response);
        return;
    }

    try {
        const groups = await Group.find();

        const groupByProject = groups.filter((group) => group.projectId === _id);

        if (groups.length === 0 || groupByProject.length === 0) {
            const response = buildResponse(false, "We NOT found the group", null, null);
            res.status(400).send(response);
            return;
        }

        const response = buildResponse(true, "we found the groups", null, null, groupByProject);
        res.status(200).send(response);
        return;
    } catch (error) {
        const response = buildResponse(
            false, 'Failed to get groups', null, error instanceof Error ? error.message : 'Unknown error', null,
        );
        res.status(500).json(response);
    }
};

const createGroup = async (req: Request, res: Response) => {
    const {name, description, projectId} = req.body;
    if (!name || !description || !projectId) {
        const response = buildResponse(false, 'Please provide all the required fields', null, 'One of the fields (or more) is missing', null);
        res.status(400).json(response);
        return;
    };
    try{
        const existsGroup = await Group.findOne({name});
        if(existsGroup){
            const response = buildResponse(false, 'Group already exists', null, null, null);
            res.status(400).json(response);
            return;
        }
        const newGroup = new Group({name, description, projectId});
        await newGroup.save();
        const response = buildResponse(true, 'Group created successfully', null, null, newGroup);
        res.status(201).json(response);
    }catch(error){
        const response = buildResponse(false, 'Failed to create group', null,error instanceof Error ? error.message : 'Unknown error' , null);
        res.status(500).json(response);
    }
};

export { getAllGroups, createGroup }

