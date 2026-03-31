"use client";

import { motion } from 'framer-motion';

export default function ServiceExplanation() {
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
    <section className="py-20 md:py-32 bg-white relative overflow-hidden" id="servicos">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl -mr-48 -mb-48"></div>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div variants={itemVariants} className="inline-block mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-sm md:text-base font-bold uppercase tracking-wider">
              🎯 O Que Oferecemos
            </span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Seu Entretenimento Completo
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tudo o que você precisa em um único lugar com tecnologia de ponta
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: '🎬',
              title: 'Filmes em 4K',
              description: 'Biblioteca com milhares de filmes em alta definição. Sempre atualizado com lançamentos.',
              color: 'from-blue-500 to-cyan-500',
              delay: 0,
            },
            {
              icon: '📺',
              title: 'Séries + Documentários',
              description: 'Acompanhe suas séries favoritas e descubra novos documentários exclusivos.',
              color: 'from-purple-500 to-pink-500',
              delay: 0.1,
            },
            {
              icon: '⚽',
              title: 'Esportes Ao Vivo',
              description: 'Jogos, campeonatos e exclusividades de todos os principais eventos.',
              color: 'from-orange-500 to-red-500',
              delay: 0.2,
            },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all h-full">
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {service.icon}
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>

                <motion.div
                  className="mt-6 flex items-center text-gray-400 group-hover:text-gray-900 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <span className="mr-2">Saiba mais</span>
                  <span>→</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-white mb-16"
        >
          <h3 className="text-3xl font-bold mb-8 text-center">Como Começar em 3 Passos?</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1️⃣', title: 'Contate-nos', desc: 'Envie uma mensagem via WhatsApp' },
              { num: '2️⃣', title: 'Instalação', desc: 'Técnico faz a instalação gratuitamente' },
              { num: '3️⃣', title: 'Aproveite', desc: 'Acesse e divirta-se ilimitadamente' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-3">{step.num}</div>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Canais', value: '500+' },
            { label: 'Filmes', value: '2000+' },
            { label: 'Satisfação', value: '99%' },
            { label: 'Suporte', value: '24/7' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center border border-gray-100"
            >
              <motion.div
                className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stat.value}
              </motion.div>
              <p className="text-gray-600 font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
