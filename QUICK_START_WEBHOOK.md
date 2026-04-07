# 🚀 Quick Start - Webhook Testing

## 60 Segundos para Testar seu Webhook

### Terminal 1: Inicie o servidor

```bash
npm run dev

# Aguarde aparecer:
# ▲ Next.js 14.0.0
# - Local:        http://localhost:3000
```

### Terminal 2: Rode os testes

```bash
npm run test:webhook

# Aguarde a saída:
# ═══════════════════════════════════════════════
#   Teste 1: Webhook com Assinatura Válida
# ...
# 5/5 testes passaram
# 🎉 Todos os testes passaram!
```

---

## ✅ Se todos os testes passaram

🎉 Seu webhook está funcionando! Próximos passos:

1. **Abra o guia de configuração:**
   - [WEBHOOK_CONFIG_PANEL.md](WEBHOOK_CONFIG_PANEL.md)

2. **Configure webhook URL no Banco EFI:**
   - Com ngrok: `https://abc123.ngrok.io/api/webhook`
   - Com seu domínio: `https://seu-dominio.com/api/webhook`

3. **Teste com pagamento de verdade** no Modal do site

---

## ❌ Se algum teste falhou

Veja o troubleshooting em [WEBHOOK_TEST_LOCAL.md](WEBHOOK_TEST_LOCAL.md#-troubleshooting)

**Problemas comuns:**

| Erro | Solução |
|------|---------|
| **Teste 1 falhou** | Verificar `EFI_HOMOLOG_CLIENT_SECRET` em `.env.local` |
| **Teste 2 falhou** | Validação de assinatura com falha |
| **Teste 4 falhou** | Servidor não está rodando em localhost:3000 |
| **Todos falharam** | Servidor não iniciou (`npm run dev`) |

---

## 📊 Verificar Dados no Banco de Dados

Após teste bem-sucedido, veja os dados criados:

```bash
# Ver transações
sqlite3 data/transactions.db "SELECT txid, status, amount FROM pix_transactions;"

# Ver webhooks processados
sqlite3 data/transactions.db "SELECT event_type, status FROM webhook_events;"

# Ver clientes criados
sqlite3 data/transactions.db "SELECT email, subscription_status FROM customers;"
```

---

## 🎯 Fluxo Completo

```
Dev Local                  Servidor                    Banco EFI
   ↓                          ↓                            ↓
npm run dev          ← inicia servidor Next.js
   ↓
npm run test:webhook ← faz POST para /api/webhook
                             ↓
                      valida assinatura HMAC
                             ↓
                      cria transação no DB
                             ↓
                      retorna 200 OK
   ↓
✅ Teste passa
```

---

## 📚 Documentação Completa

- **Testes Detalhados**: [WEBHOOK_TEST_LOCAL.md](WEBHOOK_TEST_LOCAL.md)
- **Configuração no Painel**: [WEBHOOK_CONFIG_PANEL.md](WEBHOOK_CONFIG_PANEL.md)
- **Arquitetura**: [WEBHOOK_PIX_SETUP.md](WEBHOOK_PIX_SETUP.md)
- **Debug**: Ver console com `npm run dev`

---

**Seu webhook está pronto! 🚀**
