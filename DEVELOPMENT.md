# 💻 Guia de Desenvolvimento Local

Este documento descreve como trabalhar com o projeto localmente.

## 🛠️ Pré-requisitos

- **Node.js**: 18.17 ou superior
- **npm**: 9 ou superior (ou yarn/pnpm)
- **Git**: Para controle de versão

## 📥 Setup Inicial

```bash
# 1. Clone o repositório (ou navegue para a pasta)
cd siteiptv

# 2. Instale as dependências
npm install

# 3. Crie arquivo .env.local (opcional)
cp .env.example .env.local

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

## 📂 Estrutura de Pastas

```
siteiptv/
├── app/                     # App Router (Next.js 14)
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Página home
│   └── globals.css         # Estilos globais
│
├── components/             # Componentes React
│   ├── Header.tsx
│   ├── ServiceExplanation.tsx
│   ├── CTA.tsx
│   ├── Footer.tsx
│   ├── Button.tsx          # Componente reutilizável
│   └── Common.tsx          # Componentes base
│
├── lib/                    # Funções utilitárias
│   └── utils.ts           # Helper functions
│
├── types/                 # TypeScript types
│   └── index.ts
│
├── public/                # Arquivos estáticos (quando houver)
│   ├── favicon.ico
│   └── images/
│
└── [Arquivos de Config]
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── next.config.js
    └── postcss.config.js
```

## 🎯 Fluxo de Desenvolvimento

### Adicionar Um Novo Componente

```typescript
// components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
}

/**
 * MyComponent - Descrição do componente
 * @example
 * ```tsx
 * <MyComponent title="Exemplo" />
 * ```
 */
export default function MyComponent({ title }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-purple-iptv">{title}</h2>
    </div>
  );
}
```

### Usar o Novo Componente

```typescript
// app/page.tsx
import MyComponent from '@/components/MyComponent';

export default function Home() {
  return (
    <main>
      <MyComponent title="Meu Componente" />
    </main>
  );
}
```

## 🎨 Trabalhar com Estilos

### Estilos Tailwind

```tsx
<div className="flex items-center justify-between p-4 bg-purple-iptv text-white rounded-lg">
  <h1 className="text-2xl font-bold">Título</h1>
  <button className="px-4 py-2 bg-yellow-iptv text-black rounded hover:shadow-lg">
    Clique
  </button>
</div>
```

### Estilos Customizados (CSS)

```css
/* app/globals.css */
.custom-class {
  @apply p-4 rounded-lg shadow-md;
  background: linear-gradient(to right, #6a0dad, #9d4edd);
}
```

## 🧪 Debugging

### No VS Code

1. Instale extensão "Debugger for Chrome"
2. Adicione ao `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Console do Navegador

```typescript
// Adicione logs para debug
export default function MyComponent() {
  console.log('Component mounted');
  
  return <div>Conteúdo</div>;
}
```

## 📝 Padrões de Código

### Naming Conventions

- **Componentes**: PascalCase (`MyComponent.tsx`)
- **Arquivos**: kebab-case ou camelCase
- **Funções**: camelCase (`formatDate()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_WIDTH = 1200`)
- **Tipos**: PascalCase (`ButtonProps`)

### TypeScript

```typescript
// ✅ Bom
interface CardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export default function Card({ title, description, onClick }: CardProps) {
  return <div></div>;
}

// ❌ Evite
export default function Card(props: any) {
  return <div></div>;
}
```

### Componentes

```typescript
// ✅ Functional components sempre
export default function MyComponent() {
  return <div></div>;
}

// ✅ Use hooks appropriadamente
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [state, setState] = useState('');

  useEffect(() => {
    // Effect logic
  }, []);

  return <div></div>;
}
```

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor dev

# Build
npm run build            # Build para produção
npm run build --analyze  # Análise do bundle

# Produção
npm start                # Inicia servidor prod

# Linting
npm run lint             # Verifica erros

# Limpeza
rm -rf .next node_modules  # Reseta projeto
npm install               # Reinstala dependências
```

## 🔍 Hot Reload

- Edições em componentes React são refletidas instantaneamente ✨
- Alterações em estilos Tailwind aplicam instantaneamente
- Salvando o arquivo dispara reload automático

## 🐛 Troubleshooting

### "Module not found"
```bash
# Verificar imports
# npm run build

# Resolver:
rm -rf .next
npm run build
```

### "Port 3000 em uso"
```bash
# Use porta diferente
PORT=3001 npm run dev
```

### "Tailwind doesn't work"
```bash
# Regenerar Tailwind
npm run build

# Verificar se tailwind.config.js existe
ls -la tailwind.config.js
```

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 💡 Dicas Produtivas

1. **Use o VS Code**: Instale extensões para Next.js
2. **React DevTools**: Debugar componentes React
3. **DevTools do Navegador**: Inspecionar DOM e rede
4. **Prettier**: Auto-formatar código ao salvar
5. **Fast Refresh**: Edita sem perder estado

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Faça commits: `git commit -m "Add feature"`
3. Push: `git push origin feature/sua-feature`
4. Abra um Pull Request

---

Happy coding! 🎉
