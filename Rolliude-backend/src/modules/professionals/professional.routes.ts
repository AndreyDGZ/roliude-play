import { Router } from 'express';
import { adminOnly } from '../../shared/auth/auth.middleware';
import { ProfessionalController } from './professional.controller';

const professionalRoutes = Router();
const professionalController = new ProfessionalController();

professionalRoutes.get('/', professionalController.list);
professionalRoutes.get('/:id', professionalController.getById);
professionalRoutes.post('/', ...adminOnly, professionalController.create);
professionalRoutes.patch('/:id', ...adminOnly, professionalController.update);
professionalRoutes.delete('/:id', ...adminOnly, professionalController.remove);

export { professionalRoutes };
