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
}

export { getAllGroups }

