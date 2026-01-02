import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";

/**
 * Validation middleware factory
 * Creates a middleware that validates request body against a DTO class
 */
export const validateDto = <T extends object>(dtoClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ensure req.body exists
      if (!req.body || Object.keys(req.body).length === 0) {
        req.body = {};
      }

      const dto = plainToInstance(dtoClass, req.body, {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
      });

      const errors: ValidationError[] = await validate(dto as object, {
        whitelist: true,
        forbidNonWhitelisted: false,
      });

      if (errors.length > 0) {
        const formattedErrors = errors.map((err) => ({
          property: err.property,
          constraints: err.constraints || {},
          value: err.value,
        }));

        return res.status(400).json({
          statusCode: 400,
          message: "Validation failed",
          errors: formattedErrors,
        });
      }

      // Replace req.body with validated and transformed DTO
      req.body = dto;
      next();
    } catch (error) {
      console.error("Validation middleware error:", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Validation error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};

/**
 * Query validation middleware
 * Validates query parameters against a DTO class
 */
export const validateQuery = <T extends object>(dtoClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParams = req.query || {};

      const dto = plainToInstance(dtoClass, queryParams, {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
      });

      const errors: ValidationError[] = await validate(dto as object, {
        whitelist: true,
        forbidNonWhitelisted: false,
      });

      if (errors.length > 0) {
        const formattedErrors = errors.map((err) => ({
          property: err.property,
          constraints: err.constraints || {},
          value: err.value,
        }));

        return res.status(400).json({
          statusCode: 400,
          message: "Query validation failed",
          errors: formattedErrors,
        });
      }

      // Store validated query in custom property instead of trying to modify read-only req.query
      (req as any).validatedQuery = dto;
      next();
    } catch (error) {
      console.error("Query validation middleware error:", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Query validation error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};
