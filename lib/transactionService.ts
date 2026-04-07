/**
 * 💳 Transaction Service
 * ════════════════════════════════════════════════════
 * Gerencia criação e rastreamento de transações PIX
 */

import {
  createTransaction as dbCreateTransaction,
  getTransaction as dbGetTransaction,
  getAllPendingTransactions,
  getExpiredTransactions,
  updateTransactionStatus,
  PixTransaction,
} from '@/lib/database';

/**
 * Dados para criar uma transação
 */
export interface CreateTransactionData {
  txId: string;
  amount: number;
  plan: string;
  description?: string;
  pixKey: string;
  brCode?: string;
  expiresAt?: string;
}

/**
 * Cria nova transação PIX
 */
export async function createPixTransaction(data: CreateTransactionData): Promise<PixTransaction> {
  const transaction = dbCreateTransaction({
    txId: data.txId,
    amount: data.amount,
    plan: data.plan,
    description: data.description,
    pixKey: data.pixKey,
    brCode: data.brCode,
    expires_at: data.expiresAt,
    status: 'pending',
  });

  console.log(`✅ Transação criada: ${transaction.id}`);
  return transaction;
}

/**
 * Rastreia status de uma transação
 */
export async function trackTransaction(txId: string): Promise<{
  found: boolean;
  transaction?: PixTransaction;
  message: string;
}> {
  const transaction = dbGetTransaction(txId);

  if (!transaction) {
    return {
      found: false,
      message: `Transação ${txId} não encontrada`,
    };
  }

  const statusMessages = {
    pending: '⏳ Aguardando pagamento',
    confirmed: '✅ Pagamento confirmado',
    failed: '❌ Pagamento falhou',
    expired: '⏰ Transação expirada',
  };

  return {
    found: true,
    transaction,
    message: statusMessages[transaction.status] || 'Status desconhecido',
  };
}

/**
 * Obtém todas as transações pendentes
 */
export async function getPendingTransactions(): Promise<PixTransaction[]> {
  return getAllPendingTransactions();
}

/**
 * Obtém transações expiradas
 */
export async function getExpiredTransactionsForMarkingAsFailed(): Promise<PixTransaction[]> {
  const expired = getExpiredTransactions();

  // Marcar como expiradas
  for (const tx of expired) {
    if (tx.status === 'pending') {
      updateTransactionStatus(tx.txId, 'expired', 'Transaction expired');
      console.log(`⏰ Transação marcada como expirada: ${tx.txId}`);
    }
  }

  return expired;
}

/**
 * Stats de transações
 */
export async function getTransactionStats(): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  failed: number;
  expired: number;
}> {
  // Buscar todas para contar (simplificado)
  const pending = getAllPendingTransactions();
  const expired = await getExpiredTransactionsForMarkingAsFailed();

  return {
    total: pending.length + expired.length,
    pending: pending.length,
    confirmed: 0, // Seria buscado do DB
    failed: 0, // Seria buscado do DB
    expired: expired.length,
  };
}

/**
 * Formata transação para resposta API
 */
export function formatTransactionResponse(tx: PixTransaction): any {
  return {
    id: tx.id,
    txId: tx.txId,
    amount: tx.amount,
    status: tx.status,
    plan: tx.plan,
    createdAt: tx.created_at,
    expiresAt: tx.expires_at,
    confirmedAt: tx.confirmed_at,
    payerName: tx.payer_name,
    payerEmail: tx.payer_email,
  };
}
