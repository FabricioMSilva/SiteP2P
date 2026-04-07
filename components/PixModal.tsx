"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  generatePixQRCode, 
  copyPixToClipboard, 
  getTimeRemaining,
  PixPaymentData 
} from '@/lib/pixService';

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    dias: string | number;
    preco: string;
  };
}

export default function PixModal({ isOpen, onClose, plan }: PixModalProps) {
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Extrair valor numérico do preço (ex: "R$ 20" -> 20)
  const amount = parseFloat(plan.preco.replace(/[^\d.]/g, ''));

  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen]);

  // Atualizar timer a cada segundo
  useEffect(() => {
    if (!pixData?.expiresAt) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(pixData.expiresAt);
      
      if (remaining.isExpired) {
        setTimeRemaining('Expirado - Gere um novo QR Code');
        clearInterval(interval);
      } else {
        const hours = String(remaining.hours).padStart(2, '0');
        const minutes = String(remaining.minutes).padStart(2, '0');
        const seconds = String(remaining.seconds).padStart(2, '0');
        setTimeRemaining(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pixData?.expiresAt]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError('');
      setPixData(null);

      const data = await generatePixQRCode({
        amount,
        description: `Plano IPTV ${plan.dias} dias`,
        plan: `${plan.dias}-days`,
      });

      setPixData(data);
      setTimeRemaining('01:00:00'); // 1 hora padrão
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao gerar QR Code:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (!pixData) return;
    
    try {
      copyPixToClipboard(pixData.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      setError('Erro ao copiar código PIX');
    }
  };

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
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-50 max-h-[90vh] overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl text-white flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">💜 Pagamento PIX</h2>
                  <p className="text-purple-100">Plano: {plan.dias} dias</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-purple-600 p-2 rounded-full transition-colors"
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
            </div>

            {/* Conteúdo - Scrollável */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Status de carregamento */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                  <p className="text-gray-600">Gerando seu QR Code...</p>
                </div>
              )}

              {/* Erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-semibold">❌ {error}</p>
                  <button
                    onClick={() => generateQRCode()}
                    className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}

              {/* QR Code e Dados */}
              {pixData && !loading && (
                <>
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <img
                        src={pixData.qrCode}
                        alt="QR Code PIX"
                        className="w-64 h-64"
                      />
                    </div>
                  </div>

                  {/* Valor */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                    <p className="text-gray-600 text-sm mb-1">Valor a Pagar</p>
                    <h3 className="text-4xl font-black text-purple-600">
                      {plan.preco}
                    </h3>
                  </div>

                  {/* Chave PIX - Copia e Cola */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Código PIX (Copia e Cola)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={pixData.copyPaste}
                        readOnly
                        className="w-full bg-gray-100 border-2 border-gray-300 rounded-lg p-3 text-xs font-mono text-gray-700 focus:border-purple-600 focus:outline-none overflow-hidden"
                      />
                      <button
                        onClick={handleCopyPix}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          copied
                            ? 'bg-green-500 text-white'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {copied ? '✅ Copiado!' : '📋 Copiar'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Cole este código no seu aplicativo de banco para fazer o pagamento
                    </p>
                  </div>

                  {/* Timer de Expiração */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-xs text-yellow-700 mb-1">Válido por:</p>
                    <p className="text-xl font-bold text-yellow-600 font-mono">{timeRemaining}</p>
                    <button
                      onClick={generateQRCode}
                      className="mt-3 text-xs text-yellow-700 hover:text-yellow-900 underline"
                    >
                      Gerar novo QR Code
                    </button>
                  </div>

                  {/* Instruções */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📱 Como Pagar:</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Abra seu aplicativo de banco</li>
                      <li>Vá para a opção PIX</li>
                      <li>Escolha "Copia e Cola"</li>
                      <li>Cole o código acima e confirme</li>
                      <li>Ou escaneie o QR Code com a câmera</li>
                    </ol>
                  </div>

                  {/* Confirmação */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ✅ Após o pagamento, seu acesso será ativado em até 5 minutos
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer - Botão Fechar */}
            {!loading && (
              <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl flex-shrink-0">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
