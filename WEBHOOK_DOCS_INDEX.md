# 📖 Webhook PIX - Documentação Completa

## 📚 Índice de Documentação

### 🚀 Começar Aqui

| Documento | Tempo | Descrição |
|-----------|-------|-----------|
| **[QUICK_START_WEBHOOK.md](QUICK_START_WEBHOOK.md)** | ⏱️ 1 min | Teste rápido em 60 segundos |
| **[WEBHOOK_TEST_LOCAL.md](WEBHOOK_TEST_LOCAL.md)** | ⏱️ 5-10 min | Testes detalhados com múltiplos métodos |
| **[WEBHOOK_CONFIG_PANEL.md](WEBHOOK_CONFIG_PANEL.md)** | ⏱️ 5 min | Configurar webhook no Banco EFI |
| **[WEBHOOK_PIX_SETUP.md](WEBHOOK_PIX_SETUP.md)** | ⏱️ 15 min | Documentação técnica completa |

---

## 🎯 Roteiros por Perfil

### 👨‍💼 Gerente de Projeto / Empresário

**Objetivo:** Entender como funciona o sistema de pagamento PIX

1. Leia: [WEBHOOK_PIX_SETUP.md](WEBHOOK_PIX_SETUP.md) - Seção "Visão Geral da Integração"
2. Entenda o fluxo completo
3. Delegue testes ao desenvolvedor

**Tempo:** ~5 minutos

---

### 👨‍💻 Desenvolvedor - Ambiente Local

**Objetivo:** Testar webhook localmente antes de fazer deploy

1. **Executar:** `npm run test:webhook` ([QUICK_START_WEBHOOK.md](QUICK_START_WEBHOOK.md))
2. **Se passou:** Ir para configuração no painel
3. **Se falhou:** Ver troubleshooting em [WEBHOOK_TEST_LOCAL.md](WEBHOOK_TEST_LOCAL.md)

**Tempo:** ~5 minutos

---

### 👨‍💻 Desenvolvedor - Staging/Produção

**Objetivo:** Configurar webhook no ambiente real

1. **Setup ngrok** ou usar domínio real ([WEBHOOK_CONFIG_PANEL.md](WEBHOOK_CONFIG_PANEL.md))
2. **Configurar webhook URL** no painel Banco EFI
3. **Testar** com QR Code de verdade
4. **Monitorar logs** e webhooks recebidos

**Tempo:** ~15 minutos

---

### 🔍 DevOps / Infraestrutura

**Objetivo:** Manter webhook funcionando em produção

1. Leia: [WEBHOOK_PIX_SETUP.md](WEBHOOK_PIX_SETUP.md) - Seção "Checklist Produção"
2. Configure:
   - HTTPS com certificado válido
   - Rate limiting
   - Retry logic (já implementado)
   - Logs centralizados
3. Monitore:
   - Status do endpoint `/api/webhook`
   - Erros 5xx
   - Latência de resposta

**Documentação:** [WEBHOOK_PIX_SETUP.md](WEBHOOK_PIX_SETUP.md) - Production Checklist

---

## 🗂️ Estrutura de Arquivos

### Código

```
app/api/
├── webhook/
│   └── route.ts              # Receptor de webhooks
├── pix/
│   └── route.ts              # Gerador de QR Code
└── transactions/
    └── [txId]/
        └── route.ts          # Status da transação

lib/
├── database.ts               # SQLite CRUD
├── webhookUtils.ts           # Validação de assinatura
├── transactionService.ts     # Lógica de negócio
└── pixService.ts             # Serviços PIX
```

### Documentação

```
WEBHOOK_PIX_SETUP.md         # 📘 Técnico - Arquitetura completa
WEBHOOK_TEST_LOCAL.md        # 🧪 Testes locais detalhados
WEBHOOK_CONFIG_PANEL.md      # 🔧 Configuração no painel
QUICK_START_WEBHOOK.md       # 🚀 Teste rápido em 60 seg
WEBHOOK_DOCS_INDEX.md        # 📖 Você está aqui!
```

---

## 🔄 Fluxo de Trabalho Recomendado

```
┌─────────────────────────────────────────────────────┐
│ 1. DESENVOLVEDOR TESTA LOCALMENTE                   │
│    npm run test:webhook                             │
│    (deve passar 5/5 testes)                         │
└────────────────┬────────────────────────────────────┘
                 │
                 ✅ Passou?
                 │
         ┌───────▼──────────┐
         │                  │
         ✅ SIM            ❌ NÃO
         │                 │
    ┌────▼─────┐      ┌────▼──────────────┐
    │ Prosseguir│      │ Ver troubleshooting
    │           │      │ WEBHOOK_TEST_LOCAL
    └────┬─────┘      └───────────────────┘
         │
         │
    ┌────▼──────────────────────────────────┐
    │ 2. CONFIGURAR WEBHOOK NO BANCO EFI    │
    │    (WEBHOOK_CONFIG_PANEL.md)          │
    │    - ngrok ou domínio real            │
    │    - URL: /api/webhook                │
    └────┬───────────────────────────────────┘
         │
         │
    ┌────▼──────────────────────────────────┐
    │ 3. TESTAR COM QRCODE REAL             │
    │    - Gerar novo QR Code               │
    │    - Verificar confirmação            │
    │    - Checar webhook logs              │
    └────┬───────────────────────────────────┘
         │
         │
    ┌────▼──────────────────────────────────┐
    │ 4. GO LIVE! 🚀                        │
    │    - Monitorar estatísticas           │
    │    - Verificar logs                   │
    │    - Alertas de erro                  │
    └──────────────────────────────────────┘
```

---

## 🧪 Testes Incluídos

### Script Automatizado (`npm run test:webhook`)

```
✅ Teste 1: Webhook com assinatura válida
✅ Teste 2: Webhook com assinatura inválida (rejeição)
✅ Teste 3: Webhook sem assinatura (rejeição)
✅ Teste 4: Status do webhook
✅ Teste 5: Rastreamento de transação
```

**Resultado esperado:** 5/5 passando

### Testes Manuais

- cURL
- PowerShell (Windows)
- Insomnia / Postman
- Teste no painel Banco EFI

**Detalhes:** `WEBHOOK_TEST_LOCAL.md`

---

## 🔐 Segurança

### Validação de Assinatura

```typescript
// HMAC-SHA256 com timing-safe comparison
validateWebhookSignature(
  headerSignature,
  requestBody,
  clientSecret
)
```

- ✅ Implementado em `lib/webhookUtils.ts`
- ✅ Previne timing attacks
- ✅ Valida integridade da mensagem

### Checklist de Segurança

- [ ] HTTPS com certificado válido
- [ ] IP whitelist (se disponível)
- [ ] Rate limiting configurado
- [ ] Logs auditados
- [ ] Senhas em variáveis de ambiente
- [ ] Banco de dados com encryption

**Detalhes:** `WEBHOOK_PIX_SETUP.md` - Seção Security

---

## 📊 Estatísticas e Monitoramento

### Endpoints Disponíveis

**GET `/api/webhook`** - Retorna estatísticas

```json
{
  "status": "operational",
  "statistics": {
    "pending_transactions": 3,
    "confirmed_transactions": 15,
    "webhook_events_processed": 18
  }
}
```

**GET `/api/transactions/:txId`** - Status da transação

```json
{
  "txId": "tx_123456",
  "status": "confirmed",
  "amount": 35.00,
  "confirmedAt": "2024-01-15T10:30:00Z"
}
```

---

## 🆘 Troubleshooting Index

| Problema | Documento | Seção |
|----------|-----------|-------|
| Testes falhando | WEBHOOK_TEST_LOCAL.md | Troubleshooting |
| Webhook não recebido | WEBHOOK_CONFIG_PANEL.md | Troubleshooting |
| Erro de assinatura | WEBHOOK_PIX_SETUP.md | Security |
| Banco de dados locked | WEBHOOK_TEST_LOCAL.md | Troubleshooting |
| Timeout no webhook | WEBHOOK_PIX_SETUP.md | Error Handling |

---

## 📝 Convenções do Projeto

### Variáveis de Ambiente

```bash
# Banco EFI - Homolog
EFI_HOMOLOG_CLIENT_ID=Client_id_...
EFI_HOMOLOG_CLIENT_SECRET=Client_Secret_...

# Banco EFI - Produção
EFI_PROD_CLIENT_ID=Client_id_...
EFI_PROD_CLIENT_SECRET=Client_Secret_...

# PIX
NEXT_PUBLIC_PIX_KEY=chave@seubanco

# Webhook (opcional)
EFI_WEBHOOK_SECRET=secret_key
```

### Estrutura de Banco de Dados

```sql
-- Transações PIX
pix_transactions
├── txid (PRIMARY KEY)
├── amount, status (pending|confirmed|failed)
├── payer_cpf, payer_email, payer_name
└── created_at, expires_at

-- Eventos de Webhook
webhook_events
├── id (PRIMARY KEY)
├── tx_id (FOREIGN KEY)
├── event_type, status
└── created_at

-- Clientes
customers
├── id (PRIMARY KEY)
├── email, cpf, phone
├── subscription_status, subscription_expires_at
└── created_at, updated_at
```

---

## 🚀 Deploy Checklist

- [ ] Todos os testes passam (`npm run test:webhook`)
- [ ] Variáveis de ambiente configuradas
- [ ] Certificado SSL válido
- [ ] Webhook URL configurada no Banco EFI
- [ ] Logs centralizados configurados
- [ ] Alertas de erro configurados
- [ ] Backup de banco de dados planejado
- [ ] Documentação atualizada

---

## 📞 Contatos e Links

- **Banco EFI** https://www.gerencianet.com.br
- **Documentação Banco EFI** https://gerencianet.com.br/docs
- **ngrok** https://ngrok.com
- **Seu Suporte** (configurar com time)

---

## 📈 Próximos Passos Recomendados

### Fase 3: Email Notifications
- [ ] Enviar confirmação por email
- [ ] Template de confirmação de pagamento
- [ ] Notificação para admin

### Fase 4: Admin Dashboard
- [ ] Ver transações confirmadas
- [ ] Estatísticas de receita
- [ ] Gerenciar reembolsos

### Fase 5: Reembolsos
- [ ] Processar devolução de pagamento
- [ ] Cancelar subscription

---

**Versão:** 1.0  
**Última atualização:** 2024-01-15  
**Status:** ✅ Completo e Testado

Precisa de ajuda? Comece com [QUICK_START_WEBHOOK.md](QUICK_START_WEBHOOK.md)!
