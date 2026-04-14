"use client";

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function CTA() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden" id="servicos">
      {/* Decoração de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl -ml-32 -mb-32"></div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Seção: Por que escolher? */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div variants={itemVariants} className="inline-block mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-sm md:text-base font-bold uppercase tracking-wider">
              🎯 Por que nos escolher?
            </span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            O Melhor Serviço de Streaming
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
            Milhares de clientes satisfeitos em todo Brasil confiam em nossa qualidade e suporte
          </motion.p>
        </div>

        {/* Grid de benefícios */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {[
            {
              icon: '⚡',
              title: 'Teste Gratis por 6Hrs',
              description: 'Comece a assistir em minutos. Rastreamento em tempo real do técnico.',
            },
            {
              icon: '🎬',
              title: '2000+ Canais',
              description: 'Todos os principais canais, filmes, séries, documentários e esportes.',
            },
            {
              icon: '🛡️',
              title: 'Suporte 24/7',
              description: 'Tim técnico sempre pronto para ajudar via WhatsApp e telefone.',
            },
            {
              icon: '✨',
              title: 'Qualidade 4K',
              description: 'Streaming em alta definição sem travamentos ou buferização.',
            },
            {
              icon: '💰',
              title: 'Melhor Preço R$30',
              description: 'Os menores preços do mercado com a melhor qualidade garantida.',
            },
            {
              icon: '📱',
              title: 'Multiplataforma',
              description: 'Assista em TV, celular, tablet e computador simultaneamente.',
            },
          ].map((benefit, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Principal - WhatsApp */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 p-1"
        >
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 md:p-16 text-center text-white">
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            <div className="relative z-10">
              <motion.div
                className="text-6xl md:text-7xl font-black mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💬
              </motion.div>

              <h3 className="text-4xl md:text-5xl font-black mb-4">
                Pronto para Começar?
              </h3>

              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Fale com um dos nossos consultores agora mesmo via WhatsApp e receba uma proposta personalizada com seu melhor preço!
              </p>

              <motion.a
                href="https://wa.me/5524993341547?text=Ola%20desejo%20fazer%20teste"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 bg-white text-green-600 px-10 py-5 rounded-full font-bold text-lg md:text-xl hover:shadow-2xl transition-all hover:bg-gray-50"
              >
                <MessageCircle size={22} />
                Entre em Contato no WhatsApp
                <span>→</span>
              </motion.a>

              <p className="text-white/70 text-sm mt-6">
                Resposta em menos de 1 minuto • Sem compromisso
              </p>
            </div>
          </div>
        </motion.div>

        {/* Testimonial Section */}
        <motion.div variants={itemVariants} className="mt-16 md:mt-20 text-center">
          <p className="text-gray-600 mb-6">Confiam em nosso serviço:</p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
            <div className="text-2xl font-bold text-gray-900">⭐ 4.9/5 Avaliação</div>
            <div className="text-2xl font-bold text-gray-900">👥 50K+ Clientes</div>
            <div className="text-2xl font-bold text-gray-900">🚀 15+ Anos</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

