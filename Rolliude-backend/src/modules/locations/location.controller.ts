import { NextFunction, Request, Response } from 'express';
import { listStatesQuerySchema, stateParamsSchema } from './location.schema';
import { LocationService } from './location.service';

export class LocationController {
  private readonly locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  listStates = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const query = listStatesQuerySchema.parse(request.query);

      return response.json({ data: await this.locationService.listStates(query) });
    } catch (error) {
      return next(error);
    }
  };

  listMunicipalities = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { uf } = stateParamsSchema.parse(request.params);

      return response.json({ data: await this.locationService.listMunicipalities(uf) });
    } catch (error) {
      return next(error);
    }
  };
}
