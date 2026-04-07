# 💜 Integração PIX com Banco EFI

## 📋 Visão Geral

Este arquivo documenta como usar o sistema de pagamento PIX com QR Code que foi implementado no seu projeto IPTV.

---

## ✨ Funcionalidades Implementadas

### 1. **Modal de Pagamento PIX**
- Modal moderno com animações suaves
- Exibição de QR Code
- Campo "Copia e Cola" com botão para copiar automaticamente
- Instruções passo-a-passo para o usuário

### 2. **API de Geração de QR Code**
- Endpoint: `POST /api/pix/generate`
- Gera QR Code em base64
- Cria chave PIX para pagamento
- Suporte para valores customizados

### 3. **Planos Clicáveis**
- Cada plano (15, 30, 60, 180, 360 dias) é clicável
- Abre automaticamente o modal de pagamento com o valor correspondente

---

## 🔧 Como Usar (Desenvolvimento)

### Versão Simulada (Atual)
Atualmente, o sistema está gerando QR Codes simulados para fins de demonstração. Para testar:

```bash
# 1. Inicie o servidor
npm run dev

# 2. Clique em qualquer plano de assinatura
# 3. O modal abrirá com um QR Code simulado
# 4. Você poderá copiar o código PIX
```

---

## 🚀 Integração com Banco EFI (Produção)

### Passo 1: Cadastre-se no Banco EFI

1. Acesse: https://efipay.com.br
2. Crie sua conta de pessoa jurídica
3. Configure seus dados bancários
4. Gere uma chave PIX (CPF, Email, Telefone ou Aleatória)

### Passo 2: Obtenha as Credenciais

1. Vá para o painel do Banco EFI
2. Navegue até: **API** → **Credenciais**
3. Copie:
   - **Client ID**
   - **Client Secret**
   - **Certificado de Segurança** (arquivo .pem)

### Passo 3: Configure Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Banco EFI - PIX
NEXT_PUBLIC_EFI_CLIENT_ID=seu_client_id_aqui
NEXT_PUBLIC_EFI_CLIENT_SECRET=seu_client_secret_aqui
NEXT_PUBLIC_EFI_SANDBOX=true
NEXT_PUBLIC_PIX_KEY=sua_chave_pix_aqui
```

### Passo 4: Instale o SDK do Banco EFI

```bash
npm install gn-api-sdk-typescript
# ou
yarn add gn-api-sdk-typescript
```

### Passo 5: Atualize a API Route

Edite o arquivo `app/api/pix/generate.ts` e descomente a seção com o código real:

```typescript
import GnPayments from 'gn-api-sdk-typescript';

const api = new GnPayments({
  client_id: process.env.NEXT_PUBLIC_EFI_CLIENT_ID!,
  client_secret: process.env.NEXT_PUBLIC_EFI_CLIENT_SECRET!,
  sandbox: process.env.NEXT_PUBLIC_EFI_SANDBOX === 'true',
});

// Gerar QR Code PIX (descomente e use)
const response = await api.pixCreateQrCode({
  // ... configurações
});
```

### Passo 6: Teste em Sandbox

```bash
# O sistema funcionará em modo de teste
npm run dev

# Teste com valores reais (não será cobrado)
```

### Passo 7: Publique em Produção

1. Altere `NEXT_PUBLIC_EFI_SANDBOX=false`
2. Deploy da aplicação
3. Agora os pagamentos PIX reais serão processados

---

## 📁 Estrutura Criada

```
components/
├── PixModal.tsx              # Modal de pagamento PIX
└── Header.tsx                # Atualizado com planos clicáveis

app/api/
└── pix/
    └── generate.ts           # API para gerar QR Code

lib/
└── pixUtils.ts               # Utilitários para PIX

types/
└── index.ts                  # Tipos adicionados (Plan, PixData)

.env.example                  # Atualizado com variáveis EFI
```

---

## 🎨 Customizações do Modal

### Alterar Cores
Edite `components/PixModal.tsx`:
```tsx
// Gradiente do header
<div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl text-white">

// Mudar para:
<div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl text-white">
```

### Alterar Tempo de Expiração
Edite `app/api/pix/generate.ts`:
```typescript
// Padrão: 3600 segundos (1 hora)
const { amount, description = 'Assinatura IPTV', expiresIn = 3600 } = body;

// Mudar para 30 minutos:
expiresIn = 1800
```

### Adicionar Logotipo no Modal
```tsx
// No componente PixModal.tsx, após o header:
<div className="p-6 space-y-6">
  <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto" />
  {/* resto do conteúdo */}
</div>
```

---

## 🔐 Segurança

⚠️ **IMPORTANTE:**

1. **Nunca exponha** suas credenciais do Banco EFI
2. **Client Secret** deve estar apenas em variáveis de servidor (não em `NEXT_PUBLIC_*`)
3. Use **HTTPS** em produção
4. Valide sempre os valores no servidor
5. Implemente verificação de webhook para confirmar pagamentos

**Melhor Prática - Variáveis Seguras:**

```env
# .env.local (NÃO COMITE ISSO)
EFI_CLIENT_SECRET=seu_secret_seguro_aqui  # Sem NEXT_PUBLIC_
NEXT_PUBLIC_EFI_CLIENT_ID=seu_client_id   # Público
```

---

## 📞 Suporte

### Documentação Oficial
- Banco EFI PIX: https://efipay.com.br/docs
- SDK TypeScript: https://github.com/gn-payments/gn-api-sdk-typescript

### Troubleshooting

**Erro: "Biblioteca QRCode não disponível"**
```bash
npm install qrcode
```

**Erro: "SDK do Banco EFI não encontrado"**
```bash
npm install gn-api-sdk-typescript
```

**QR Code não aparece**
- Verifique se a biblioteca `qrcode` está instalada
- Confirme se o valor é > 0
- Verifique os logs de erro no console

---

## 🎯 Próximos Passos

1. ✅ Modal criado
2. ✅ API de geração configurada
3. ✅ Planos clicáveis implementados
4. ⬜ Integração com Banco EFI (guia acima)
5. ⬜ Sistema de webhooks para confirmação de pagamento
6. ⬜ Dashboard de status de pagamentos
7. ⬜ Envio de email de confirmação

---

## 💡 Exemplos de Resposta da API

### Sucesso
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",
    "pixKey": "00020126580014br.gov.bcb.pix...",
    "amount": 20,
    "description": "Assinatura IPTV 15 dias",
    "expiresIn": 3600
  }
}
```

### Erro
```json
{
  "success": false,
  "error": "Valor inválido"
}
```

---

**Desenvolvido com ❤️ para seu sistema IPTV**
