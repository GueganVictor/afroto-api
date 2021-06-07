import { Request as ExpressRequest, Response } from 'express';
import SUser from '../models/user';
import SRequest from './../models/request';
import { Request } from './../types/request';

const indexRequest = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const requests: Request[] = await SRequest.find()
            .populate({
                path: "photographer",
                select: { name: 1 }
            }).populate({
                path: "badges",
                select: { name: 1 }
            });
        res.json({
            status: 'success',
            message: 'Requests retrieved successfully',
            data: requests,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
        return;
    }
};

const viewRequest = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const request: Request | null = await SRequest.findById(req.params.request_id);
        res.json({
            status: 'success',
            message: 'Request retrieved successfully',
            data: request,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
        return;
    }
};

const createRequest = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<
            Request,
            'state' | 'badges' | 'photographer' | 'url' | 'description' | 'type'
        >;
        const photographer = await SUser.findById(req.body.photographer);
        photographer!.hasRequestedChange = true;
        photographer?.save();
        const request: Request = new SRequest(body);
        request.state = 'pending';
        const newRequest: Request = await request.save();
        res.json({ message: 'New request created!', data: newRequest });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const updateRequest = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const {
            params: { id },
            body,
        } = req;
        const request: Request | null = await SRequest.findByIdAndUpdate({ _id: id }, body, {
            omitUndefined: true,
        });
        res.json({ message: 'Request infos updated', data: request });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const destroyRequest = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const request: Request | null = await SRequest.findByIdAndUpdate(req.params.request_id);
        res.json({ message: 'Request deleted', data: request });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

const setRequestState = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
        const request: Request | null = await SRequest.findByIdAndUpdate(
            { _id: req.params.request_id },
            { state: req.params.state },
        );
        res.json({ message: 'User added to request', data: request });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error });
    }
};

export { indexRequest, viewRequest, createRequest, updateRequest, destroyRequest, setRequestState };

