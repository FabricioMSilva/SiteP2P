/**
 * 🎯 Serviço PIX
 * ════════════════════════════════════════════════
 * Gerencia requisições para geração de QR Code PIX
 */

export interface PixPaymentData {
  qrCode: string;
  pixKey: string;
  brCode?: string;
  copyPaste: string;
  amount: number;
  description: string;
  expiresAt: string;
  txId: string;
  environment: 'production' | 'homolog';
}

export interface PixRequestPayload {
  amount: number;
  description?: string;
  expiresIn?: number;
  plan?: string;
}

/**
 * Gera QR Code PIX via API
 */
export async function generatePixQRCode(payload: PixRequestPayload): Promise<PixPaymentData> {
  try {
    console.log('📱 Gerando QR Code PIX...', payload);

    const response = await fetch('/api/pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao gerar QR Code PIX');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Erro ao gerar QR Code PIX');
    }

    console.log('✅ QR Code gerado com sucesso!', result.data);
    return result.data as PixPaymentData;
  } catch (error: any) {
    console.error('❌ Erro ao gerar QR Code PIX:', error.message);
    throw error;
  }
}

/**
 * Copia o código PIX para a área de transferência
 */
export async function copyPixToClipboard(pixKey: string): Promise<void> {
  try {
    // Método 1: Tentar com navigator.clipboard (moderno)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(pixKey);
      console.log('✅ Código PIX copiado para a área de transferência');
    } else {
      // Método 2: Usar execCommand (compatível)
      const copied = copyViaExecCommand(pixKey);
      if (!copied) {
        throw new Error('Falha ao copiar usando método alternativo');
      }
    }
  } catch (error) {
    console.error('❌ Erro ao copiar código PIX:', error);
    const copied = copyViaExecCommand(pixKey);
    if (!copied) {
      throw new Error('Não foi possível copiar o código PIX');
    }
  }
}

/**
 * Copia usando document.execCommand (fallback)
 */
function copyViaExecCommand(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      console.log('✅ Código PIX copiado para a área de transferência');
    }

    return successful;
  } catch (error) {
    console.error('❌ Erro ao copiar (fallback):', error);
    return false;
  }
}

/**
 * Calcula tempo restante até expiração
 */
export function getTimeRemaining(expiresAt: string): {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isExpired: boolean;
} {
  const now = new Date().getTime();
  const expireTime = new Date(expiresAt).getTime();
  const distance = expireTime - now;

  if (distance < 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
      isExpired: true,
    };
  }

  return {
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    total: distance,
    isExpired: false,
  };
}

/**
 * Formata valor em Real
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
