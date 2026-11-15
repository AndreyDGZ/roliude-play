import { Router } from 'express';
import { ProfessionalController } from './professional.controller';

const professionalRoutes = Router();
const professionalController = new ProfessionalController();

professionalRoutes.get('/', professionalController.list);
professionalRoutes.get('/:id', professionalController.getById);
professionalRoutes.post('/', professionalController.create);
professionalRoutes.patch('/:id', professionalController.update);
professionalRoutes.delete('/:id', professionalController.remove);

export { professionalRoutes };
