import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

// Middleware global: centraliza a traducao de erros em respostas
// HTTP. Nenhum Controller precisa mais decidir "esse erro e um
// 404 ou um 500?" - isso fica todo aqui, num unico lugar.
// Precisa dos 4 parametros (mesmo sem usar "next") para o Express
// reconhecer esta funcao como um error handler.
export function errorHandler(
  erro: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}
