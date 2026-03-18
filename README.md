# Assistente de Compliance | E-commerce e Marketplace

Ferramenta para escritórios de advocacia especializados em e-commerce e marketplaces. Permite avaliar a conformidade de lojas virtuais e plataformas com **LGPD** (Lei Geral de Proteção de Dados), **CDC** (Código de Defesa do Consumidor), **Decreto 7.962/2013** e **boas práticas** do setor.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

---

## Funcionalidades

### Checklists

| Categoria | Itens | Foco |
|-----------|-------|------|
| **LGPD** | 12 | Política de privacidade, consentimento/cookies, direitos do titular, segurança e governança |
| **CDC** | 8 | Informação ao consumidor, vendas/contratos, pós-venda e garantias |
| **Boas Práticas** | 6 | SSL, checkout, frete, pagamentos, confirmação de pedido, mobile |
| **Marketplace** | 10 | Responsabilidade solidária, vendedores, Decreto 7.962/2013, LGPD para compartilhamento |

### Recursos

- **Campo de observação** — Documente o motivo de respostas "Parcial" ou "Não" (ex.: "Em revisão pela equipe jurídica")
- **Links para legislação** — Referências (Art. 41 LGPD, Art. 49 CDC etc.) são clicáveis e levam ao texto da lei no Planalto
- **Sugestões advocatícias** — Recomendações específicas para cada item não conforme ou parcial
- **Dashboard** — Visão geral do progresso, percentuais (conformes/parciais/não conformes) e resumo por categoria
- **Exportação TXT e PDF** — Relatório completo com identidade visual (accent dourado, ícone de conformidade)
- **PWA** — Instalável em smartphones, com service worker para uso offline
- **Persistência** — Respostas e nome da empresa salvos automaticamente no `localStorage`

---

## Como usar

### Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

### Build para produção

```bash
npm run build
npm run preview
```

O build gera os arquivos em `dist/`, incluindo o service worker (`sw.js`) e o manifest PWA (`manifest.webmanifest`).

---

## Tecnologias

- **React 19** + **TypeScript**
- **Vite 8** — build e dev server
- **Tailwind CSS 4** — estilização
- **jsPDF** — geração de relatórios PDF
- **vite-plugin-pwa** — PWA com Workbox (cache offline, instalação)

---

## Estrutura do projeto

```
src/
├── components/
│   ├── Dashboard.tsx       # Visão geral, métricas, exportação
│   ├── ChecklistCategoria.tsx
│   └── ChecklistItem.tsx  # Item com status, observação e links
├── data/
│   ├── checklists.ts      # Dados LGPD, CDC, boas práticas, marketplace
│   └── legislacao.ts     # URLs LGPD e CDC (Planalto)
├── utils/
│   └── exportarRelatorio.ts  # Exportação TXT e PDF
├── icons.tsx
├── types.ts
├── App.tsx
└── main.tsx
```

---

## Relatório PDF

O PDF exportado inclui:

- Header com ícone de checkmark (conformidade) e accent dourado
- Linhas douradas no topo e acima do rodapé em todas as páginas
- Barras douradas nos títulos de seção (categorias, Resumo, Sugestões)
- Observações quando preenchidas
- Sugestões advocatícias para itens Parcial/Não

---

## PWA

O app é instalável como PWA em dispositivos móveis e desktop. O service worker faz precache dos assets e permite uso offline. Links para legislação (planalto.gov.br) são cacheados com estratégia NetworkFirst.

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila para produção |
| `npm run preview` | Pré-visualiza o build |
| `npm run lint` | Executa o ESLint |

---

## Licença e disclaimer

Ferramenta de apoio para escritórios de advocacia. **As orientações não substituem consultoria jurídica especializada.**
