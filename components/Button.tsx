/**
 * Button Component - Reutilizável
 * ────────────────────────────────────────────
 * Botão genérico com múltiplas variantes (primary, secondary, danger)
 * e tamanhos (sm, md, lg). Suporta loading state com ícone WhatsApp.
 * 
 * Props:
 * • variant?: "primary" | "secondary" | "danger"
 * • size?: "sm" | "md" | "lg"
 * • loading?: boolean
 * • icon?: ReactNode
 * • children: ReactNode
 * 
 * @example
 * <Button variant="primary" size="lg">Clique aqui</Button>
 */

import React from 'react';
import { classNames } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante de estilo do botão */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg';
  /** Se o botão está carregando */
  loading?: boolean;
  /** Ícone ao lado do texto (opcional) */
  icon?: React.ReactNode;
  /** Conteúdo do botão */
  children: React.ReactNode;
}

/**
 * Componente Button reutilizável
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">
 *   Clique aqui
 * </Button>
 * ```
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  // Estilos base
  const baseStyles = 'font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2';

  // Variantes
  const variants = {
    primary:
      'bg-yellow-iptv text-black hover:shadow-lg hover:scale-105 focus:ring-yellow-iptv',
    secondary:
      'bg-purple-iptv text-white hover:shadow-lg hover:scale-105 focus:ring-purple-iptv',
    danger:
      'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg focus:ring-red-600',
  };

  // Tamanhos
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const finalClassName = classNames(
    baseStyles,
    variants[variant],
    sizes[size],
    disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
    className
  );

  return (
    <button
      className={finalClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.52 3.48a11.83 11.83 0 00-16.7.01 11.78 11.78 0 00-3.44 8.38 11.7 11.7 0 001.9 6.11L2.1 22.1l4.2-1.1a11.7 11.7 0 006.15 1.9h.04a11.78 11.78 0 008.4-3.45 11.83 11.83 0 00.01-16.7zM12.03 19.72a9.74 9.74 0 01-5.16-1.45l-.37-.22-3.07.8.82-3.01-.24-.39A9.77 9.77 0 014.3 6.02a9.79 9.79 0 0113.85-.45 9.74 9.74 0 01.01 13.76 9.73 9.73 0 01-6.13 2.39zm5.2-7.2c-.26-.13-1.53-.75-1.77-.84-.24-.08-.42-.13-.6.13s-.69.84-.85 1.01c-.16.17-.32.2-.59.07-.26-.13-1.09-.4-2.08-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.27-.02-.41.11-.54.11-.1.26-.27.39-.41.13-.14.17-.24.26-.4.09-.16.05-.3-.03-.41-.08-.11-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46-.15-.01-.33-.01-.51-.01a.71.71 0 00-.52.24c-.18.16-.7.68-.7 1.66s.72 1.92.82 2.05c.1.13 1.42 2.17 3.45 3.04 2.03.88 2.03.59 2.39.55.36-.05 1.16-.47 1.33-.93.17-.47.17-.86.12-.94-.06-.08-.23-.13-.49-.26z" />
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
}
