// middleware/validate.js
import { ZodError } from 'zod';

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Format Zod errors nicely
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({ 
        error: 'Validation error',
        details: formattedErrors
      });
    }
    
    next(error);
  }
};

export default validate;