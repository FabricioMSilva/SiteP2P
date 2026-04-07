# 🔐 Configuração - Integração Banco EFI PIX

## 📋 Pré-requisitos

1. **Certificado P12** do Banco EFI
2. **Credenciais** (Client ID e Secret)
3. **Chave PIX** registrada no Banco EFI

---

## 🚀 Instalação e Configuração

### 1️⃣ Salvar Certificado P12

Coloque o arquivo `producao-825472-IPtv.p12` (e/ou homolog) na pasta `./certs/`:

```bash
./certs/
├── producao-825472-IPtv.p12     # Certificado de Produção
└── homolog-825472-IPtv.p12      # Certificado de Homologação (opcional)
```

### 2️⃣ Configurar Variáveis de Ambiente

O arquivo `.env.local` já foi criado com as seguintes informações:

```env
# 🔐 BANCO EFI - CONFIGURAÇÕES PIX
# ═════════════════════════════════════════

# ✏️ Ambiente (production ou homolog)
NEXT_PUBLIC_EFI_ENV=homolog

# 🏢 PRODUÇÃO
EFI_PROD_CLIENT_ID=Client_id_0d3d5bf00871d4ca2688ed4652644f1e9953b3b4
EFI_PROD_CLIENT_SECRET=Client_Secret_934ce55f1230f0ee623344f734d758e689c3c7c
EFI_PROD_CERT_PATH=./certs/producao-825472-IPtv.p12

# 🧪 HOMOLOGAÇÃO  
EFI_HOMOLOG_CLIENT_ID=Client_id_7202ee0387be4625d8a9b85373f7f9f003dbc4lc
EFI_HOMOLOG_CLIENT_SECRET=Client_Secret_b989acf373422df834265765d0ce6a3092b3cb4ff83
EFI_HOMOLOG_CERT_PATH=./certs/homolog-825472-IPtv.p12

# 💳 CHAVE PIX (Sua chave PIX registrada no Banco EFI)
NEXT_PUBLIC_PIX_KEY=sua-chave-pix@seubanco

# 📱 DADOS DA EMPRESA
NEXT_PUBLIC_COMPANY_NAME=IPTV Brasil
NEXT_PUBLIC_COMPANY_CITY=São Paulo
NEXT_PUBLIC_COMPANY_STATE=SP
```

### 3️⃣ Instalar Dependências

As dependências já foram instaladas:

```bash
npm install
```

---

## 🧪 Testando a Integração

### Via API Route Direta

```bash
curl -X POST http://localhost:3000/api/pix \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 20,
    "description": "Teste PIX",
    "plan": "monthly"
  }'
```

### Resposta Esperada

```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",
    "pixKey": "00020126580014...",
    "copyPaste": "00020126580014...",
    "amount": 20,
    "description": "Teste PIX",
    "expiresAt": "2026-04-06T23:31:30.000Z",
    "txId": "1712449890000abc123",
    "environment": "homolog"
  }
}
```

---

## 🎨 Como Usar o Modal PIX

### No seu componente:

```tsx
'use client';
import { useState } from 'react';
import PixModal from '@/components/PixModal';

export default function PricingPage() {
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setPixModalOpen(true);
  };

  return (
    <>
      <button
        onClick={() => handlePlanClick({ dias: 30, preco: 'R$ 35' })}
      >
        Escolher Plano
      </button>

      <PixModal
        isOpen={pixModalOpen}
        onClose={() => setPixModalOpen(false)}
        plan={selectedPlan}
      />
    </>
  );
}
```

---

## 📱 Fluxo de Pagamento

```
1. Usuário clica em um plano (dias + valor)
   ↓
2. Modal PIX se abre
   ↓
3. API /api/pix é chamada com:
   - amount (valor do plano)
   - description (descrição)
   - plan (tipo de plano)
   ↓
4. Classe BancoEFIPixClient:
   - Autentica com Banco EFI
   - Recebe token de acesso
   ↓
5. Gera QR Code PIX:
   - Cria cobrador dinâmico (COB)
   - Retorna brCode (código copia-cola)
   - Retorna imagem QR Code
   ↓
6. Modal exibe:
   - Imagem do QR Code
   - Código para copia-cola
   - Timer de expiração
   - Instruções de pagamento
   ↓
7. Usuário escaneia ou copia-cola
   ↓
8. Paga via PIX no banco
   ↓
9. Webhook do Banco EFI confirma pagamento
   ↓
10. Libera acesso à assinatura
```

---

## 🔑 Usar a Chave PIX Correta

A chave PIX usada será a configurada em `NEXT_PUBLIC_PIX_KEY`.

Para **Produção**, use sua chave PIX real.
Para **Homologação/Testes**, você pode usar qualquer chave (não precisa ser real).

---

## 🚨 Solução de Problemas

### "Credenciais não configuradas"

✅ Certifique-se que `.env.local` está no root do projeto e contém:
- `EFI_PROD_CLIENT_ID` ou `EFI_HOMOLOG_CLIENT_ID`
- `EFI_PROD_CLIENT_SECRET` ou `EFI_HOMOLOG_CLIENT_SECRET`

### "Erro ao autenticar com Banco EFI"

✅ Verifique:
- Client ID e Secret estão corretos
- Ambiente está configurado corretamente (`NEXT_PUBLIC_EFI_ENV`)
- Certificado P12 está no diretório correto (para APIs que usam mTLS)

### "Erro ao gerar QR Code"

✅ Checkpoints:
- Sua chave PIX está correta em `NEXT_PUBLIC_PIX_KEY`
- Você tem saldo/permissão para receber PIX
- A API do Banco EFI está respondendo

---

## 📚 Estrutura de Arquivos

```
app/
├── api/
│   └── pix/
│       └── route.ts          # 🔐 API Route com BancoEFIPixClient
│
components/
├── PixModal.tsx              # 💜 Modal PIX (Tema roxo)
│
lib/
├── pixService.ts             # 🎯 Serviço PIX (utilitários)
│
certs/
├── producao-825472-IPtv.p12
└── homolog-825472-IPtv.p12
│
.env.local                     # 🔐 Variáveis de Ambiente
```

---

## ✨ Recursos Principais

✅ **Integração com Banco EFI**: Acesso completo às APIs do Banco EFI  
✅ **QR Code Dinâmico**: Gera novo QR Code a cada pagamento  
✅ **Copia e Cola**: Código PIX para copiar  
✅ **Timer de Expiração**: Conta regressiva de 1 hora  
✅ **Cache de Token**: Reutiliza token por até 59 minutos  
✅ **Tratamento de Erros**: Mensagens claras em caso de falha  
✅ **Ambiente Flexível**: Suporta Production e Homologação  

---

## 🔄 Próximos Passos

1. **Webhook PIX**: Implementar rota para confirmar pagamentos
2. **Banco de Dados**: Armazenar registros de transações
3. **Notificações**: Enviar email após pagamento confirmado
4. **Dashboard**: Admin para visualizar transações
5. **Reembolsos**: Implementar devolução de PIX

---

**Dúvidas?** Consulte a [documentação do Banco EFI](https://dev.efipay.com.br)
