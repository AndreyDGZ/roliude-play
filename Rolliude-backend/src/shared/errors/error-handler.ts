import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from './app-error';
import { ErrorResponse } from './error-response.schema';

function mapValidationErrors(error: ZodError): NonNullable<ErrorResponse['errors']> {
  return error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message
  }));
}

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction): Response<ErrorResponse> {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Erro de validação nos campos fornecidos.',
      errors: mapValidationErrors(error)
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    });
  }

  return response.status(500).json({
    message: 'Ocorreu um erro interno no servidor.'
  });
}
