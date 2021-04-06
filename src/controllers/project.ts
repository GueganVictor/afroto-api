import { Response, Request } from 'express';
import { Project } from './../types/project';
import SProject from './../models/project';

const indexProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const projects: Project[] = await SProject.find();
        res.json({
            status: 'success',
            message: 'Projects retrieved successfully',
            data: projects,
        });
    } catch (error) {
        res.json({ status: 'error', message: error });
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
        res.json({ status: 'error', message: error });
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
            | 'comments'
            | 'informations'
            | 'pictures'
        >;

        const project: Project = new SProject(body);

        const newProject: Project = await project.save();
        res.json({ message: 'New project created!', data: newProject });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            params: { id },
            body,
        } = req;
        const project: Project | null = await SProject.findByIdAndUpdate({ _id: id }, body, {
            omitUndefined: true,
        });
        res.json({ message: 'Project infos updated', data: project });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const destroyProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project: Project | null = await SProject.findByIdAndUpdate(req.params.project_id);
        res.json({ message: 'Project deleted', data: project });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const setPhotographerToProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project: Project | null = await SProject.findByIdAndUpdate(
            { _id: req.params.project_id },
            { photographer: req.params.user_id },
        );
        // mailer.newProjectMail(user);
        res.json({ message: 'User added to project', data: project });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const validateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const project: Project | null = await SProject.findById({ _id: req.params.project_id });
        if (project?.status === 'Fini') {
            res.json({ status: 'error', message: 'Project was already closed' });
            return;
        }

        project!.pictures = req.body.url;
        project!.status = 'Fini';
        //TODO Mail validation
        project!.save();
        res.json({ message: 'Project Info updated', data: project });
    } catch (error) {
        res.json({ status: 'error', message: error });
    }
};

const indexProjectByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const project: Project[] = await SProject.find({
            user: req.params.user_id,
        });
        res.json({
            status: 'success',
            message: 'Notifications retrieved successfully',
            data: project,
        });
    } catch (error) {
        res.json({ status: 'error', message: error });
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
};
