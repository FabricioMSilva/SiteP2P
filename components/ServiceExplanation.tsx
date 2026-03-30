"use client";

/**
 * Componente ServiceExplanation
 * Seção que explica como funciona o serviço
 * Inclui descrição e ícones (filmes, séries, esportes)
 * Animações: Entrada profissional com stagger e efeitos mobile-first
 */

import { motion } from 'framer-motion';

/* Componente SVG para ícone de Filme */
function MovieIcon() {
  return (
    <motion.svg
      className="w-16 h-16 mx-auto mb-4 text-purple-iptv"
      fill="currentColor"
      viewBox="0 0 24 24"
      whileHover={{
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <path d="M18 3H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H6V5h12v14zM9 7h6v2H9V7zm0 4h6v2H9v-2zm0 4h6v2H9v-2z" />
    </motion.svg>
  );
}

/* Componente SVG para ícone de Série */
function SeriesIcon() {
  return (
    <motion.svg
      className="w-16 h-16 mx-auto mb-4 text-purple-iptv"
      fill="currentColor"
      viewBox="0 0 24 24"
      whileHover={{
        scale: 1.1,
        rotate: -5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-5-7l-3-2v6l3-4z" />
    </motion.svg>
  );
}

/* Componente SVG para ícone de Esporte */
function SportsIcon() {
  return (
    <motion.svg
      className="w-16 h-16 mx-auto mb-4 text-purple-iptv"
      fill="currentColor"
      viewBox="0 0 24 24"
      whileHover={{
        scale: 1.1,
        rotate: 360,
        transition: { duration: 0.6 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="white"
      />
    </motion.svg>
  );
}

export default function ServiceExplanation() {
  // Variantes de animação para entrada profissional
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  // Variante otimizada para melhor performance
  const benefitVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <motion.div
        className="max-w-6xl mx-auto px-4 md:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Título da seção */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-purple-iptv mb-4"
          variants={titleVariants}
        >
          Como Funciona
        </motion.h2>

        {/* Descrição do serviço */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-12"
          variants={cardVariants}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className="text-lg md:text-xl text-gray-700 leading-relaxed text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Assista{' '}
            <motion.span
              className="font-bold text-purple-iptv"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              filmes, séries e esportes
            </motion.span>{' '}
            em qualidade <motion.span
              className="font-bold"
              whileHover={{
                color: "#FFD700",
                scale: 1.05
              }}
              transition={{ duration: 0.2 }}
            >
              HD
            </motion.span>, direto no seu
            celular, computador ou TV —{' '}
            <motion.span
              className="italic text-purple-iptv"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              sem precisar de antena ou cabos
            </motion.span>
            .
          </motion.p>
        </motion.div>

        {/* Grid de funcionalidades/ícones */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Card: Filmes */}
          <motion.div
            className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={cardVariants}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-yellow-iptv rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <MovieIcon />
            </motion.div>
            <motion.h3
              className="text-xl font-bold text-purple-iptv mb-2"
              whileHover={{ scale: 1.05 }}
            >
              Filmes
            </motion.h3>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Catálogo atualizado com os melhores filmes em alta qualidade
            </motion.p>
          </motion.div>

          {/* Card: Séries */}
          <motion.div
            className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={cardVariants}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-yellow-iptv rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4"
              whileHover={{ rotate: -360 }}
              transition={{ duration: 0.6 }}
            >
              <SeriesIcon />
            </motion.div>
            <motion.h3
              className="text-xl font-bold text-purple-iptv mb-2"
              whileHover={{ scale: 1.05 }}
            >
              Séries
            </motion.h3>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Acompanhe suas séries favoritas quando quiser
            </motion.p>
          </motion.div>

          {/* Card: Esportes */}
          <motion.div
            className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
            variants={cardVariants}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-yellow-iptv rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.2, rotate: 180 }}
              transition={{ duration: 0.6 }}
            >
              <SportsIcon />
            </motion.div>
            <motion.h3
              className="text-xl font-bold text-purple-iptv mb-2"
              whileHover={{ scale: 1.05 }}
            >
              Esportes
            </motion.h3>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Transmissões ao vivo dos principais eventos esportivos
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Benefícios adicionais */}
        <motion.div
          className="mt-12 bg-purple-iptv text-white rounded-lg p-8 md:p-12"
          variants={cardVariants}
          whileHover={{
            scale: 1.01,
            boxShadow: "0 25px 50px rgba(106, 13, 173, 0.3)",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.h3
            className="text-2xl font-bold mb-6 text-center"
            variants={titleVariants}
          >
            Por Que Escolher Nossa Plataforma?
          </motion.h3>
          <motion.ul
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.li
              className="flex items-start"
              variants={benefitVariants}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="text-yellow-iptv font-bold mr-3"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                ✓
              </motion.span>
              <span>Streaming em qualidade HD sem buffering</span>
            </motion.li>
            <motion.li
              className="flex items-start"
              variants={benefitVariants}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="text-yellow-iptv font-bold mr-3"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                ✓
              </motion.span>
              <span>Compatível com todos os dispositivos</span>
            </motion.li>
            <motion.li
              className="flex items-start"
              variants={benefitVariants}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="text-yellow-iptv font-bold mr-3"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                ✓
              </motion.span>
              <span>Acesso imediato após contato</span>
            </motion.li>
            <motion.li
              className="flex items-start"
              variants={benefitVariants}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="text-yellow-iptv font-bold mr-3"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                ✓
              </motion.span>
              <span>Suporte dedicado via WhatsApp</span>
            </motion.li>
          </motion.ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
