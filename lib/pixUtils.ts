/**
 * 📚 Biblioteca para gerar QR Code PIX
 * ────────────────────────────────────────────
 * Utilitários para criar QR Code em base64
 * usando a biblioteca qrcode
 */

// ⚠️ IMPORTANTE: Instale a biblioteca com:
// npm install qrcode

import QRCode from 'qrcode';

interface GenerateQrCodeOptions {
  pixKey: string;
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Gera QR Code PIX em formato base64
 * @param options - Opções para geração do QR Code
 * @returns URL base64 do QR Code
 */
export async function generatePixQrCode(
  options: GenerateQrCodeOptions
): Promise<string> {
  try {
    const {
      pixKey,
      width = 300,
      margin = 2,
      errorCorrectionLevel = 'H',
    } = options;

    const qrCodeDataUrl = await QRCode.toDataURL(pixKey, {
      width,
      margin,
      errorCorrectionLevel,
      type: 'image/png',
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw new Error('Falha ao gerar QR Code PIX');
  }
}

/**
 * Gera Chave PIX (simulado para desenvolvimento)
 * Em produção, use a API real do Banco EFI
 * @param _amount - Valor do pagamento (não utilizado no simulado)
 * @returns Chave PIX formatada
 */
export function generatePixKey(_amount: number): string {
  // Esta é uma estrutura simulada de uma chave PIX
  // A chave real deve vir da API do Banco EFI
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${timestamp}${random}`.substring(0, 32);
}

/**
 * Formata valor em BRL para PIX
 * @param amount - Valor numérico
 * @returns Valor formatado como string
 */
export function formatPixAmount(amount: number): string {
  return amount.toFixed(2).replace('.', ',');
}
