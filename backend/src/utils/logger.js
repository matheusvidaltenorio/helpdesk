/**
 * Logger simples - centraliza saída de logs
 * 
 * Em produção, pode ser integrado com Sentry, Datadog, etc.
 */

function formatarData() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

export function info(msg) {
  console.log(`[${formatarData()}] INFO: ${msg}`);
}

export function error(msg, err) {
  console.error(`[${formatarData()}] ERROR: ${msg}`);
  if (err?.stack) {
    console.error(err.stack);
  }
}

export function warn(msg) {
  console.warn(`[${formatarData()}] WARN: ${msg}`);
}

export default { info, error, warn };
