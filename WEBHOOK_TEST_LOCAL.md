# 🧪 Teste Local do Webhook - PIX Banco EFI

## Pré-requisitos

- ✅ Servidor rodando: `npm run dev`
- ✅ Banco de dados SQLite criado automaticamente
- ✅ Variável `EFI_HOMOLOG_CLIENT_SECRET` configurada em `.env.local`

## Método 1: Script Automatizado (Recomendado)

O jeito mais fácil é usar o script de testes que já faz tudo:

```bash
# Terminal 1 - Inicie o servidor
npm run dev

# Terminal 2 - Rode os testes (aguarde o servidor subir)
npm run test:webhook
```

### O que o script testa:

1. ✅ **Webhook com assinatura válida** - Simula uma transação confirmada
2. ✅ **Webhook com assinatura inválida** - Verifica rejeição
3. ✅ **Webhook sem assinatura** - Verifica validação obrigatória
4. ✅ **Status do webhook** - Verifica estatísticas
5. ✅ **Rastreamento de transação** - Verifica 404 para nova transação

**Saída esperada:**
```
═══════════════════════════════════════════════════
  Teste 1: Webhook com Assinatura Válida
═══════════════════════════════════════════════════

✅ Resposta recebida (Status 200)
{
  "success": true,
  "message": "Pagamento confirmado",
  "transactionId": "test_1234567890"
}

...

5/5 testes passaram
🎉 Todos os testes passaram!
```

---

## Método 2: cURL Manual

Se quiser testar passo-a-passo com cURL:

### 1️⃣ Criar Transação (Obtenha um QR Code)

Primeiro, gere um QR code clicando no modal da aplicação ou use:

```bash
curl -X POST http://localhost:3000/api/pix \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 35.00,
    "description": "Teste de Webhook",
    "customer": {
      "name": "João Silva",
      "email": "joao@example.com",
      "cpf": "12345678900"
    }
  }'
```

**Resposta esperada:**
```json
{
  "qrCode": "00020126...",
  "copiaECola": "00020126...",
  "transactionId": "tx_123456",
  "expiresIn": 3600
}
```

Anote o `transactionId` para o próximo passo.

### 2️⃣ Enviar Webhook de Confirmação

Substitua `YOUR_TX_ID` pelo valor do passo anterior:

```bash
# Gerar assinatura HMAC
TX_ID="YOUR_TX_ID"
SECRET="Client_Secret_b989acf373422df834265765d0ce6a3092b3cb4f"
PAYLOAD="{\"txid\":\"$TX_ID\",\"valor\":35.0,\"docDevedora\":\"12345678900\",\"horario\":\"$(date -Iseconds)\"}"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -binary | base64)

# Enviar webhook
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Pagamento confirmado",
  "transactionId": "YOUR_TX_ID"
}
```

### 3️⃣ Verificar Status da Transação

```bash
curl http://localhost:3000/api/transactions/YOUR_TX_ID
```

**Resposta esperada:**
```json
{
  "txId": "YOUR_TX_ID",
  "status": "confirmed",
  "amount": 35.00,
  "confirmedAt": "2024-01-15T10:30:00Z"
}
```

### 4️⃣ Verificar Status do Webhook

```bash
curl http://localhost:3000/api/webhook
```

**Resposta esperada:**
```json
{
  "status": "operational",
  "statistics": {
    "pending_transactions": 0,
    "confirmed_transactions": 1,
    "webhook_events_processed": 1
  }
}
```

---

## Método 3: PowerShell (Windows)

Se está no Windows, pode usar PowerShell em vez de cURL:

```powershell
# Definir variáveis
$txId = "test_$(Get-Date -Format 'yyyyMMddHHmmss')"
$secret = "Client_Secret_b989acf373422df834265765d0ce6a3092b3cb4f"
$payload = @{
    txid = $txId
    valor = 35.0
    docDevedora = "12345678900"
    horario = (Get-Date -Format 'o')
} | ConvertTo-Json

# Gerar assinatura
$bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($secret)
$signature = [Convert]::ToBase64String($hmac.ComputeHash($bytes))

# Enviar webhook
$headers = @{
    "Content-Type" = "application/json"
    "X-Webhook-Signature" = $signature
}

Invoke-WebRequest `
    -Uri "http://localhost:3000/api/webhook" `
    -Method POST `
    -Headers $headers `
    -Body $payload
```

---

## Validar no Banco de Dados

Após testar, verifique o SQLite:

```bash
# Ver transações criadas
sqlite3 data/transactions.db "SELECT txid, status, amount FROM pix_transactions LIMIT 5;"

# Ver eventos de webhook
sqlite3 data/transactions.db "SELECT event_type, status FROM webhook_events LIMIT 5;"

# Ver clientes criados
sqlite3 data/transactions.db "SELECT email, subscription_status FROM customers LIMIT 5;"
```

---

## 🐛 Troubleshooting

### ❌ "Connection refused"
- Servidor não está rodando: `npm run dev`
- Aguarde 3-5 segundos após iniciar o servidor

### ❌ Status 401 (Unauthorized)
- Assinatura inválida
- Verificar se `EFI_HOMOLOG_CLIENT_SECRET` está em `.env.local`
- Verificar se está usando o secret correto

### ❌ Status 404 (Transaction not found)
- A transação precisa ser criada primeiro via `/api/pix`
- Verificar se o `txId` está correto

### ❌ "Database locked"
- Banco de dados pode estar em uso
- Parar servidor, deletar `data/transactions.db`
- Reiniciar servidor

### ❌ Assinatura não valida em cURL (macOS/Linux)
- Usar `echo -n` (sem quebra de linha)
- Ou usar: `printf '%s' "$PAYLOAD" | openssl ...`

---

## ✅ Checklist de Teste

- [ ] Servidor rodando (`npm run dev`)
- [ ] Script `npm run test:webhook` passou (5/5 testes)
- [ ] Banco de dados criado (`data/transactions.db` existe)
- [ ] Transação confirmada no database
- [ ] Endpoint `/api/webhook` retorna 200
- [ ] Endpoint `/api/transactions/:txId` retorna status correto
- [ ] EFI_HOMOLOG_CLIENT_SECRET está em `.env.local`

---

## 🚀 Próximo Passo

Após validar localmente:

1. Configurar **webhook URL no painel Banco EFI**
   - URL: `https://seu-dominio.com/api/webhook`
   - Eventos: PIX ou pix.received

2. Gerar um QR Code de teste no site

3. Confirmar pagamento manualmente no Banco EFI

4. Verificar se webhook foi recebido e confirmação foi processada

---

## 📖 Documentação Completa

Para mais detalhes sobre:
- Configuração do webhook no Banco EFI: veja `WEBHOOK_PIX_SETUP.md`
- Estrutura do banco de dados: veja `lib/database.ts`
- Validação de assinatura: veja `lib/webhookUtils.ts`
