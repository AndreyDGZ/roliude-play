import { Router } from 'express';
import { LocationController } from './location.controller';

const locationRoutes = Router();
const locationController = new LocationController();

locationRoutes.get('/states', locationController.listStates);
locationRoutes.get('/states/:uf/municipalities', locationController.listMunicipalities);

export { locationRoutes };
