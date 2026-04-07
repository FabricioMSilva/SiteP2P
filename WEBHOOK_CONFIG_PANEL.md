# 🔧 Configurar Webhook no Banco EFI

## 📋 Pré-requisitos

- ✅ Conta Banco EFI criada
- ✅ Webhook já testado localmente (`npm run test:webhook`)
- ✅ Domínio/URL públicos configurados
- ✅ Certificado SSL válido (obrigatório)

---

## 🌐 Para Ambiente de Desenvolvimento

Se estiver testando em **desenvolvimento** (localhost), use:

### Opção 1: ngrok (Recomendado)

**ngrok** expõe seu servidor local para a internet com um URL público.

#### 1️⃣ Instalar ngrok

**Windows:**
```powershell
# Via Chocolatey
choco install ngrok

# Ou baixar direto
# https://ngrok.com/download
```

**macOS:**
```bash
brew install ngrok
```

**Linux:**
```bash
# https://ngrok.com/download
sudo apt-get install ngrok
```

#### 2️⃣ Autenticar ngrok

1. Criar conta: https://dashboard.ngrok.com/signup
2. Copiar seu Auth Token
3. Executar:

```bash
ngrok config add-authtoken <seu-token>
```

#### 3️⃣ Expor seu servidor

```bash
# Em um novo terminal:
ngrok http 3000

# Saída esperada:
# Forwarding   https://abc123.ngrok.io -> http://localhost:3000
```

Copie o URL `https://abc123.ngrok.io` - este é seu webhook URL público!

#### 4️⃣ URL do webhook para Banco EFI

```
https://abc123.ngrok.io/api/webhook
```

---

## 📲 Configurar no Painel Banco EFI

### 1️⃣ Acessar Painel

1. Ir para: https://www.gerencianet.com.br
2. Fazer login com suas credenciais
3. Menu **Configurações** → **Integrações** (ou **Webhooks**)

### 2️⃣ Adicionar Novo Webhook

1. Clicar em **+ Adicionar Webhook** ou **Nova Integração**

2. Preencher formulário:

   | Campo | Valor |
   |-------|-------|
   | **URL do Webhook** | `https://seu-dominio.com/api/webhook` |
   | **Métodos** | `POST` |
   | **Eventos** | PIX / pix.received / pix.qr_code |
   | **Status** | ✅ Ativo |
   | **Validação** | HMAC-SHA256 (se disponível) |

3. **Salvar**

### 3️⃣ Verificar Configuração

Após salvar, você verá:

```
✅ Webhook configurado com sucesso
URL: https://seu-dominio.com/api/webhook
Status: ATIVO
Eventos: pix.received
```

---

## 🧪 Testar Webhook no Painel

Muitos provedores permitem enviar webhook de teste:

1. No painel do webhook, procure por **"Test"** ou **"Enviar Teste"**
2. Clique para enviar webhook de teste
3. Veja logs de resposta

**Resposta esperada:**
```
Status: 200 OK
Resposta: {"success": true, "message": "Pagamento confirmado"}
```

---

## 📊 Monitorar Webhooks

No painel Banco EFI, você pode ver:

- ✅ Webhooks enviados (com sucesso)
- ❌ Webhooks falhados (com motivo)
- ⏱️ Tentativas de retransmissão
- 📜 Histórico completo

**Dicas:**
- Se falhar, o Banco EFI tentará reenviar até 5 vezes
- Verificar erros HTTP 4xx vs 5xx
- Ver logs do servidor: `npm run dev` com saída de console

---

## 🔐 Segurança

### Verificar Assinatura

Seu webhook valida assinatura automaticamente:

```typescript
// Em lib/webhookUtils.ts
validateWebhookSignature(signature, body, clientSecret)
// Retorna true/false
```

### IP Whitelist (Opcional)

Se Banco EFI oferece, adicione aos seus firewalls:

- API IPs do Banco EFI
- IPs dos servidores de webhook Banco EFI

Solicitar lista ao suporte.

---

## 🚨 Troubleshoot - Webhook Não Está Sendo Recebido

| Problema | Solução |
|----------|---------|
| **URL retorna 404** | URL digitada errado no painel |
| **URL retorna 500** | Erro no servidor (ver logs com `npm run dev`) |
| **URL retorna 401** | Assinatura inválida (verificar `EFI_WEBHOOK_SECRET`) |
| **Timeout (408)** | Servidor lento, aumentar timeout |
| **SSL Certificate Error** | Certificado inválido (usar HTTPS válido) |
| **Nenhum webhook recebido** | Webhook não ativado no painel |

### Debug com Logs

```bash
# Terminal rodando servidor
npm run dev

# Você verá no console:
# [Webhook] POST /api/webhook recebido
# [Webhook] Assinatura válida ✓
# [Webhook] Transação confirmada
```

---

## 📝 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/pix` | POST | Gera QR Code para pagamento |
| `/api/webhook` | POST | Recebe confirmação de pagamento |
| `/api/webhook` | GET | Retorna estatísticas |
| `/api/transactions/:txId` | GET | Rastreia status da transação |

---

## 🔄 Fluxo Completo

```
1. Cliente clica em plano (ex: "7 Dias - R$ 35")
   ↓
2. Modal abre com QR Code gerado via /api/pix
   ↓
3. Cliente escaneia QR Code com app de banco
   ↓
4. Cliente confirma pagamento no app do banco
   ↓
5. Banco EFI envia webhook POST para /api/webhook
   ↓
6. Servidor valida assinatura
   ↓
7. Transação é marcada como "confirmada"
   ↓
8. Cliente é criado/atualizado no banco de dados
   ↓
9. Subscription é ativada (data de expiração setada)
   ↓
10. ✅ Cliente tem acesso ao IPTV!
```

---

## 🎯 Checklist de Configuração

- [ ] ngrok instalado e rodando (se desenvolvimento)
- [ ] URL do webhook obtida
- [ ] Painel Banco EFI acessível
- [ ] Webhook adicionado ao painel
- [ ] URL digitada corretamente
- [ ] Status webhook = ATIVO
- [ ] Eventos selecionados (pix.received)
- [ ] Teste de webhook passou (200 OK)
- [ ] Logs mostrando recebimento
- [ ] Certificado SSL válido (HTTPS)

---

## 🆘 Suporte

Se webhook ainda não funcionar:

1. **Verificar logs do servidor:**
   ```bash
   npm run dev
   # Ver mensagens de webhook no console
   ```

2. **Testar localmente:**
   ```bash
   npm run test:webhook
   # Deve passar 5/5 testes
   ```

3. **Contatar Banco EFI:**
   - Email: suporte@gerencianet.com.br
   - Documentação: https://gerencianet.com.br/docs

4. **Verificar .env.local:**
   ```
   EFI_HOMOLOG_CLIENT_SECRET=seu_secret_aqui
   ```

---

## 📚 Referências

- Documentação Banco EFI: https://gerencianet.com.br/docs
- Documentação ngrok: https://ngrok.com/docs
- Código webhook: [lib/webhookUtils.ts](lib/webhookUtils.ts)
- Testes webhook: [WEBHOOK_TEST_LOCAL.md](WEBHOOK_TEST_LOCAL.md)
