"use client";

/**
 * Componente Header
 * Cabeçalho da landing page com o slogan principal
 * Cores: Roxo (#6A0DAD), Amarelo (#FFD700) e Branco (#FFFFFF)
 * Animações: Entrada profissional com stagger e efeitos mobile-first
 */

import { motion } from 'framer-motion';

export default function Header() {
  // Variantes de animação para entrada profissional
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const waveVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        delay: 1,
      },
    },
  };

  return (
    <header className="bg-purple-iptv text-white py-16 md:py-24 relative overflow-hidden">
      {/* Topo com logo da empresa */}
      <div className="absolute inset-x-0 top-0 z-20 bg-black/20 backdrop-blur-sm py-3">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <a href="#" className="inline-flex items-center gap-3">
            
            <span className="hidden sm:inline-block text-sm md:text-base font-semibold">
              FBR Consultoria Digital
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#inicio" className="hover:text-yellow-iptv">Início</a>
            <a href="#servicos" className="hover:text-yellow-iptv">Serviços</a>
            <a href="#contato" className="hover:text-yellow-iptv">Contato</a>
          </nav>
        </div>
      </div>

      {/* Efeito decorativo de onda no fundo */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-purple-iptv"
        variants={waveVariants}
        initial="hidden"
        animate="visible"
      ></motion.div>

      {/* Container do conteúdo */}
      <motion.div
        className="max-w-6xl mx-auto px-4 md:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Título principal com slogan */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-4"
          variants={itemVariants}
        >
          <img
            src="/logo-fbr.png"
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='48' viewBox='0 0 160 48'%3E%3Crect width='160' height='48' rx='8' fill='%236a0dad'/%3E%3Ctext x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%23fff'%3EFBR%20Consultoria%20Digital%3C/text%3E%3C/svg%3E";
            }}
            alt="FBR Consultoria Digital"
            className="h-full max-h-64 md:max-h-80 w-auto object-contain"
          />
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            variants={itemVariants}
          >
            <motion.span
              className="text-yellow-iptv"
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              Mais diversão,
            </motion.span>
            {' '}
            <motion.span
              className="text-white"
              variants={itemVariants}
            >
              menos gasto.
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Subtítulo descritivo */}
        <motion.p
          className="text-lg md:text-xl text-gray-100 mt-6 md:mt-8"
          variants={itemVariants}
        >
          Transforme sua TV em um centro de entretenimento digital
        </motion.p>
      </motion.div>

      {/* Decoração de onda CSS na parte inferior */}
      <motion.svg
        className="absolute bottom-0 left-0 right-0 w-full h-20"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ transform: 'translateY(50%)', fill: 'white' }}
        variants={waveVariants}
        initial="hidden"
        animate="visible"
      >
        <path d="M0,50 Q300,100 600,50 T1200,50 L1200,120 L0,120 Z"></path>
      </motion.svg>
    </header>
  );
}
