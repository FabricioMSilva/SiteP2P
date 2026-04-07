#!/usr/bin/env node

/**
 * 🧪 Script de Teste - Integração Banco EFI PIX
 * ═════════════════════════════════════════════════
 * 
 * Uso: node test-pix.js
 * 
 * Testa se a integração com Banco EFI está funcionando corretamente
 */

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
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
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

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Testa os diferentes valores de plano
 */
async function testPixGeneration() {
  const testCases = [
    {
      name: '15 dias - R$ 20',
      amount: 20,
      description: 'Assinatura PIX 15 dias',
      plan: '15-days',
    },
    {
      name: '30 dias - R$ 35',
      amount: 35,
      description: 'Assinatura PIX 30 dias',
      plan: '30-days',
    },
    {
      name: '60 dias - R$ 60',
      amount: 60,
      description: 'Assinatura PIX 60 dias',
      plan: '60-days',
    },
  ];

  section('Testando Geração de QR Code PIX');

  for (const testCase of testCases) {
    try {
      log(`\n📱 Testando: ${testCase.name}...`, 'blue');

      const response = await makeRequest('POST', '/api/pix', {
        amount: testCase.amount,
        description: testCase.description,
        plan: testCase.plan,
        expiresIn: 3600,
      });

      if (response.statusCode === 200 && response.data.success) {
        log(`✅ Sucesso!`, 'green');
        log(`   Valor: R$ ${response.data.data.amount}`, 'green');
        log(`   TxId: ${response.data.data.txId}`, 'green');
        log(`   Expira em: ${response.data.data.expiresAt}`, 'green');
        log(
          `   Código PIX (primeiros 50 chars): ${response.data.data.copyPaste.substring(0, 50)}...`,
          'green'
        );
      } else {
        log(`❌ Falha!`, 'red');
        log(`   Status: ${response.statusCode}`, 'red');
        log(`   Erro: ${response.data.error}`, 'red');
      }
    } catch (error) {
      log(`❌ Erro: ${error.message}`, 'red');
    }
  }
}

/**
 * Testa requisição inválida
 */
async function testInvalidRequest() {
  section('Testando Validação de Dados');

  try {
    log('\n🔍 Testando com valor inválido (0)...', 'blue');
    const response = await makeRequest('POST', '/api/pix', {
      amount: 0,
      description: 'Teste inválido',
    });

    if (response.statusCode !== 200) {
      log(`✅ Validação funcionando!`, 'green');
      log(`   Status: ${response.statusCode}`, 'green');
      log(`   Erro: ${response.data.error}`, 'green');
    } else {
      log(`❌ Validação não funcionou!`, 'red');
    }
  } catch (error) {
    log(`❌ Erro: ${error.message}`, 'red');
  }
}

/**
 * Checa variáveis de ambiente
 */
function checkEnvironment() {
  section('Verificando Configuração de Ambiente');

  const requiredVars = [
    'NEXT_PUBLIC_EFI_ENV',
    'EFI_HOMOLOG_CLIENT_ID',
    'EFI_HOMOLOG_CLIENT_SECRET',
    'NEXT_PUBLIC_PIX_KEY',
    'NEXT_PUBLIC_COMPANY_CITY',
  ];

  const missingVars = [];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      const masked =
        value.length > 20 ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}` : value;
      log(`✅ ${varName}: ${masked}`, 'green');
    } else {
      log(`❌ ${varName}: NÃO CONFIGURADO`, 'red');
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    log(`\n⚠️  Faltam ${missingVars.length} variáveis de ambiente!`, 'yellow');
    log('Atualize seu arquivo .env.local', 'yellow');
  }
}

/**
 * Main
 */
async function main() {
  log('\n🚀 Iniciando Testes de Integração PIX', 'magenta');
  log(`   Data: ${new Date().toLocaleString('pt-BR')}`, 'magenta');

  // Checar ambiente
  checkEnvironment();

  // Aguardar um pouco para o servidor estar pronto
  log('\n⏳ Aguardando servidor em http://localhost:3000...', 'yellow');
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    // Testar geração de QR Code
    await testPixGeneration();

    // Testar validação
    await testInvalidRequest();

    section('✨ Testes Concluídos!');
    log('\n✅ Se todos os testes passaram, sua integração PIX está funcionando!', 'green');
  } catch (error) {
    section('❌ Erro Durante os Testes');
    log(`\nCertifique-se de que o servidor está rodando:`, 'yellow');
    log(`npm run dev`, 'yellow');
    log(`\nErro: ${error.message}`, 'red');
  }
}

main();
