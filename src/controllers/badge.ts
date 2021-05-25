import { Request, Response } from 'express';
import SBadge from './../models/badge';
import { Badge } from './../types/badge';

const indexBadge = async (req: Request, res: Response): Promise<void> => {
    try {
        const badges: Badge[] = await SBadge.find();
        res.json({ status: 'success', message: 'Badges retrieved successfully', data: badges });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
        return;
    }
};

const viewBadge = async (req: Request, res: Response): Promise<void> => {
    try {
        const badge: Badge | null = await SBadge.findById(req.params.badge_id);
        res.json({ status: 'success', message: 'Badge retrieved successfully', data: badge });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
        return;
    }
};

const createBadge = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<Badge, 'name' | 'description' | 'type'>;

        const badge: Badge = new SBadge(body);

        const newBadge: Badge = await badge.save();
        res.json({ message: 'New badge created!', data: newBadge });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const updateBadge = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            params: { badge_id },
            body,
        } = req;
        const badge: Badge | null = await SBadge.findByIdAndUpdate({ _id: badge_id }, body, {
            omitUndefined: true,
        });
        res.json({ message: 'Badge infos updated', data: badge });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const destroyBadge = async (req: Request, res: Response): Promise<void> => {
    try {
        const badge: Badge | null = await SBadge.findByIdAndUpdate(req.params.badge_id);
        res.json({ message: 'Badge deleted', data: badge });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

export { indexBadge, viewBadge, createBadge, updateBadge, destroyBadge };
