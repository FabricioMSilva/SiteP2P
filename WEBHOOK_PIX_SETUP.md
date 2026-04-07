# 🔔 Webhook PIX - Configuração e Implementação

## 📋 Visão Geral

O Webhook PIX recebe confirmações de pagamento direto do Banco EFI quando o cliente faz uma transferência PIX. Este sistema:

- ✅ Recebe notificação de pagamento confirmado
- ✅ Valida assinatura HMAC-SHA256 do Banco EFI
- ✅ Armazena transação em SQLite
- ✅ Ativa assinatura do cliente automaticamente
- ✅ Envia emails de confirmação (próximo)

---

## 🔧 Arquitetura Implementada

```
Banco EFI                   Seu Servidor                    Banco de Dados
─────────────────          ──────────────────              ─────────────────

Client faz PIX
        │
        └──> Valida PIX
             │
             └──> POST /api/webhook/pix
                  (com X-Webhook-Signature)
                  │
                  ├─ Valida assinatura HMAC
                  ├─ Valida payload
                  ├─ Busca transação
                  ├─ Confirma pagamento ────> UPDATE pix_transactions
                  ├─ Cria/atualiza cliente ─> INSERT/UPDATE customers
                  ├─ Ativa assinatura ─────> UPDATE subscription
                  └─ Registra event ──────> INSERT webhook_events
```

---

## 🗄️ Banco de Dados

### Tabelas Criadas

#### 1. `pix_transactions`
```sql
CREATE TABLE pix_transactions (
  id TEXT PRIMARY KEY,
  txId TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL,
  status TEXT (pending|confirmed|failed|expired),
  plan TEXT,
  description TEXT,
  pixKey TEXT,
  brCode TEXT,
  payer_cpf TEXT,
  payer_name TEXT,
  payer_email TEXT,
  payer_phone TEXT,
  created_at DATETIME,
  expires_at DATETIME,
  confirmed_at DATETIME,
  webhook_data TEXT (JSON),
  retry_count INTEGER,
  last_error TEXT
);
```

#### 2. `webhook_events`
```sql
CREATE TABLE webhook_events (
  id INTEGER PRIMARY KEY,
  tx_id TEXT,
  event_type TEXT (pix.received|pix.confirmed|pix.failed|etc),
  payload TEXT (JSON),
  status TEXT,
  created_at DATETIME
);
```

#### 3. `customers`
```sql
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT,
  cpf TEXT,
  name TEXT,
  subscription_status TEXT (active|inactive|expired),
  subscription_expires_at DATETIME
);
```

---

## 🔐 Segurança - Validação de Assinatura

### O que é?
O Banco EFI envia um header `X-Webhook-Signature` com cada webhook para provar que é realmente deles.

### Como funciona?

1. **Banco EFI calcula:**
   ```
   signature = HMAC-SHA256(Client_Secret, body)
   ```

2. **Seu servidor valida:**
   ```
   calculado = HMAC-SHA256(Client_Secret, body_recebido)
   if (calculado == assinatura_header) então é válido!
   ```

### Implementação
```typescript
// Seu Client Secret (em .env.local)
EFI_WEBHOOK_SECRET=seu_secret_aqui

// Validação (já implementada)
import { validateWebhook } from '@/lib/webhookUtils';

const validation = validateWebhook(body, signature, clientSecret);
if (!validation.valid) {
  return error('Invalid signature');
}
```

---

## 📡 Configuring Webhook no Painel Banco EFI

### 1. Acessar Painel
1. Abra: https://www.gerencianet.com.br (sua conta)
2. Vá para: **Configurações > Webhooks**

### 2. Adicionar Novo Webhook
- **URL**: `https:/seu-dominio.com/api/webhook/pix`
- **Eventos**: PIX (ou `pix.received`)
- **Ativo**: SIM

### 3. Salvar
O Banco EFI agora enviará webhooks para essa URL quando houver pagamento.

---

## 🧪 Teste Local

### 1. Rodar servidor
```bash
npm run dev
```

### 2. Simular webhook (em outro terminal)
```bash
# Gerar assinatura válida
CLIENT_SECRET="seu_secret"
BODY='{"txid":"test123","valor":35.0,"infoPagador":{"cpf":"12345678900","nome":"João"}}'

# Calcular signature (bash com openssl)
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$CLIENT_SECRET" -binary | base64)

# Enviar webhook
curl -X POST http://localhost:3000/api/webhook/pix \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -d "$BODY"
```

### 3. Verificar resposta
```json
{
  "success": true,
  "message": "Payment confirmed",
  "data": {
    "txId": "test123",
    "amount": 35,
    "status": "confirmed",
    "confirmed_at": "2026-04-07T...",
    "payer_name": "João"
  }
}
```

---

## 🔌 Fluxo Completo

### 1. Cliente Paga PIX
```
1. Clica em "30 dias - R$ 35"
2. Modal PIX abre com QR Code
3. Cliente escaneia/copia e paga no banco
```

### 2. Webhok é Enviado
```
Banco EFI detecta o PIX confirmado
Envia POST /api/webhook/pix com:
- X-Webhook-Signature: HMAC válido
- Body: dados do pagamento
```

### 3. Seu Servidor Processa
```typescript
1. Valida assinatura ✅
2. Valida payload ✅
3. Busca transação original ✅
4. Verifica valor ✅
5. Marca como "confirmed" ✅
6. Ativa assinatura do cliente ✅
7. Cria/atualiza customer record ✅
```

### 4. Cliente Ganha Acesso
```
200 OK resposta ao Banco EFI
Cliente já pode assistir IPTV
(até a data de expiração da assinatura)
```

---

## 📊 API endpoints

### POST `/api/webhook/pix`
Recebe webhook do Banco EFI
- **Headers obrigatórios**: `X-Webhook-Signature`
- **Body**: JSON com dados do pagamento
- **Resposta**: Confirmação de recebimento

### GET `/api/webhook/pix`
Status do webhook (para testes)
```json
{
  "success": true,
  "status": "Webhook endpoint is active",
  "statistics": {
    "pending_transactions": 5,
    "confirmed_transactions": 42,
    "webhook_events_processed": 47
  }
}
```

### GET `/api/transactions/:txId`
Rastreia status de uma transação
```bash
curl http://localhost:3000/api/transactions/abc123def456
```

```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "tx_123...",
      "txId": "abc123def456",
      "amount": 35,
      "status": "confirmed",
      "createdAt": "2026-04-07T...",
      "confirmedAt": "2026-04-07T...",
      "payerName": "João Silva",
      "payerEmail": "joao@email.com"
    },
    "message": "✅ Pagamento confirmado"
  }
}
```

---

## 📝 Estrutura de Pastas

```
lib/
├── database.ts          ← 🗄️ SQLite + schema
├── webhookUtils.ts      ← 🔐 Validação assinatura
├── transactionService.ts ← 💳 Gerenciamento transações
└── pixService.ts        ← 📱 Geração QR Code (já existia)

app/api/
├── pix/
│   └── route.ts        ← Gera QR Code (já existia)
├── webhook/
│   └── route.ts        ← ✨ NOVO - Recebe webhook
└── transactions/
    └── [txId]/
        └── route.ts    ← ✨ NOVO - Rastreia transação
```

---

## 🔄 Fluxo de Dados Webhook

```
Banco EFI POST
    │
    ├─ Header: X-Webhook-Signature
    └─ Body: {
         txid: "abc123",
         valor: 35.0,
         docDevedora: "12345678900",
         infoPagador: {
           cpf: "12345678900",
           nome: "João",
           email: "joao@email.com",
           telefone: "11999999999"
         }
       }
    │
    ▼
1. Validar assinatura com Client Secret
    │
    ├─ Se inválido → 401 Unauthorized
    └─ Se válido ✅ → Continuar
    │
    ▼
2. Validar payload (campos obrigatórios)
    │
    ├─ Se inválido → 400 Bad Request
    └─ Se válido ✅ → Continuar
    │
    ▼
3. Buscar transação (txId)
    │
    ├─ Se não existe → 404 Not Found + registra evento
    └─ Se existe ✅ → Continuar
    │
    ▼
4. Verificar valor (segurança)
    │
    ├─ Se diferente → 400 Amount mismatch
    └─ Se igual ✅ → Continuar
    │
    ▼
5. Confirmar pagamento
    │
    ├─ UPDATE pix_transactions SET status = 'confirmed'
    ├─ UPDATE SET confirmed_at, payer_*, webhook_data
    └─ ✅ Pagamento marcado como confirmado
    │
    ▼
6. Processar cliente
    │
    ├─ Criar/atualizar customer
    ├─ INSERT/UPDATE email, cpf, nome
    └─ ✅ Cliente no banco
    │
    ▼
7. Ativar assinatura
    │
    ├─ UPDATE customers SET subscription_status = 'active'
    ├─ UPDATE SET subscription_expires_at = data_expiro
    └─ ✅ Acesso liberado
    │
    ▼
8. Registrar evento
    │
    ├─ INSERT webhook_events
    └─ ✅ Auditoria completa
    │
    ▼
200 OK - Retornar ao Banco EFI
```

---

## 🚨 Tratamento de Erros

| Erro | Causa | Solução |
|------|-------|---------|
| **401** | Assinatura inválida | Verificar Client Secret em .env.local |
| **404** | Transação não existe | Verificar se QR Code foi gerado antes do webhook |
| **400** | Payload inválido | Ver logs do servidor |
| **400** | Amount mismatch | Valor recebido ≠ valor esperado |
| **500** | Erro interno | Ver logs, restaurar integridade do banco |

---

## 📋 Checklist Produção

- [ ] Webhook URL cadastrada no painel Banco EFI
- [ ] Client Secret configurado em `.env.local`
- [ ] Banco de dados SQLite inicializado (será criado em `/data/transactions.db`)
- [ ] Pasta `/data` tem permissão de escrita
- [ ] Testar webhook com curl/postman
- [ ] Transações aparecem no banco de dados
- [ ] Status muda de "pending" para "confirmed"
- [ ] Clientes são criados corretamente
- [ ] Assinatura expira após período correto

---

## 🧪 Script de Teste

```bash
# Teste completo de webhook
npm run test:webhook

# Ver status do webhook
curl http://localhost:3000/api/webhook/pix

# Rastrear transação
curl http://localhost:3000/api/transactions/abc123def456
```

---

## 📚 Documentação Relacionada

- [EFI_PIX_SETUP.md](./EFI_PIX_SETUP.md) - Setup geral PIX
- [PIX_CERTIFICATE_GUIDE.md](./PIX_CERTIFICATE_GUIDE.md) - Certificado P12
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - Sumário completo

---

## 🔗 Links Úteis

- 🌐 [Banco EFI - Webhooks](https://dev.efipay.com.br/docs/webhooks)
- 📖 [Documentação EFI - Pagamentos](https://dev.efipay.com.br/docs/pix)
- 🛠️ [Testar Webhook (Webhook.site)](https://webhook.site)

---

**Status**: ✅ Implementado e testado
**Versão**: 1.0.0
**Última atualização**: Abril 2026
