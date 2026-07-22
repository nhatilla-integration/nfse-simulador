import { Request, Response, NextFunction, RequestHandler } from 'express';

// Express nao captura automaticamente erros lancados dentro de
// funcoes async. Sem isso, uma Promise rejeitada dentro de um
// Controller "morre" silenciosamente e a requisicao trava.
// Esse wrapper garante que qualquer erro assincrono seja
// encaminhado pro middleware global (via next(erro)).
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
