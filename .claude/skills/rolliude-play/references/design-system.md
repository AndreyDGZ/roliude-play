# Design System

Fonte: o visual do front real em `rolliude-play---o-cinema-da-nossa-terra-na-sua-tela/`. Identidade: cinema nordestino, couro, cordel e terra, sobre fundo escuro.

## Marca

- Nome para o público: **Rolliúde Play**. Identificador técnico: `rolliude-play`.
- Slogan: "O cinema da nossa terra na sua tela."
- Logo: componente `src/components/Logo.tsx` (chapéu de couro + `ROLLIÚDE` + `PL▶Y`). Não redesenhar o logo em outro lugar.
- "Roliúde Nordestina" (com um L) é nome de tag de curadoria, não da marca.

## Cores oficiais

| Token `@theme` | Valor | Papel |
|---|---|---|
| `--color-brand-bg` | `#120D0A` | fundo da página |
| `--color-brand-surface` | `#23130B` | cards e painéis |
| `--color-brand-surface-raised` | `#3E2114` | superfície elevada, hover de card |
| `--color-brand-border` | `#442315` | bordas e divisores |
| `--color-brand-text` | `#FAF6EE` | texto principal |
| `--color-brand-text-muted` | `#A67E5D` | texto secundário |
| `--color-brand-text-soft` | `#C89D77` | legenda e metadado |
| `--color-brand-primary` | `#C2410C` | terracota: botão primário, seleção, play do logo |
| `--color-brand-accent` | `#EA580C` | laranja: hover, destaque, link ativo |
| `--color-brand-star` | `#FCD34D` | âmbar: nota e estrelas |

Cores exclusivas do logo e do cordel (não usar em interface): couro `#A26236`, `#854823`, `#6A3617`; contorno `#431D08`; tachas `#E2C99B`; estrelas `#EADBB6`; tira `#5C2D0C`. O `CordelPattern` aceita só as variantes `light`, `dark` e `subtle`.

## Regra de uso (obrigatória em código novo ou tocado)

1. As cores vivem num bloco `@theme` do Tailwind v4 em `src/index.css`:
   ```css
   @import "tailwindcss";
   @theme {
     --color-brand-bg: #120D0A;
     --color-brand-primary: #C2410C;
     --font-display: "Cinzel", serif;
   }
   ```
2. Componente usa a classe gerada (`bg-brand-primary`, `text-brand-text-muted`, `font-display`), nunca o valor solto (`bg-[#C2410C]`, `font-['Cinzel']`).
3. Cor fora desta tabela não entra. Precisa de cor nova: registrar em `decisions.md` primeiro.
4. Dívida conhecida: o código atual tem cerca de 120 hex avulsos (`bg-[#...]`). Ao tocar um arquivo, troque os valores dele pelo token mais próximo da tabela. Não fazer migração em massa fora de uma task própria.

## Tipografia

- Títulos, marca e números de destaque: Cinzel (pesos 600 a 900), token `--font-display`.
- Corpo: `font-sans` do Tailwind. Outfit e Plus Jakarta Sans estão carregadas sem uso; não usar até haver decisão.
- `font-mono` só para metadados técnicos (duração, ano, códigos).

## Forma e espaço

- Raio: `rounded-xl` padrão para cards, botões e inputs; `rounded-lg` para elementos internos; `rounded-full` para pílulas, avatares e botão de play; `rounded-2xl` para modais e banners.
- Container de página: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Espaçamento: escala padrão do Tailwind, sem valores arbitrários (`p-[13px]`).

## Ícones

Somente `lucide-react`. Sem SVG de ícone escrito à mão, sem outra biblioteca.

## Acessibilidade

- Todo controle interativo tem foco visível (`focus-visible:ring-2 focus-visible:ring-brand-accent`) e funciona pelo teclado.
- Botão só com ícone tem `aria-label` em português.
- Contraste mínimo AA: texto de corpo usa `brand-text` ou `brand-text-soft` sobre `brand-bg`/`brand-surface`; `brand-text-muted` só para texto secundário grande ou não essencial.
- Imagens de pôster e elenco têm `alt` descritivo.
