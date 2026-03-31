"use client";

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main footer content */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {/* Brand Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center font-bold text-black">
                FBR
              </div>
              <span className="text-lg font-bold">FBR Digital</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              A melhor plataforma de streaming do Brasil. Entretenimento sem limites.
            </p>
            <div className="flex gap-3">
              {['tw', 'fb', 'ig'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  {social === 'tw' && '𝕏'}
                  {social === 'fb' && 'f'}
                  {social === 'ig' && '📷'}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded"></span>
              Navegação
            </h4>
            <ul className="space-y-3">
              {['Início', 'Serviços', 'Como Funciona', 'Contato'].map((link) => (
                <motion.li key={link} whileHover={{ x: 5 }}>
                  <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-500 rounded"></span>
              Serviços
            </h4>
            <ul className="space-y-3">
              {['Streaming IPTV', 'Suporte 24/7', 'Instalação Grátis', 'Premium+'].map((service) => (
                <motion.li key={service} whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {service}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded"></span>
              Contato
            </h4>
            <div className="space-y-4">
              <motion.a
                href="https://wa.me/seu-numero"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 group"
              >
                <Phone size={20} className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">WhatsApp</p>
                  <p className="text-white hover:text-green-400 transition-colors">(24) 99834-4324</p>
                </div>
              </motion.a>

              <motion.a
                href="mailto:FBRConsultoriaDigital@gmail.com"
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 group"
              >
                <Mail size={20} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white text-sm hover:text-blue-400 transition-colors">FBR@digital.com.br</p>
                </div>
              </motion.a>

              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Atendimento</p>
                  <p className="text-white">09:00 - 22:00</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p variants={itemVariants} className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} FBR Consultoria Digital. Todos os direitos reservados.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-6 text-sm text-gray-500">
              {['Privacidade', 'Termos', 'Cookies'].map((legal) => (
                <a key={legal} href="#" className="hover:text-white transition-colors">
                  {legal}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating WhatsApp CTA */}
      <motion.a
        href="https://wa.me/seu-numero"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-50"
      >
        <span className="text-2xl">💬</span>
      </motion.a>
    </footer>
  );
}
