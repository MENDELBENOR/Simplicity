import { Request, Response } from 'express';
import { buildResponse } from '../utils/helper';
import Task from '../models/Task.schema';
import Group from '../models/Gruop.schema';

export const getTaskByGroup = async (req: Request, res: Response) => {
    const { _id } = req.params;

    if (!_id) {
        const response = buildResponse(false, "id is NOT valid", null, null);
        res.status(400).send(response);
        return;
    }
    try {
        const tasks = await Task.find();
        const taskByGroup = tasks.filter((task) => task.groupId === _id);

        if (tasks.length === 0 || taskByGroup.length === 0) {
            const response = buildResponse(false, "We NOT found the group", null, null);
            res.status(400).send(response);
            return;
        }

        const response = buildResponse(true, "we found the tasks", null, null, taskByGroup);
        res.status(200).send(response);
        return;
    } catch (error) {
        const response = buildResponse(
            false, 'Failed to get tasks', null, error instanceof Error ? error.message : 'Unknown error', null,
        );
        res.status(500).json(response);
    }
}

export const createTask = async (req: Request, res: Response) => {
    const { name, description, status, duration, groupId } = req.body;

    if (!name || !description || !status || !duration || !groupId) {
        const response = buildResponse(false, "all fildes most be valid!", null, null);
        res.status(400).send(response);
        return;
    }

    try {

        const group = await Group.findById(groupId);

        if (!group) {
            const response = buildResponse(false, "We NOT find a group!", null, null);
            res.status(400).send(response);
            return;
        }

        const newTask = await Task.create({
            name,
            description,
            status,
            duration,
            groupId
        })

        if (newTask) {
            const response = buildResponse(true, "Task create succefully!", null, null, newTask);
            res.status(200).send(response);
            return;
        }

    } catch (error) {
        const response = buildResponse(
            false, 'Failed to create task', null, error instanceof Error ? error.message : 'Unknown error', null,
        );
        res.status(500).json(response);
    }

}

export const editTask = async (req: Request, res: Response) => {
    const { taskId, data, type } = req.body;

    if (!taskId || !data || !type) {
        const response = buildResponse(false, "Fullfild the data!", null, null);
        res.status(400).send(response);
        return;
    }

    try {

        const task = await Task.findById(taskId);

        if (!task) {
            const response = buildResponse(false, "We NOT find the task!", null, null);
            res.status(400).send(response);
            return;
        }

        if (type === "name")
            task.name = data;
        else if (type === "description")
            task.description = data;
        else if (type === "status")
            task.status = data;
        else if (type === "duration") {
            if (data <= 0) {
                const response = buildResponse(false, "The duration most be positive!", null, null);
                res.status(400).send(response);
                return;
            }
            task.duration = data;
        }

        await task.save();

        const response = buildResponse(true, `update ${type} succefully!`, null, null, task);
        res.status(200).send(response);
        return;


    } catch (error) {
        const response = buildResponse(
            false, 'Failed to create task', null, error instanceof Error ? error.message : 'Unknown error', null,
        );
        res.status(500).json(response);
    }

}