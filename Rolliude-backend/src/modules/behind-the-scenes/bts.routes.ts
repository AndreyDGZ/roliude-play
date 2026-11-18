import { Router } from 'express';
import { adminOnly } from '../../shared/auth/auth.middleware';
import { BtsController } from './bts.controller';

const bastidoresRoutes = Router();
const btsController = new BtsController();

bastidoresRoutes.get('/', btsController.list);
bastidoresRoutes.get('/:id', btsController.getById);
bastidoresRoutes.post('/', ...adminOnly, btsController.create);
bastidoresRoutes.patch('/:id', ...adminOnly, btsController.update);
bastidoresRoutes.delete('/:id', ...adminOnly, btsController.remove);

export { bastidoresRoutes };
