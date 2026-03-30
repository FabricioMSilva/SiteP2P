/**
 * Container/Wrapper Reutilizável
 * Componente base para seções com padding e max-width consistentes
 */

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  noPadding?: boolean;
}

export default function Container({
  children,
  className = '',
  maxWidth = 'lg',
  noPadding = false,
}: ContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-full',
  }[maxWidth];

  const paddingClass = noPadding ? '' : 'px-4 md:px-8';

  return (
    <div className={`mx-auto ${maxWidthClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Section Wrapper - Para seções da página
 */
export function Section({
  children,
  className = '',
  bgColor = 'bg-white',
}: {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}) {
  return (
    <section className={`py-16 md:py-24 ${bgColor} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/**
 * Badge - Etiqueta reutilizável
 */
export function Badge({
  children,
  variant = 'primary',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}) {
  const variants = {
    primary: 'bg-yellow-iptv text-black',
    secondary: 'bg-purple-iptv text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-orange-500 text-white',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

/**
 * Card - Componente de card reutilizável
 */
export function Card({
  children,
  className = '',
  hoverEffect = true,
}: {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) {
  const hoverClass = hoverEffect
    ? 'hover:shadow-xl transition-shadow duration-300'
    : '';

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 md:p-8 ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * TextHighlight - Destaca texto
 */
export function TextHighlight({
  children,
  color = 'text-yellow-iptv',
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return <span className={`font-bold ${color}`}>{children}</span>;
}

/**
 * Grid Layout - Grid responsivo
 */
export function Grid({
  children,
  cols = 3,
  gap = 8,
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: number;
}) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols];

  const gapClass = `gap-${gap}`;

  return <div className={`grid ${colsClass} ${gapClass}`}>{children}</div>;
}
