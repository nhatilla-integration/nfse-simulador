// Erro de aplicacao: qualquer erro de negocio que precise virar uma
// resposta HTTP especifica (404, 400, etc.) deve estender esta classe.
// Assim, o middleware global de erros nao precisa conhecer cada tipo
// de erro individualmente - ele so le o "status" que a propria
// classe ja carrega.
export class AppError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso nao encontrado') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requisicao invalida') {
    super(message, 400);
  }
}
