#!/usr/bin/env node

/**
 * 🧪 Teste de Webhook - Banco EFI
 * ═════════════════════════════════════════════════
 * 
 * Envia webhook simulado para testar a integração
 * 
 * Uso:
 *   node test-webhook.js
 *   npm run test:webhook
 */

const crypto = require('crypto');
const http = require('http');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n');
  log(`${'═'.repeat(50)}`, 'bright');
  log(`  ${title}`, 'bright');
  log(`${'═'.repeat(50)}`, 'bright');
}

/**
 * Faz requisição HTTP
 */
function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const bodyString = typeof data === 'string' ? data : JSON.stringify(data || {});

    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyString),
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsed,
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: responseData,
            headers: res.headers,
          });
        }
      });
    });

    req.on('error', reject);
    req.write(bodyString);
    req.end();
  });
}

/**
 * Testa webhook com assinatura válida
 */
async function testWebhookWithValidSignature() {
  section('Teste 1: Webhook com Assinatura Válida');

  // Dados de teste
  const clientSecret = process.env.EFI_HOMOLOG_CLIENT_SECRET ||
    'Client_Secret_b989acf373422df834265765d0ce6a3092b3cb4f';

  const txId = `test_${Date.now()}`;

  const payload = {
    txid: txId,
    valor: 35.0,
    docDevedora: '12345678900',
    horario: new Date().toISOString(),
    infoPagador: {
      cpf: '12345678900',
      nome: 'João Silva',
      email: 'joao@example.com',
      telefone: '11999999999',
    },
  };

  const bodyString = JSON.stringify(payload);

  // Calcular assinatura HMAC
  const signature = crypto
    .createHmac('sha256', clientSecret)
    .update(bodyString)
    .digest('base64');

  log(`\n📊 Payload:`, 'blue');
  log(JSON.stringify(payload, null, 2), 'blue');

  log(`\n🔐 Assinatura: ${signature.substring(0, 50)}...`, 'magenta');

  try {
    log('\n📤 Enviando webhook...', 'yellow');
    const response = await makeRequest('POST', '/api/webhook', bodyString, {
      'X-Webhook-Signature': signature,
    });

    log(`\n✅ Resposta recebida (Status ${response.statusCode})`, 'green');
    log(JSON.stringify(response.data, null, 2), 'green');

    return response.data.success === true;
  } catch (error) {
    log(`\n❌ Erro: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Testa webhook com assinatura inválida
 */
async function testWebhookWithInvalidSignature() {
  section('Teste 2: Webhook com Assinatura Inválida');

  const payload = {
    txid: `test_invalid_${Date.now()}`,
    valor: 35.0,
    docDevedora: '12345678900',
  };

  const bodyString = JSON.stringify(payload);
  const invalidSignature = 'invalid_signature_here';

  try {
    log('\n📤 Enviando webhook com assinatura inválida...', 'yellow');
    const response = await makeRequest('POST', '/api/webhook', bodyString, {
      'X-Webhook-Signature': invalidSignature,
    });

    log(`\n📊 Resposta (Status ${response.statusCode}):`, 'blue');

    if (response.statusCode === 401) {
      log('✅ Corretamente rejeitado (401 Unauthorized)', 'green');
      return true;
    } else {
      log('❌ Deveria ter retornado 401', 'red');
      return false;
    }
  } catch (error) {
    log(`\n❌ Erro: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Testa webhook sem assinatura
 */
async function testWebhookWithoutSignature() {
  section('Teste 3: Webhook sem Assinatura');

  const payload = {
    txid: `test_nosig_${Date.now()}`,
    valor: 35.0,
  };

  try {
    log('\n📤 Enviando webhook sem header de assinatura...', 'yellow');
    const response = await makeRequest('POST', '/api/webhook', payload);

    log(`\n📊 Resposta (Status ${response.statusCode}):`, 'blue');

    if (response.statusCode === 401) {
      log('✅ Corretamente rejeitado (401)', 'green');
      return true;
    } else {
      log('❌ Deveria ter retornado 401', 'red');
      return false;
    }
  } catch (error) {
    log(`\n❌ Erro: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Testa status do webhook
 */
async function testWebhookStatus() {
  section('Teste 4: Status do Webhook');

  try {
    log('\n📊 Verificando status do webhook...', 'yellow');
    const response = await makeRequest('GET', '/api/webhook');

    if (response.statusCode === 200) {
      log('✅ Webhook está ativo', 'green');
      log(`\n📈 Estatísticas:`, 'blue');
      if (response.data.statistics) {
        log(`   Transações pendentes: ${response.data.statistics.pending_transactions}`, 'blue');
        log(`   Transações confirmadas: ${response.data.statistics.confirmed_transactions}`, 'blue');
        log(`   Webhooks processados: ${response.data.statistics.webhook_events_processed}`, 'blue');
      }
      return true;
    } else {
      log('❌ Webhook não está respondendo', 'red');
      return false;
    }
  } catch (error) {
    log(`\n❌ Erro: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Testa rastreamento de transação
 */
async function testTransactionTracking() {
  section('Teste 5: Rastreamento de Transação');

  const txId = 'test_tracking_' + Date.now();

  try {
    log('\n📍 Rastreando transação inexistente...', 'yellow');
    const response = await makeRequest('GET', `/api/transactions/${txId}`);

    if (response.statusCode === 404) {
      log('✅ Corretamente retorna 404 para transação inexistente', 'green');
      return true;
    } else {
      log('❌ Deveria retornar 404 para transação inexistente', 'red');
      return false;
    }
  } catch (error) {
    log(`\n❌ Erro: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Main
 */
async function main() {
  log('\n🧪 TESTES DE WEBHOOK - BANCO EFI', 'magenta');
  log(`${new Date().toLocaleString('pt-BR')}`, 'magenta');

  // Aguardar servidor
  log('\n⏳ Aguardando servidor em http://localhost:3000...', 'yellow');
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const tests = [];

  // Executar testes
  try {
    tests.push({
      name: 'Webhook com assinatura válida',
      result: await testWebhookWithValidSignature(),
    });

    tests.push({
      name: 'Webhook com assinatura inválida',
      result: await testWebhookWithInvalidSignature(),
    });

    tests.push({
      name: 'Webhook sem assinatura',
      result: await testWebhookWithoutSignature(),
    });

    tests.push({
      name: 'Status do webhook',
      result: await testWebhookStatus(),
    });

    tests.push({
      name: 'Rastreamento de transação',
      result: await testTransactionTracking(),
    });
  } catch (error) {
    log(`\n❌ Erro geral: ${error.message}`, 'red');
  }

  // Resumo
  section('📊 Resumo dos Testes');

  const passed = tests.filter((t) => t.result).length;
  const total = tests.length;

  tests.forEach((test) => {
    const icon = test.result ? '✅' : '❌';
    const color = test.result ? 'green' : 'red';
    log(`${icon} ${test.name}`, color);
  });

  log(`\n\n${passed}/${total} testes passaram`, passed === total ? 'green' : 'yellow');

  if (passed === total) {
    log('\n🎉 Todos os testes passaram!', 'green');
    log('Seu webhook está funcionando corretamente.\n', 'green');
  } else {
    log('\n⚠️  Alguns testes falharam. Verifique a configuração.\n', 'yellow');
  }
}

main();
