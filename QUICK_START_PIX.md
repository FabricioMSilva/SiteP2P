# 🚀 GUIA RÁPIDO - PIX Banco EFI

## ✅ O que foi feito

✅ **API Route** (`/api/pix`) com integração completa Banco EFI  
✅ **BancoEFIPixClient** - Classe para autenticação e geração de QR Code  
✅ **PixModal** - Modal roxo com QR Code, código copia-cola e timer  
✅ **pixService** - Utilitários para gerar QR Code, copiar e formatar  
✅ **Variáveis de ambiente** - `.env.local` configurado com suas credenciais  
✅ **Script de teste** - `npm run test:pix` para validar integração  
✅ **Documentação completa** - Guias de configuração passo a passo  

---

## 🔧 Passo 1: Colocar Certificado P12

📁 **Crie a pasta `certs/` na raiz do projeto e coloque**:

```
certs/
├── producao-825472-IPtv.p12      (arquivo enviado)
└── homolog-825472-IPtv.p12       (opcional - para testes)
```

**Onde baixar?** O arquivo `.p12` foi enviado por você! Apenas coloque na pasta.

---

## 🔑 Passo 2: Configurar Chave PIX

Abra `.env.local` e configure sua chave PIX:

```env
# Substitua com sua chave PIX real
NEXT_PUBLIC_PIX_KEY=sua-chave-pix@seubanco
```

**Opções de chave PIX**:
- 📱 Telefone: `11999999999`
- 📧 Email: `seu.email@seumail.com`
- 🆔 CPF: `12345678900`
- 🔀 Aleatória: `00000000-0000-0000-0000-000000000000`

---

## 🎯 Passo 3: Testar Integração

### Terminal 1 - Iniciar servidor:
```bash
npm run dev
```

### Terminal 2 - Executar testes:
```bash
npm run test:pix
```

**Esperado**: ✅ Todos os testes passam

---

## 🌐 Passo 4: Usar no Site

Seu modal PIX já está **automaticamente integrado** na página de preços!

**Para usar manualmente**:

```tsx
'use client';
import { useState } from 'react';
import PixModal from '@/components/PixModal';

export default function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Comprar Plano
      </button>
      
      <PixModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        plan={{ dias: 30, preco: 'R$ 35' }}
      />
    </>
  );
}
```

---

## 📱 Fluxo de Uso (Cliente)

```
1. Cliente clica em "Escolher Plano" (ex: 30 dias - R$ 35)
   ↓
2. Modal PIX abre com:
   - Imagem do QR Code
   - Código para copia-cola
   - Timer de 1 hora
   - Instruções
   ↓
3. Cliente pode:
   - Escanear QR Code com câmera
   - OU copiar o código e colar no app do banco
   ↓
4. Cliente faz o pagamento PIX normal
   ↓
5. Banco efi confirma (via webhook - próximo passo)
   ↓
6. Acesso ativado automaticamente
```

---

## 🧪 Ambientes

### 🧪 Homologação (Testes)

```env
NEXT_PUBLIC_EFI_ENV=homolog
# Use credenciais de homolog para testar
```

✅ Use para testar antes de ir ao vivo

### 🏢 Produção (Real)

```env
NEXT_PUBLIC_EFI_ENV=production
# Use credenciais de produção para cobrar de verdade
```

⚠️ Use apenas quando estiver 100% testado

---

## 📊 Estrutura Criada

```
app/
├── api/
│   └── pix/
│       └── route.ts              ← 🔐 API com BancoEFIPixClient

components/
├── PixModal.tsx                  ← 💜 Modal do PIX

lib/
├── pixService.ts                 ← 🎯 Serviço e utilitários

certs/
├── producao-825472-IPtv.p12
└── homolog-825472-IPtv.p12

.env.local                         ← 🔐 Variáveis sensíveis

test-pix.js                        ← 🧪 Script de teste

EFI_PIX_SETUP.md                   ← 📖 Documentação completa

PIX_CERTIFICATE_GUIDE.md           ← 🔑 Guia certificado e chave PIX
```

---

## 🔗 API Endpoint

**POST** `/api/pix`

### Request:
```json
{
  "amount": 35,
  "description": "Plano IPTV 30 dias",
  "plan": "30-days",
  "expiresIn": 3600
}
```

### Response (Sucesso):
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",
    "pixKey": "00020126580014...",
    "copyPaste": "00020126580014...",
    "amount": 35,
    "expiresAt": "2026-04-06T23:31:30Z",
    "txId": "1712449890000abc123",
    "environment": "homolog"
  }
}
```

---

## 🚨 Checklist para GO LIVE

- [ ] Certificado P12 está em `./certs/`
- [ ] Chave PIX configurada em `.env.local`
- [ ] `npm run test:pix` passa sem erros
- [ ] Modal PIX abre ao clicar em um plano
- [ ] QR Code aparece na modal
- [ ] Código copia-cola é copiável
- [ ] Timer conta regressivo funciona
- [ ] Teste de pagamento PIX real (homolog)
- [ ] Verificar logs de erro no console
- [ ] Colocar credenciais de produção antes de ir ao vivo

---

## 📞 Suporte

Se algo não funcionar:

1. **Verifique o console** do navegador (F12)
2. **Rode os testes** (`npm run test:pix`)
3. **Consulte os logs** da API
4. **Leia a documentação** (EFI_PIX_SETUP.md)

---

## 🎉 Pronto!

Seu sistema PIX está **PRONTO** para:
- ✅ Gerar QR Codes dinâmicos
- ✅ Mostrar modal bonita
- ✅ Copiar código PIX
- ✅ Receber pagamentos

**Próximos passos**:
1. Webhook para confirmar pagamentos
2. Banco de dados para rastrear transações
3. Email de confirmação
4. Dashboard admin

---

**Qualquer dúvida, consulte:**
- [EFI_PIX_SETUP.md](./EFI_PIX_SETUP.md) - Documentação técnica
- [PIX_CERTIFICATE_GUIDE.md](./PIX_CERTIFICATE_GUIDE.md) - Certificado e chave PIX
- [Documentação Banco EFI](https://dev.efipay.com.br)

**Boa sorte! 🚀**
