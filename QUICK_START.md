## 🚀 Guia Rápido de Início

### 1️⃣ Instalação
```bash
npm install
```

### 2️⃣ Desenvolvimento
```bash
npm run dev
```
Acesse: `http://localhost:3000`

### 3️⃣ Build para Produção
```bash
npm run build
npm start
```

---

## ⚙️ Configurações Rápidas

### Mudar Número do WhatsApp
Arquivo: `components/CTA.tsx`
```typescript
const whatsappNumber = 'SEU_NUMERO';
```

### Mudar Cores
Arquivo: `tailwind.config.js`
```javascript
purple: { iptv: '#6A0DAD' },
yellow: { iptv: '#FFD700' },
```

### Atualizar Textos
- `components/Header.tsx` - Slogan
- `components/ServiceExplanation.tsx` - Descrição
- `components/Footer.tsx` - Contato

---

## 📦 Estrutura de Pastas
```
siteiptv/
├── app/              # Página principal
├── components/       # Componentes reutilizáveis
├── package.json      # Dependências
└── README.md         # Documentação
```

---

## 💡 Dicas
- Use `md:` para estilos mobile-first no Tailwind
- Todos os componentes têm comentários explicativos
- Customize as cores em apenas um lugar (tailwind.config.js)
