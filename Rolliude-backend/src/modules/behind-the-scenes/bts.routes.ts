import { Router } from 'express';
import { BtsController } from './bts.controller';

const bastidoresRoutes = Router();
const btsController = new BtsController();

bastidoresRoutes.get('/', btsController.list);
bastidoresRoutes.get('/:id', btsController.getById);
bastidoresRoutes.post('/', btsController.create);
bastidoresRoutes.patch('/:id', btsController.update);
bastidoresRoutes.delete('/:id', btsController.remove);

export { bastidoresRoutes };
