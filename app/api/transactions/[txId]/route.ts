import { NextRequest, NextResponse } from 'next/server';
import { trackTransaction, formatTransactionResponse } from '@/lib/transactionService';

/**
 * GET /api/transactions/:txId
 * Rastreia o status de uma transação
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { txId: string } }
) {
  try {
    const { txId } = params;

    if (!txId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    const result = await trackTransaction(txId);

    if (!result.found) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        transaction: formatTransactionResponse(result.transaction!),
        message: result.message,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('❌ Erro ao rastrear transação:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
