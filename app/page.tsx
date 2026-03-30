/**
 * 🎬 Home Page - Landing IPTV
 * ────────────────────────────────────────────
 * Página principal com todas seções otimizadas
 * 
 * Sections:
 * 1. Header - Logo + Slogan principal
 * 2. CTA - Call-to-action WhatsApp
 * 3. ServiceExplanation - Cards de funcionalidades
 * 4. Footer - Info de contato e links
 * 
 * Performance: Sem SSR desnecessário, carregamento progressivo
 */

import Header from '@/components/Header';
import ServiceExplanation from '@/components/ServiceExplanation';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header com brand e slogan */}
      <Header />
      
      {/* Call-to-action principal com WhatsApp */}
      <CTA />
      
      {/* Explicação dos serviços com ícones e cards */}
      <ServiceExplanation />

      {/* Rodapé com contatos e navegação */}
      <Footer />
    </main>
  );
}