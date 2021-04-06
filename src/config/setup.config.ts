import SRole from '../models/role';

const createMissingRoles = async () => {
    const count = await SRole.estimatedDocumentCount();
    if (count === 0) {
        try {
            new SRole({ name: 'user' }).save();
            new SRole({ name: 'admin' }).save();
        } catch (error) {
            console.log(error);
        }
    }
};

export { createMissingRoles };
