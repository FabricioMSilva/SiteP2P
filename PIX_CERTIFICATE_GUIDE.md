# 🔐 INSTRUÇÕES - Certificado P12 e Chave PIX

## 📁 Colocando o Certificado P12

### 1️⃣ Localizar seus certificados

O Banco EFI forneceu 2 certificados:
- **Produção**: `producao-825472-IPtv.p12`
- **Homologação**: Pode ser um arquivo similar ou gerado no teste

### 2️⃣ Colocar na pasta certs

Crie a estrutura de pastas:

```
seu-projeto/
├── app/
├── components/
├── certs/                      ← Criar esta pasta
│   ├── producao-825472-IPtv.p12
│   └── homolog-825472-IPtv.p12 (opcional - para testes)
├── .env.local
└── package.json
```

### 3️⃣ Verificar Permissões

No Windows (PowerShell com Admin):
```powershell
# Ver proprietário do arquivo
Get-Item -Path ".\certs\producao-825472-IPtv.p12" | Format-List FullName, Owner

# Se precisar dar permissão:
icacls ".\certs\producao-825472-IPtv.p12" /grant:r "%USERNAME%":F
```

No Mac/Linux:
```bash
# Dar permissão de leitura
chmod 600 ./certs/producao-825472-IPtv.p12
chmod 600 ./certs/homolog-825472-IPtv.p12
```

---

## 💳 Configurando a Chave PIX

### 1️⃣ Qual Chave PIX Usar?

A **chave PIX** é aquela que você usa para RECEBER dinheiro. Pode ser:
- 📱 **Telefone**: `11999999999`
- 📧 **Email**: `seu.email@seumail.com`
- 🆔 **CPF**: `12345678900` (pessoa física)
- 🆔 **CNPJ**: `12345678000100` (pessoa jurídica)
- 🔀 **Aleatória**: gerada pelo banco

### 2️⃣ Registrar Chave PIX no Banco EFI

Se NÃO tiver ainda, acesse:
1. [EFI Bank - Painel de Controle](https://www.gerencianet.com.br/login)
2. Vá para: **Configurações > PIX > Minhas Chaves**
3. Clique em **Adicionar Chave PIX**
4. Escolha o tipo (telefone, email, CPF ou aleatória)
5. Copie a chave registrada

### 3️⃣ Colocar no .env.local

```env
# 💳 CHAVE PIX (A chave que você registrou acima)
NEXT_PUBLIC_PIX_KEY=11999999999
# ou
NEXT_PUBLIC_PIX_KEY=seu.email@seumail.com
# ou
NEXT_PUBLIC_PIX_KEY=12345678900
# ou
NEXT_PUBLIC_PIX_KEY=00000000-0000-0000-0000-000000000000 (aleatória)
```

---

## ✅ Validar Configuração

### Testar via Terminal

1. **Certifique-se que o servidor está rodando**:
```bash
npm run dev
```

2. **Em outro terminal, execute o teste**:
```bash
npm run test:pix
```

### Resultado Esperado

✅ Se tudo está certo, você verá:
```
══════════════════════════════════════════
  Verificando Configuração de Ambiente
══════════════════════════════════════════

✅ NEXT_PUBLIC_EFI_ENV: homolog
✅ EFI_HOMOLOG_CLIENT_ID: Client_id...95536b4
✅ EFI_HOMOLOG_CLIENT_SECRET: Client_Se...3c7c
✅ NEXT_PUBLIC_PIX_KEY: 11999999999
✅ NEXT_PUBLIC_COMPANY_CITY: São Paulo

══════════════════════════════════════════
  Testando Geração de QR Code PIX
══════════════════════════════════════════

📱 Testando: 15 dias - R$ 20...
✅ Sucesso!
   Valor: R$ 20
   TxId: 1712449890000abc123
   ...
```

---

## 🧪 Testar no Navegador

### 1️⃣ Abrir seu site

Navigate para: `http://localhost:3000`

### 2️⃣ Clicar em um Plano

Por exemplo: **30 dias - R$ 35**

### 3️⃣ Aguardar Modal PIX

A modal deve aparecer com:
- ✅ Imagem do QR Code
- ✅ Código para copia-cola
- ✅ Timer de expiração
- ✅ Instruções

### 4️⃣ Copiar ou Escanear

**Para TESTE (Homologação)**:
- Use o app do Banco EFI de sandbox
- Ou simule um pagamento no painel da EFI

**Para PRODUÇÃO**:
- Use seu app de banco real
- Pague o PIX como um cliente faria

---

## 🚨 Solução de Problemas

### "Certificado não encontrado"

```
❌ ENOENT: no such file or directory, open './certs/producao-825472-IPtv.p12'
```

✅ **Solução**: 
- Verificar se o arquivo existe em `./certs/`
- Verificar o nome exato do arquivo
- Usar caminho absoluto se necessário

### "Erro de autenticação"

```
❌ Autenticação falhou: invalid_client
```

✅ **Solução**:
- Verifique Client ID e Secret no `.env.local`
- Confirme que está usando a versão correta (Homolog ou Produção)
- Verifique se a chave PIX está registrada no Banco EFI

### "Chave PIX inválida"

```
❌ Falha ao gerar QR Code: Chave PIX incorreta
```

✅ **Solução**:
- Use a chave PIX completa e correta
- Certifique-se que está registrada no Banco EFI
- Tente registrar uma nova chave se tiver dúvida

### "Timeout na API"

```
❌ Erro: socket hang up
```

✅ **Solução**:
- Verificar conexão com internet
- Confirmar que o Banco EFI está online
- Tentar novamente em alguns minutos

---

## 📚 Referências

- [Banco EFI - Documentação PIX](https://dev.efipay.com.br/docs/pix)
- [Banco EFI - Credenciais](https://www.gerencianet.com.br)
- [Como registrar chave PIX](https://www.bcb.gov.br/estabilidadefinanceira/pix)
- [App Teste EFI](https://gerencianet.com.br)

---

## ✨ Próximas Etapas

1. **Confirmar que o PIX está funcionando** com `npm run test:pix`
2. **Testar no navegador** clicando em um plano
3. **Configurar webhook** para confirmar pagamentos (próximo passo)
4. **Ativar acesso automático** após pagamento confirmado

---

**Dúvidas?** Consulte a [documentação oficial do Banco EFI](https://dev.efipay.com.br)
