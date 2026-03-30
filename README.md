# IPTV Landing Page - Next.js

Uma landing page moderna e responsiva para serviço de streaming IPTV/P2P, desenvolvida em **Next.js 14** com **React 18** e **Tailwind CSS**.

## ✨ Características

- ✅ **Design Responsivo**: Otimizado para desktop, tablet e mobile
- ✅ **Paleta de Cores Profissional**: Roxo (#6A0DAD), Amarelo (#FFD700) e Branco
- ✅ **Componentes Estruturados**: Código bem organizado e comentado
- ✅ **CTA Integrado**: Botão WhatsApp com link direto
- ✅ **SEO Otimizado**: Meta tags estruturadas
- ✅ **Performance**: Otimizado com Next.js 14 e Tailwind CSS
- ✅ **Animações Suaves**: Transições e efeitos visuais polidos

## 📁 Estrutura do Projeto

```
siteiptv/
├── app/
│   ├── layout.tsx          # Layout raiz com metadados
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globais e Tailwind
├── components/
│   ├── Header.tsx          # Cabeçalho com slogan
│   ├── ServiceExplanation.tsx # Seção de funcionalidades
│   ├── CTA.tsx             # Botão WhatsApp
│   └── Footer.tsx          # Rodapé
├── package.json            # Dependências do projeto
├── tsconfig.json           # Configuração TypeScript
├── tailwind.config.js      # Configuração Tailwind CSS
├── postcss.config.js       # Configuração PostCSS
├── next.config.js          # Configuração Next.js
├── .gitignore              # Arquivos ignorados pelo Git
└── README.md               # Este arquivo
```

## 🚀 Como Começar

### 1. Instalação de Dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Executar em Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

A aplicação estará disponível em: **http://localhost:3000**

### 3. Compilação para Produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 🎨 Personalização

### Alterar Cores

Edite o arquivo `tailwind.config.js`:

```javascript
colors: {
  purple: {
    iptv: '#SEU_ROXO', // Altere aqui
  },
  yellow: {
    iptv: '#AMARELO', // e aqui
  },
}
```

### Alterar Número do WhatsApp

Edite o arquivo `components/CTA.tsx`:

```typescript
const whatsappNumber = 'SEU_NUMERO'; // Formato: 5524998344324
```

### Alterar Conteúdo

Todos os textos estão no seguinte local:
- `components/Header.tsx` - Slogan e título
- `components/ServiceExplanation.tsx` - Descrição do serviço
- `components/CTA.tsx` - Textos do botão
- `components/Footer.tsx` - Informações de rodapé

## 📱 Responsividade

O projeto é totalmente responsivo, com breakpoints para:
- **Mobile**: < 640px (classe `sm:`)
- **Tablet**: 640px-1024px (classe `md:` e `lg:`)
- **Desktop**: > 1024px (classe `xl:`)

## 🔧 Tecnologias Utilizadas

- **Next.js 14** - Framework React moderno
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Styling utilitário
- **PostCSS** - Processamento de CSS

## 📝 Componentes

### Header
Cabeçalho chamativo com:
- Slogan em destaque (amarelo)
- Descrição do serviço
- Onda decorativa SVG

### ServiceExplanation
Seção que explica:
- Ícones para Filmes, Séries e Esportes
- Descrição clara do serviço
- Benefícios adicionais

### CTA (Call To Action)
Botão destacado com:
- Link direto para WhatsApp
- Estilo hover com animação
- Informações de contato

### Footer
Rodapé com:
- Informações sobre o serviço
- Links de contato e redes sociais
- Copyright e política de privacidade

## 🎯 Dicas de Otimização

1. **Imagens**: Adicione imagens otimizadas usando o componente `Image` do Next.js
2. **SEO**: Atualize as meta tags em `app/layout.tsx`
3. **Analytics**: Integre Google Analytics ou similar
4. **PWA**: Considere adicionar suporte a Progressive Web App

## 📞 Contato e Suporte

- **WhatsApp**: (24) 99834-4324
- **Email**: contato@siteiptv.com
- **Horário**: 09:00 - 22:00

## 📄 Licença

Copyright © 2024. Todos os direitos reservados.

---

Desenvolvido com ❤️ usando Next.js
