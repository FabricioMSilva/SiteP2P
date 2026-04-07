/**
 * 🔐 Webhook Utilities - Validação de Assinatura
 * ════════════════════════════════════════════════════
 * Valida integridade e autenticidade do webhook
 */

import crypto from 'crypto';

/**
 * Valida assinatura do webhook usando certificado ou chave secreta
 * Banco EFI envia assinatura no header: X-Webhook-Signature
 */
export function validateWebhookSignature(
  body: string,
  signature: string,
  clientSecret: string
): boolean {
  try {
    // Método 1: SHA256 HMAC (mais comum)
    const calculatedSignature = crypto
      .createHmac('sha256', clientSecret)
      .update(body)
      .digest('base64');

    // Comparação segura contra timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );

    return isValid;
  } catch (error) {
    console.error('❌ Erro ao validar assinatura:', error);
    return false;
  }
}

/**
 * Alterna entre diferentes métodos de validação
 */
export function validateWebhook(
  body: string,
  signature: string | null | undefined,
  clientSecret: string,
  method: 'hmac' | 'jwt' | 'basic' = 'hmac'
): { valid: boolean; reason?: string } {
  if (!signature) {
    return { valid: false, reason: 'Signature header missing' };
  }

  if (!clientSecret) {
    return { valid: false, reason: 'Client secret not configured' };
  }

  switch (method) {
    case 'hmac':
      return {
        valid: validateWebhookSignature(body, signature, clientSecret),
        reason: !validateWebhookSignature(body, signature, clientSecret) ? 'Invalid signature' : undefined,
      };

    case 'jwt':
      return validateJWTSignature(body, signature, clientSecret);

    case 'basic':
      return validateBasicAuth(signature, clientSecret);

    default:
      return { valid: false, reason: 'Unknown validation method' };
  }
}

/**
 * Valida JWT assinado
 */
function validateJWTSignature(
  _body: string,
  token: string,
  secret: string
): { valid: boolean; reason?: string } {
  try {
    // Implementação básica de JWT
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, reason: 'Invalid JWT format' };
    }

    const [header, payload, signature] = parts;
    const message = `${header}.${payload}`;

    const calculatedSignature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('base64');

    // Comparar assinaturas
    const valid = signature === calculatedSignature.replace(/=/g, '');
    return {
      valid,
      reason: !valid ? 'Invalid JWT signature' : undefined,
    };
  } catch (error) {
    return { valid: false, reason: `JWT validation error: ${error}` };
  }
}

/**
 * Valida autenticação básica
 */
function validateBasicAuth(
  authHeader: string,
  secret: string
): { valid: boolean; reason?: string } {
  try {
    if (!authHeader.startsWith('Bearer ')) {
      return { valid: false, reason: 'Invalid bearer token format' };
    }

    const token = authHeader.substring(7);
    const hash = crypto.createHash('sha256').update(secret).digest('hex');

    const valid = token === hash;
    return {
      valid,
      reason: !valid ? 'Invalid token' : undefined,
    };
  } catch (error) {
    return { valid: false, reason: `Auth validation error: ${error}` };
  }
}

/**
 * Tipos de payload que o Banco EFI pode enviar
 */
export interface WebhookPayload {
  id: string;
  txid: string;
  docDevedora: string;
  horario: string;
  valor: number;
  chave?: string;
  infoPagador?: {
    cpf?: string;
    nome?: string;
    email?: string;
    telefone?: string;
  };
  status?: string; // Pode vir ou não dependendo da versão
  [key: string]: any;
}

/**
 * Processa payload do webhook
 */
export function processWebhookPayload(body: any): {
  valid: boolean;
  data?: WebhookPayload;
  error?: string;
} {
  try {
    // Parse se for string
    const payload = typeof body === 'string' ? JSON.parse(body) : body;

    // Validar campos obrigatórios (ver documentação EFI)
    if (!payload.txid && !payload.id) {
      return { valid: false, error: 'Missing transaction ID' };
    }

    if (typeof payload.valor !== 'number' || payload.valor <= 0) {
      return { valid: false, error: 'Invalid amount' };
    }

    // Normalizar payload
    const normalizedPayload: WebhookPayload = {
      id: payload.id || payload.txid,
      txid: payload.txid || payload.id,
      docDevedora: payload.docDevedora,
      horario: payload.horario || new Date().toISOString(),
      valor: payload.valor,
      chave: payload.chave,
      infoPagador: payload.infoPagador || {},
      status: payload.status || 'confirmado',
    };

    return { valid: true, data: normalizedPayload };
  } catch (error) {
    return { valid: false, error: `Parse error: ${error}` };
  }
}

/**
 * Gera assinatura para resposta do webhook
 */
export function generateWebhookResponse(
  txId: string,
  status: 'received' | 'accepted' | 'rejected',
  clientSecret: string
): { signature: string; timestamp: string } {
  const timestamp = new Date().toISOString();
  const message = `${txId}${status}${timestamp}`;

  const signature = crypto
    .createHmac('sha256', clientSecret)
    .update(message)
    .digest('base64');

  return { signature, timestamp };
}

/**
 * Testa validação (útil para debugging)
 */
export function testWebhookValidation() {
  const secret = 'test_secret_12345';
  const testBody = JSON.stringify({
    txid: 'test123',
    valor: 35.0,
    docDevedora: '12345678900',
  });

  const signature = crypto.createHmac('sha256', secret).update(testBody).digest('base64');

  console.log('🧪 Teste de Validação de Webhook:');
  console.log(`Secret: ${secret}`);
  console.log(`Body: ${testBody}`);
  console.log(`Signature: ${signature}`);

  const result = validateWebhook(testBody, signature, secret, 'hmac');
  console.log(`✅ Validação: ${result.valid ? 'PASSOU' : 'FALHOU'}`);
  if (result.reason) console.log(`Razão: ${result.reason}`);

  return result;
}
