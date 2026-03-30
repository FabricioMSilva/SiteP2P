/**
 * Tipos e Interfaces Compartilhadas
 * Localize aqui as definições de tipos reutilizáveis
 */

/**
 * Interface para dados de contato
 */
export interface ContactInfo {
  whatsapp: string;
  email: string;
  phone?: string;
  schedule?: string;
}

/**
 * Interface para serviço/funcionalidade
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

/**
 * Interface para item de benefício
 */
export interface Benefit {
  id: string;
  text: string;
  icon?: string;
}

/**
 * Constantes de cores da aplicação
 */
export const COLORS = {
  purple: '#6a0dad',
  yellow: '#ffd700',
  white: '#ffffff',
  black: '#000000',
} as const;

/**
 * Constantes de contato
 */
export const CONTACT = {
  whatsapp: '24998344324',
  whatsappUrl: 'https://wa.me/24998344324',
  email: 'contato@siteiptv.com',
  phone: '+55 24 99834-4324',
  schedule: '09:00 - 22:00',
} as const;

/**
 * Constantes de texto
 */
export const TEXTS = {
  slogan: 'Mais diversão, menos gasto',
  tagline: 'Transforme sua TV em um centro de entretenimento digital',
  description:
    'Assista filmes, séries e esportes em qualidade HD, direto no seu celular, computador ou TV — sem precisar de antena ou cabos.',
  cta: 'Fale agora no WhatsApp',
} as const;
