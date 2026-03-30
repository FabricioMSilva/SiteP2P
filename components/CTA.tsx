"use client";

/**
 * CTA Component - Call To Action
 * ────────────────────────────────────────────
 * Seção com botão principal para contato via WhatsApp
 * 
 * Features:
 * • Botão destacado com WhatsApp direto
 * • Logo FBR como fundo sutil e transparente
 * • Animações otimizadas para performance
 * • Responsivo e mobile-friendly
 * 
 * Link: https://wa.me/24998344324
 */

import { motion } from 'framer-motion';

/* Componente SVG para logo do WhatsApp */
function WhatsAppIcon() {
  return (
    <svg
      className="w-8 h-8 mr-3 inline-block"
      fill="#000000"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <title>whatsapp</title>
        <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z" />
      </g>
    </svg>
  );
}

export default function CTA() {
  // Número do WhatsApp (formato internacional)
  const whatsappNumber = '24998344324';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

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

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.5,
      },
    },
  };

  const dotsVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 1,
      },
    },
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Fundo com logo estático e transparente */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/logo-fbr.png')",
          backgroundSize: "400px 200px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <motion.div
        className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Título da seção */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-purple-iptv mb-6"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Pronto para fazer teste Gratis 6 hrs?
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed"
          variants={itemVariants}
        >
          Entre em contato conosco via WhatsApp e comece a desfrutar de novos
          conteúdos agora mesmo!
        </motion.p>

        {/* Botão CTA principal */}
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-10 py-5 bg-yellow-iptv text-black font-bold text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 ease-out transform active:scale-95"
          variants={buttonVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 25px 50px rgba(255, 215, 0, 0.4)",
          }}
          whileTap={{
            scale: 0.95,
            transition: { duration: 0.1 },
          }}
          animate={{
            boxShadow: [
              "0 4px 15px rgba(255, 215, 0, 0.2)",
              "0 8px 25px rgba(255, 215, 0, 0.3)",
              "0 4px 15px rgba(255, 215, 0, 0.2)",
            ],
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <WhatsAppIcon />
          Fale agora no WhatsApp
        </motion.a>

        {/* Texto de suporte */}
        <motion.p
          className="text-gray-600 mt-8 text-sm md:text-base"
          variants={itemVariants}
        >
          📞 Número: {whatsappNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
        </motion.p>
        <motion.p
          className="text-gray-500 mt-2 text-xs md:text-sm"
          variants={itemVariants}
        >
          Responderemos em breve. Horário de atendimento: 09:00 - 22:00
        </motion.p>
      </motion.div>

      {/* Decoração visual animada */}
      <motion.div
        className="mt-12 flex justify-center gap-2"
        variants={dotsVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-yellow-iptv"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="w-2 h-2 rounded-full bg-purple-iptv"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        <motion.div
          className="w-2 h-2 rounded-full bg-yellow-iptv"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </motion.div>
    </section>
  );
}
