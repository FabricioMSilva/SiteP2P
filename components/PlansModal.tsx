"use client";

import { motion, AnimatePresence } from 'framer-motion';
import type { Plan } from '@/types';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: Plan) => void;
}

const PLANS: Plan[] = [
  { dias: 15, preco: 'R$ 20' },
  { dias: 30, preco: 'R$ 35' },
  { dias: 60, preco: 'R$ 60' },
  { dias: 180, preco: 'R$ 150' },
  { dias: 360, preco: 'R$ 250' },
];

export default function PlansModal({ isOpen, onClose, onSelectPlan }: PlansModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Overlay para fechar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-50 p-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900">Escolha seu Plano</h2>
                <p className="text-gray-600 mt-2">Selecione a duração da sua assinatura</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Grid de Planos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PLANS.map((plan, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    onSelectPlan(plan);
                    onClose();
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-purple-600 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-lg"
                >
                  {/* Badge mais popular */}
                  {index === 2 && (
                    <div className="mb-4">
                      <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-xs font-bold">
                        ⭐ Melhor Custo-Benefício
                      </span>
                    </div>
                  )}

                  {/* Dias */}
                  <div className="mb-2">
                    <p className="text-gray-600 text-sm font-medium">Duração</p>
                    <h3 className="text-2xl font-black text-gray-900">
                      {plan.dias} dias
                    </h3>
                  </div>

                  {/* Preço */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm font-medium">Valor</p>
                    <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                      {plan.preco}
                    </p>
                  </div>

                  {/* Valor por dia */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      {(parseFloat(plan.preco.replace(/[^\d.]/g, '')) / parseInt(plan.dias.toString())).toFixed(2)} por dia
                    </p>
                  </div>

                  {/* Benefícios */}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-green-600 font-semibold">✅ Accesso imediato</p>
                    <p className="text-xs text-green-600 font-semibold">✅ Todos os canais</p>
                    <p className="text-xs text-green-600 font-semibold">✅ Suporte 24/7</p>
                  </div>

                  {/* Botão */}
                  <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 rounded-xl transition-colors">
                    Escolher Plano
                  </button>
                </motion.button>
              ))}
            </div>

            {/* Rodapé com aviso */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>💡 Dica:</strong> Quanto maior a duração, menor o valor por dia!
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
