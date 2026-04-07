# 🎯 Guia de Teste - Sistema PIX

## 🚀 Como Testar Localmente

### 1. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:3000`

### 2. Localize os Planos de Assinatura

Na página inicial, você verá um card com os planos:
- 15 dias - R$ 20
- 30 dias - R$ 35
- 60 dias - R$ 60
- 180 dias - R$ 150
- 360 dias - R$ 250

### 3. Clique em um Plano

Clique em qualquer plano de assinatura. Um modal abrirá mostrando:

- ✅ **QR Code PIX** gerado dinamicamente
- ✅ **Chave PIX** (formato copia e cola)
- ✅ **Valor** a pagar
- ✅ Botão para **copiar a chave**
- ✅ Instruções de pagamento

### 4. Teste a Cópia de Chave

- Clique no botão "📋 Copiar"
- O botão mudará para "✅ Copiado!"
- Após 2 segundos, retorna ao estado normal

### 5. Feche o Modal

Clique no botão "Fechar" ou na área fora do modal para fechá-lo.

---

## 📁 Arquivos Criados/Modificados

### Novos Arquivos

1. **`components/PixModal.tsx`**
   - Modal completo com QR Code e chave PIX

2. **`app/api/pix/generate.ts`**
   - API para gerar QR Code e chave PIX

3. **`lib/pixUtils.ts`**
   - Utilitários para gerar QR Codes

4. **`PIX_INTEGRATION.md`**
   - Guia de integração com Banco EFI

### Arquivos Modificados

1. **`components/Header.tsx`**
   - Adicionados estados para o modal PIX
   - Planos agora são botões clicáveis

2. **`types/index.ts`**
   - Adicionados tipos: `Plan`, `PixData`, `ApiPixResponse`

3. **`.env.example`**
   - Adicionadas variáveis para Banco EFI

4. **`package.json`**
   - Nova dependência: `qrcode`

---

## 🧪 Testando a API Manualmente

### Usando curl

```bash
curl -X POST http://localhost:3000/api/pix/generate \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 20,
    "description": "Plano 15 dias"
  }'
```

### Resposta Esperada

```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KG...",
    "pixKey": "00020126580014br.gov.bcb.pix...",
    "amount": 20,
    "description": "Plano 15 dias",
    "expiresIn": 3600
  }
}
```

---

## 🎨 Personalizações Rápidas

### Mudar Cor do Modal

**Arquivo:** `components/PixModal.tsx`

**Linha ~45:** Mudar a cor do gradiente
```tsx
// De:
className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl text-white"

// Para (verde):
className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl text-white"
```

### Adicionar Logo

**Arquivo:** `components/PixModal.tsx`

**Após linha ~45:**
```tsx
<div className="flex items-center justify-between">
  <div>
    <h2 className="text-2xl font-bold mb-2">💜 Pagamento PIX</h2>
    <p className="text-purple-100">Plano: {plan.dias} dias</p>
  </div>
  <img src="/logo-small.png" alt="Logo" className="w-12 h-12" />
  {/* ... */}
</div>
```

### Mudar Instrução de Pagamento

**Arquivo:** `components/PixModal.tsx`

**Linha ~175:** Editar as instruções
```tsx
<ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
  <li>Suas instruções aqui</li>
  <li>Próximo passo</li>
  {/* ... */}
</ol>
```

---

## 🔍 Troubleshooting

### ❌ Erro: "Gerando seu QR Code..." fica carregando infinitamente

**Solução:**
1. Verifique se o servidor está rodando: `npm run dev`
2. Abra o console (F12) e procure por erros
3. Verifique a aba Network para ver se a requisição foi feita

### ❌ Erro: "Erro ao gerar QR Code"

**Solução:**
1. O servidor pode ter caído - reinicie com `npm run dev`
2. Verifique se a biblioteca `qrcode` está instalada: `npm list qrcode`
3. Se não estiver: `npm install qrcode`

### ❌ QR Code não aparece

**Solução:**
1. Verifique se está usando valor > 0
2. Abra as ferramentas de desenvolvedor (F12)
3. Procure por erros no console
4. Verifique se a URL do QR Code começa com `data:image/`

### ❌ Botão "Copiar" não funciona

**Solução:**
1. Verifique se tem permissão para acessar clipboard (HTTPS em produção)
2. em localhost deve funcionar normalmente
3. Teste em outro navegador

---

## 📊 Fluxo de Funcionamento

```
┌─────────────────────────────────────────────────────┐
│  Usuário clica em um plano (R$ 20, 30 dias, etc)   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  PixModal.tsx abre com loading                       │
│  Envia requisição POST /api/pix/generate             │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  API route gera QR Code e chave PIX                 │
│  Retorna como base64 + textos                       │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Modal exibe QR Code, chave PIX e instruções       │
│  Usuário pode copiar a chave                        │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Próximas Melhorias Sugeridas

1. **Confirmar Pagamento**
   - Integrar webhook do Banco EFI
   - Mostrar status "Pagamento Confirmado"

2. **Histórico de Pagamentos**
   - Dashboard para ver transações anteriores

3. **Notificações**
   - Email quando pagamento for confirmado
   - WhatsApp para cliente

4. **Timeout Automático**
   - QR Code expira após X tempo
   - Gerar novo automaticamente

5. **Analytics**
   - Rastrear qual plano é mais procurado
   - Tempo médio até pagamento

---

## 📞 Precisar de Ajuda?

1. Verifique [PIX_INTEGRATION.md](./PIX_INTEGRATION.md) para integração com Banco EFI
2. Consulte os comentários no código-fonte
3. Abra as ferramentas de desenvolvedor (F12) para debug

---

**Desenvolvido com ❤️ para seu projeto IPTV**
