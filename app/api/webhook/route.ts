import { NextRequest, NextResponse } from 'next/server';
import {
  confirmTransaction,
  getTransaction,
  recordWebhookEvent,
  createOrUpdateCustomer,
  updateSubscription,
  getDatabase,
} from '@/lib/database';
import {
  validateWebhook,
  processWebhookPayload,
  WebhookPayload,
} from '@/lib/webhookUtils';

/**
 * 🔐 Webhook PIX - Banco EFI
 * ════════════════════════════════════════════════════════════════
 * Recebe confirmação de pagamentos PIX do Banco EFI
 * 
 * O Banco EFI envia requisição POST quando o PIX é confirmado:
 * - X-Webhook-Signature: Assinatura HMAC-SHA256
 * - Body: JSON com dados do pagamento
 */

/**
 * POST /api/webhook/pix
 * Recebe notificação de pagamento PIX confirmado
 */
export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Extrair assinatura do header
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');

    console.log('🔔 Webhook PIX recebido');
    console.log(`   Timestamp: ${timestamp}`);
    console.log(`   Signature: ${signature ? 'presente' : 'ausente'}`);

    // 2️⃣ Ler body
    const bodyText = await request.text();

    if (!bodyText) {
      console.error('❌ Body vazio');
      return NextResponse.json(
        { success: false, error: 'Empty body' },
        { status: 400 }
      );
    }

    // 3️⃣ Validar assinatura
    const clientSecret = process.env.EFI_WEBHOOK_SECRET ||
      (process.env.NEXT_PUBLIC_EFI_ENV === 'production'
        ? process.env.EFI_PROD_CLIENT_SECRET
        : process.env.EFI_HOMOLOG_CLIENT_SECRET);

    if (!clientSecret) {
      console.error('❌ Webhook secret não configurado');
      return NextResponse.json(
        { success: false, error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Validação de assinatura
    const validation = validateWebhook(bodyText, signature, clientSecret, 'hmac');

    if (!validation.valid) {
      console.error('❌ Assinatura inválida:', validation.reason);
      return NextResponse.json(
        { success: false, error: validation.reason || 'Invalid signature', authenticated: false },
        { status: 401 }
      );
    }

    console.log('✅ Assinatura válida');

    // 4️⃣ Processar payload
    const payloadResult = processWebhookPayload(bodyText);

    if (!payloadResult.valid || !payloadResult.data) {
      console.error('❌ Payload inválido:', payloadResult.error);
      return NextResponse.json(
        { success: false, error: payloadResult.error || 'Invalid payload' },
        { status: 400 }
      );
    }

    const payload = payloadResult.data as WebhookPayload;
    console.log(`📱 Processando pagamento: ${payload.txid || payload.id}`);

    // 5️⃣ Encontrar transação
    const txId = payload.txid || payload.id;
    const transaction = getTransaction(txId);

    if (!transaction) {
      console.error(`❌ Transação não encontrada: ${txId}`);
      recordWebhookEvent(txId, 'pix.received', payload);
      return NextResponse.json(
        { success: false, error: 'Transaction not found', txId },
        { status: 404 }
      );
    }

    console.log(`💰 Transação encontrada: ${transaction.id}`);
    console.log(`   Valor: R$ ${transaction.amount}`);
    console.log(`   Status: ${transaction.status}`);

    // 6️⃣ Verificar valor do pagamento
    if (Math.abs(transaction.amount - payload.valor) > 0.01) {
      console.error(`❌ Valor não corresponde: ${transaction.amount} vs ${payload.valor}`);
      recordWebhookEvent(txId, 'pix.amount_mismatch', {
        expected: transaction.amount,
        received: payload.valor,
      });
      return NextResponse.json(
        { success: false, error: 'Amount mismatch' },
        { status: 400 }
      );
    }

    // 7️⃣ Confirmar pagamento
    console.log('✅ Confirmando pagamento...');

    const payerData = {
      cpf: payload.infoPagador?.cpf,
      name: payload.infoPagador?.nome,
      email: payload.infoPagador?.email,
      phone: payload.infoPagador?.telefone,
    };

    const confirmed = confirmTransaction(txId, payerData, payload);

    if (!confirmed) {
      throw new Error('Failed to confirm transaction');
    }

    console.log('✅ Pagamento confirmado');

    // 8️⃣ Registrar webhook event
    recordWebhookEvent(txId, 'pix.confirmed', payload);

    // 9️⃣ Criar/atualizar cliente
    if (payerData.email) {
      console.log('👤 Criando/atualizando cliente...');

      const customer = createOrUpdateCustomer({
        email: payerData.email,
        cpf: payerData.cpf,
        name: payerData.name,
        phone: payerData.phone,
      });

      // 🔟 Ativar assinatura
      const planDays = parseInt(transaction.plan.split('-')[0]);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + planDays);

      updateSubscription(
        customer.id,
        'active',
        expiresAt.toISOString()
      );

      console.log(`✅ Assinatura ativada para ${planDays} dias`);
      console.log(`   Vence em: ${expiresAt.toLocaleDateString('pt-BR')}`);
    }

    // Retornar sucesso
    return NextResponse.json({
      success: true,
      message: 'Payment confirmed',
      data: {
        txId: confirmed.txId,
        amount: confirmed.amount,
        status: confirmed.status,
        confirmed_at: confirmed.confirmed_at,
        payer_name: confirmed.payer_name,
      },
    });
  } catch (error: any) {
    console.error('❌ Erro no webhook:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhook/pix
 * Status do webhook (para testes)
 */
export async function GET(_request: NextRequest) {
  const db = getDatabase();

  try {
    // Contar transações por status
    const pending = db.prepare(
      'SELECT COUNT(*) as count FROM pix_transactions WHERE status = ?'
    ).get('pending') as any;
    const confirmed = db.prepare(
      'SELECT COUNT(*) as count FROM pix_transactions WHERE status = ?'
    ).get('confirmed') as any;
    const events = db.prepare(
      'SELECT COUNT(*) as count FROM webhook_events'
    ).get() as any;

    return NextResponse.json({
      success: true,
      status: 'Webhook endpoint is active',
      statistics: {
        pending_transactions: pending.count,
        confirmed_transactions: confirmed.count,
        webhook_events_processed: events.count,
      },
      info: {
        endpoint: '/api/webhook/pix',
        method: 'POST',
        authentication: 'HMAC-SHA256 signature',
        header: 'X-Webhook-Signature',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
