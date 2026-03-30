"use client";

/**
 * Footer Component
 * ────────────────────────────────────────────
 * Rodapé com informações de contato, links rápidos e copyright
 * 
 * Features:
 * • Logo FBR no footer
 * • Contato direto (WhatsApp, Email)
 * • Links de navegação rápida
 * • Coração animado como decoração
 * • Copyright e horário de atendimento
 */

import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Variants para animações
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      color: '#FFD700',
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.footer
      className="bg-purple-iptv text-white py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Container principal do footer */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          variants={containerVariants}
        >
          {/* Seção: Sobre */}
          <motion.div variants={itemVariants}>
            <motion.h4
              className="text-lg font-bold text-yellow-iptv mb-3"
              variants={itemVariants}
            >
              Sobre
            </motion.h4>
            <motion.p
              className="text-gray-100 text-sm leading-relaxed"
              variants={itemVariants}
            >
              Sua plataforma de streaming favorita. Mais diversão, menos gasto.
              Conteúdo de qualidade ao seu alcance.
            </motion.p>
          </motion.div>

          {/* Seção: Contato */}
          <motion.div variants={itemVariants}>
            <motion.h4
              className="text-lg font-bold text-yellow-iptv mb-3"
              variants={itemVariants}
            >
              Contato
            </motion.h4>
            <motion.ul
              className="text-gray-100 text-sm space-y-2"
              variants={itemVariants}
            >
              <motion.li variants={itemVariants}>
                📱 WhatsApp:{' '}
                <motion.a
                  href="https://wa.me/24998344324"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-iptv hover:underline"
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                >
                  (24) 99834-4324
                </motion.a>
              </motion.li>
              <motion.li variants={itemVariants}>
                📧 Email: FBRConsultoriaDigital@gmail.com
              </motion.li>
              <motion.li variants={itemVariants}>
                🕐 Atendimento: 09:00 - 22:00
              </motion.li>
            </motion.ul>
          </motion.div>

          {/* Seção: Links rápidos */}
          <motion.div variants={itemVariants}>
            <motion.h4
              className="text-lg font-bold text-yellow-iptv mb-3"
              variants={itemVariants}
            >
              Links Rápidos
            </motion.h4>
            <motion.ul
              className="text-gray-100 text-sm space-y-2"
              variants={itemVariants}
            >
              <motion.li variants={itemVariants}>
                <motion.a
                  href="#inicio"
                  className="hover:text-yellow-iptv transition-colors"
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                >
                  Início
                </motion.a>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.a
                  href="#servicos"
                  className="hover:text-yellow-iptv transition-colors"
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                >
                  Serviços
                </motion.a>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.a
                  href="/privacidade"
                  className="hover:text-yellow-iptv transition-colors"
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                >
                  Política de Privacidade
                </motion.a>
              </motion.li>
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* Linha separadora */}
        <motion.div
          className="border-t border-purple-400 my-6"
          variants={itemVariants}
        ></motion.div>

        {/* Seção inferior com copyright */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center text-center md:text-left text-gray-200 text-sm"
          variants={containerVariants}
        >
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <img
              src="/logo-fbr.png"
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='48' viewBox='0 0 160 48'%3E%3Crect width='160' height='48' rx='8' fill='%236a0dad'/%3E%3Ctext x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%23fff'%3EFBR%20Consultoria%20Digital%3C/text%3E%3C/svg%3E";
              }}
              alt="FBR Consultoria Digital"
              className="h-full max-h-16 w-auto object-contain"
            />
            <motion.p variants={itemVariants}>
              © {currentYear} Todos os direitos reservados.
            </motion.p>
          </div>
          <motion.p
            variants={itemVariants}
            className="flex items-center gap-1"
          >
            Desenvolvido com{' '}
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              ❤️
            </motion.span>{' '}
            para melhor entretenimento
          </motion.p>
          <motion.p variants={itemVariants}>
            Contato:{' '}
            <motion.a
              href="tel:+5524998344324"
              className="text-yellow-iptv hover:underline"
              variants={linkVariants}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              +55 24 99834-4324
            </motion.a>
          </motion.p>
        </motion.div>

        {/* Aviso legal */}
        <motion.p
          className="text-xs text-gray-300 mt-6 text-center"
          variants={itemVariants}
        >
          Este serviço é fornecido conforme os termos e condições. Consulte nossa
          política de privacidade para mais informações sobre como seus dados são
          tratados.
        </motion.p>
      </div>
    </motion.footer>
  );
}
