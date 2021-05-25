import { Request, Response } from 'express';
import SProject from './../models/project';
import { Project } from './../types/project';

const indexProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const projects: Project[] = await SProject.find();
        res.json({
            status: 'success',
            message: 'Projects retrieved successfully',
            data: projects,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
        return;
    }
};

const viewProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project: Project | null = await SProject.findById(req.params.project_id);
        res.json({
            status: 'success',
            message: 'Project retrieved successfully',
            data: project,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
        return;
    }
};

const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<
            Project,
            | 'name'
            | 'type'
            | 'email'
            | 'company'
            | 'address'
            | 'country'
            | 'remuneration'
            | 'dates'
            | 'informations'
        >;

        const project: Project = new SProject(body);
        project.status = 'created';
        const newProject: Project = await project.save();
        res.json({ message: 'New project created!', data: newProject });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            params: { project_id },
            body,
        } = req;
        const project: Project | null = await SProject.findByIdAndUpdate(
            { _id: project_id },
            body,
            {
                omitUndefined: true,
            },
        );
        res.json({ message: 'Project infos updated', data: project });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const destroyProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project: Project | null = await SProject.findByIdAndRemove(req.params.project_id);
        res.json({ message: 'Project deleted', data: project });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const setPhotographerToProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project: Project | null = await SProject.findByIdAndUpdate(
            { _id: req.params.project_id },
            { photographer: req.params.user_id, status: 'pending' },
        );
        // mailer.newProjectMail(user);
        // TODO Notifications
        res.json({ message: 'User added to project', data: project });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const validateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project: Project | null = await SProject.findById({ _id: req.params.project_id });
        if (project?.status === 'finished') {
            res.json({ status: 'error', message: 'Project was already closed' });
            return;
        }

        project!.pictures = req.body.url;
        project!.status = 'finished';
        //TODO Mail validation
        project!.save();
        res.json({ message: 'Project Info updated', data: project });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const acceptProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project: Project | null = await SProject.findById({ _id: req.params.project_id });
        if (req.body.action === 'accept') {
            project!.status = 'started';
            //TODO sent notifications to others photographers
            project!.photographer = req.body.photographer;
        } else {
            project!.status = 'created';
            project!.photographer = [];
        }

        //TODO Mail validation
        project!.save();
        res.json({ message: 'Project Info updated', data: project });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const indexProjectByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const projects: Project[] = await SProject.find({
            photographer: req.params.user_id,
        });
        res.json({
            status: 'success',
            message: 'Notifications retrieved successfully',
            data: projects,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
        return;
    }
};

export {
    indexProject,
    viewProject,
    createProject,
    updateProject,
    destroyProject,
    indexProjectByUser,
    validateProject,
    setPhotographerToProject,
    acceptProject,
};
