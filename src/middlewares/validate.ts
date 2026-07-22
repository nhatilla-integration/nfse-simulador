import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// Middleware generico: recebe qualquer schema Zod e valida o corpo
// da requisicao antes dela chegar ao Controller. Assim, nenhum
// Controller precisa repetir "if (!campo) return res.status(400)...".
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const detalhes = resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      }));
      return res.status(400).json({ erro: 'Dados invalidos', detalhes });
    }

    req.body = resultado.data;
    next();
  };
}
