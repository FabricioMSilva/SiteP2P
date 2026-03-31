"use client";

import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <header className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Fundo com padrão de malha */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.05) 2px, rgba(255,255,255,.05) 4px)',
        }}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-40 border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center font-bold text-lg text-black">
              FBR
            </div>
            <span className="hidden sm:block font-bold text-lg">FBR Digital</span>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            
            <motion.a
              href="https://wa.me/5524998344324?text=Ola%20desejo%20fazer%20teste"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <i className="bi bi-whatsapp"></i>
              WhatsApp
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              {['Início', 'Serviços', 'Contato'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm font-medium hover:text-yellow-400">
                  {item}
                </a>
              ))}
              <a
                href="https://wa.me/5524998344324?text=Ola%20desejo%20fazer%20teste"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold text-center flex items-center justify-center gap-2"
              >
                <i className="bi bi-whatsapp"></i>
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col lg:flex-row items-center justify-between gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Esquerda - Texto */}
        <motion.div className="flex-1 space-y-6" variants={itemVariants}>
          <motion.div className="inline-block" variants={itemVariants}>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-sm md:text-base font-bold uppercase tracking-wider">
              ✨ Solução Completa de Entretenimento
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-black leading-tight"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              +Canais +Filmes +Series
            </span>
            <br />
            <span className="text-white">Menos Preço</span>
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg" variants={itemVariants}>
            Acesso ilimitado aos melhores canais, filmes, séries e documentários. Qualidade HD, suporte 24/7 e instalação gratuita.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" variants={itemVariants}>
            <motion.a
              href="https://wa.me/5524998344324?text=Ola%20desejo%20fazer%20teste"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg inline-flex items-center justify-center gap-2 transition-all"
            >
              <i className="bi bi-whatsapp"></i>
              Entrar em Contato
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-yellow-400 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all"
            >
              Saiba Mais
            </motion.button>
          </motion.div>

          {/* Benefícios rápidos */}
          <motion.div className="flex flex-wrap gap-4 pt-8" variants={itemVariants}>
            {['✓ Instalação Grátis', '✓ Suporte 24/7', '✓ Sem Contrato', '✓ TV Premium'].map((benefit) => (
              <div key={benefit} className="text-sm text-gray-300 flex items-center gap-2">
                <span className="text-green-400">{benefit.split(' ')[0]}</span> {benefit.split(' ').slice(1).join(' ')}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Direita - Visual */}
        <motion.div
          className="flex-1 relative"
          variants={itemVariants}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="relative w-full aspect-auto max-w-lg">
            {/* Glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-3xl"></div>

            {/* Card with gradient */}
            <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-white/20 p-8 flex flex-col justify-between">
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>

              <div className="relative z-10 space-y-6">
                <div className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-500 bg-clip-text text-transparent">
                    Roda em TVSmart, Celular e PC.
                  </span>
                  <p className="text-xl text-gray-300 mt-2">Tudo que você precisa em um só lugar</p>
                </div>

                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span>Mais de 2000 mil  canais e 30000 Filmes e Series</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span>Sem Travamentos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span>Sistema P2P e IPTV</span>
                  </div><div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-sm font-semibold text-yellow-400 mb-3">💰 Planos de Assinatura:</p>
                  <div className="space-y-2">
                    {[
                      { dias: '15 dias', preco: 'R$ 20', Economia: 0 },
                      { dias: '30 dias', preco: 'R$ 35', Economia: 0  },
                      { dias: '60 dias', preco: 'R$ 60', Economia: 'R$ 10' },
                      { dias: '180 dias', preco: 'R$ 150', Economia: 'R$ 60' },
                      { dias: '360 dias', preco: 'R$ 250', Economia: 'R$ 170' },
                    ].map((plano, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm bg-white/5 backdrop-blur-sm p-2 rounded border border-white/10 hover:border-yellow-400/50 transition-all">
                        <span className="text-gray-300">{plano.dias}</span>
                        <span className="text-yellow-400 font-bold">{plano.preco}</span>
                      </div>
                    ))}
                  </div>
                </div>
                </div>

                {/* Tabela de preços */}
                
              </div>

              
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      
    </header>
  );
}
