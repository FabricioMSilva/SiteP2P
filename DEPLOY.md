# 🚀 Guia de Deploy

Este documento descreve como fazer deploy do projeto em diferentes plataformas.

## Vercel (Recomendado para Next.js)

### Passo a Passo

1. **Faça login na Vercel**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy automático**
   ```bash
   vercel
   ```

3. **Conectar repositório Git (mais fácil)**
   - Vá para [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório GitHub
   - Clique em "Deploy"

### Variáveis de Ambiente no Vercel
1. Vá ao projeto no Vercel
2. Settings → Environment Variables
3. Adicione as variáveis do `.env.example`

---

## Netlify

1. **Instale a CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build para produção**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=.next
   ```

---

## AWS Amplify

1. **Conecte seu repositório GitHub**
2. **Amplify criará um pipeline automático**
3. **Configure as variáveis de ambiente no console da AWS**

---

## Docker (Para Qualquer Servidor)

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build e Run

```bash
docker build -t siteiptv .
docker run -p 3000:3000 siteiptv
```

---

## Servidor Linux/Ubuntu Próprio

### Requisitos
- Node.js 18+
- PM2 (para manter a app ativa)

### Passo a Passo

```bash
# 1. Clone o repositório
git clone SEU_REPO

# 2. Instale dependências
cd siteiptv
npm install

# 3. Build
npm run build

# 4. Instale PM2
npm install -g pm2

# 5. Inicie a app
pm2 start npm --name "siteiptv" -- start

# 6. Configure para iniciar com o sistema
pm2 startup
pm2 save
```

### Para Configurar Domínio com Nginx

```nginx
server {
    listen 80;
    server_name seudominio.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Railway

1. Vá para [railway.app](https://railway.app)
2. Conecte seu GitHub
3. Selecione este repositório
4. Railway fará deploy automaticamente

---

## Otimizações para Produção

```bash
# 1. Build otimizado
npm run build

# 2. Teste localmente
npm start

# 3. Verifique .gitignore antes de fazer push
cat .gitignore

# 4. Faça commit
git add .
git commit -m "Deploy ready"
git push
```

---

## Monitoramento

- **Vercel**: Dashboard automático
- **Netlify**: Analytics incluído
- **Seu Servidor**: Use PM2 plus ou New Relic

---

## Troubleshooting

### Port já está em uso
```bash
# Mude a porta
PORT=3001 npm start
```

### Erro de build
```bash
# Limpe o cache
rm -rf .next node_modules
npm install
npm run build
```

---

## Domínio Customizado

Escolha uma registradora (GoDaddy, Namecheap, etc) e aponte para o IP da sua aplicação ou provedor de hosting.
