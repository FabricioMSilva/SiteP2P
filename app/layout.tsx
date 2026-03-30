import type { Metadata } from 'next';
import './globals.css';

/**
 * Metadados para SEO e head da página
 * Keywords para melhor indexação em buscadores
 */
export const metadata: Metadata = {
  title: 'IPTV Player - Mais Diversão, Menos Gasto | Serviço FBR',
  description:
    'Streaming de filmes, séries e esportes em HD. Assista sem antena ou cabos. Teste grátis por 6 horas com a FBR Consultoria Digital.',
  keywords: 'IPTV, streaming, filmes, séries, esportes, HD, sem antena, sem cabos, entretenimento digital',
  openGraph: {
    title: 'IPTV Player - Mais Diversão, Menos Gasto',
    description:
      'Streaming de qualidade com catálogo atualizado. Começe seu teste grátis agora!',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Meta tags essenciais para página responsiva */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6a0dad" />
        
        {/* Preconnect para melhor performance de recursos externos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
