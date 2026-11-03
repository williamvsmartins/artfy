# Instruções do repositório

Artfy (`williamvsmartins/artfy`) é um projeto pessoal: o usuário entra com a conta do Spotify e o site gera wallpapers a partir das músicas mais ouvidas dele, com a cor dominante de cada capa. Sem login, a home mostra um carrossel com dados de exemplo.

## Stack

| Camada       | Tecnologia                                                                |
| ------------ | ------------------------------------------------------------------------- |
| Framework    | Next.js 14 (App Router), React 18, TypeScript `strict`                    |
| Estilo       | Tailwind CSS 3                                                            |
| Autenticação | next-auth 4 com `SpotifyProvider` (escopo `user-top-read`), sessão em JWT |
| Dados        | axios + TanStack Query 5 (prefetch no server, `HydrationBoundary`)        |
| Imagem       | jimp + extract-colors para a cor dominante da capa (roda no server)       |
| Carrossel    | Swiper 11                                                                 |
| Pacotes      | npm (`package-lock.json`). Não introduzir yarn ou pnpm                    |
| Runtime      | Node 26 (`engines` no `package.json`; a Vercel descontinuou o Node 20)    |

## Comandos

- `npm run dev` — Next em `http://localhost:3000`
- `npm run lint` — eslint em `src` com `--max-warnings=0` (warning também reprova)
- `npm run lint:fix` — eslint com `--fix`
- `npm run tsc:check` — typecheck sem emitir
- `npm run build` — build de produção (é o que o deploy roda)
- Não há suíte de testes. Ao criar o primeiro teste, adicionar o script `test` e documentar aqui.

## Estrutura

| Necessidade                                  | Local                                           |
| -------------------------------------------- | ----------------------------------------------- |
| página, layout, route handler                | `src/app` (`/` home, `/wallpaper` logado)       |
| configuração do next-auth e guarda de sessão | `src/lib/auth.ts` (`loginIsRequiredServer`)     |
| cliente HTTP do Spotify                      | `src/services/api.ts` (base URL por `NODE_ENV`) |
| chamada de um recurso da API e seus tipos    | `src/services/http/<recurso>/{index,types}.ts`  |
| hook de dados                                | `src/hooks/use<Nome>.ts`                        |
| componente                                   | `src/components/<Nome>/index.tsx` (PascalCase)  |
| subcomponente de um único componente         | `src/components/<Pai>/components/<Nome>/`       |
| provider client-side                         | `src/providers` e `src/app/providers.tsx`       |
| dados de exemplo da home                     | `src/lib/sampleTracks.json`                     |

## Convenções

- Server component por padrão. `'use client'` só no menor componente que usa hook, evento ou API do navegador.
- A `queryKey` de top tracks é `['topTracks', period]` e precisa ser a mesma no prefetch de `src/app/wallpaper/page.tsx` e em `useTopTracks`, senão a hidratação vira um segundo request.
- Imports são ordenados pelo `import-helpers/order-imports` do `.eslintrc.json`; rode `npm run lint:fix` em vez de ordenar na mão.
- Prettier: aspas simples, ponto e vírgula, sem trailing comma.
- Alias `@/` aponta para `src/`.
- Texto de interface em português do Brasil. Identificadores de código e mensagens de commit em inglês.
- Não adicionar comentários explicativos no código. Nome bem escolhido substitui.
- Responsivo em mobile e desktop: os commits recentes ajustaram tamanho de wallpaper e card no mobile, não quebrar isso.

## Regras

- Autonomia dentro deste repo: editar, rodar lint/tsc/build e iterar livremente. Trocar dependência estrutural (auth, data fetching, estilo) ou mudar escopo do Spotify: explicar o plano antes.
- Nunca comitar `.env` nem imprimir seus valores. As variáveis esperadas estão em `.env.example`.
- Não expor token de acesso do Spotify nem dados reais de um usuário em log, exemplo ou screenshot.
- `git push` direto na `main` é bloqueado por hook para o Claude. O push é do William.
- O app no Spotify está em modo de desenvolvimento: só contas cadastradas no dashboard do Spotify conseguem logar.
