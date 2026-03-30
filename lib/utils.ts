/**
 * Funções Utilitárias
 * Funções helper reutilizáveis em toda a aplicação
 */

/**
 * Formata um número de telefone para o padrão brasileiro
 * @param phone - Número sem formatação (Ex: "24998344324")
 * @returns Número formatado (Ex: "(24) 99834-4324")
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

/**
 * Gera URL do WhatsApp com número e mensagem
 * @param number - Número de telefone (com código de país)
 * @param message - Mensagem inicial (opcional)
 * @returns URL completa do WhatsApp
 */
export function generateWhatsAppUrl(
  number: string,
  message?: string
): string {
  const baseUrl = 'https://wa.me';
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `${baseUrl}/${number}${encodedMessage}`;
}

/**
 * Valida se um email é válido
 * @param email - Email a validar
 * @returns true se válido, false caso contrário
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se um número de telefone é válido (padrão brasileiro)
 * @param phone - Número de telefone
 * @returns true se válido, false caso contrário
 */
export function isValidBrazilianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned.startsWith('55');
}

/**
 * Combina classes CSS condicionalmente
 * Útil para Tailwind CSS com condições
 * @param classes - Classes a combinar
 * @returns String de classes combinadas
 */
export function classNames(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Delay/Sleep assíncrono em ms
 * @param ms - Milissegundos
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Copia texto para clipboard
 * @param text - Texto a copiar
 * @returns Promise que resolve quando copiado
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Erro ao copiar para clipboard:', err);
  }
}

/**
 * Scroll suave para elemento
 * @param elementId - ID do elemento
 */
export function smoothScroll(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Retorna data formatada em português
 * @param date - Data a formatar
 * @returns String com data formatada
 */
export function formatDatePT(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
