/**
 * AppError - Erro padronizado para a aplicação
 * 
 * Usado nos Services para erros de negócio.
 * O handler global reconhece statusCode e envia a resposta adequada.
 */

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}
