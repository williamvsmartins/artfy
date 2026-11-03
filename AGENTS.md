# Instruções do repositório

Artfy (`williamvsmartins/artfy`) é um projeto pessoal: o usuário entra com a conta do Spotify e o site gera wallpapers a partir das músicas mais ouvidas dele, com a cor dominante de cada capa. Sem login, a home mostra um wallpaper real com as mais tocadas do Brasil (Deezer) e as cartas da pessoa viradas, e `/montar` deixa qualquer pessoa montar o seu escolhendo músicas. Todo wallpaper vira uma polaroid 9:16 para o story.

## Stack

| Camada       | Tecnologia                                                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | Next.js 14 (App Router), React 18, TypeScript `strict`                                                                                                                              |
| Estilo       | Tailwind CSS 3                                                                                                                                                                      |
| Autenticação | next-auth 4 com `SpotifyProvider` (escopo `user-top-read`), sessão em JWT                                                                                                           |
| Dados        | Spotify Web API (top tracks), API pública do Deezer (chart, busca, preview) e iTunes Search (preview reserva), sempre chamadas no servidor; TanStack Query só na busca do `/montar` |
| Imagem       | jimp + extract-colors para a cor dominante da capa; `next/og` + `qrcode` para a polaroid do story (tudo no server)                                                                  |
| Carrossel    | Swiper 11                                                                                                                                                                           |
| Pacotes      | npm (`package-lock.json`). Não introduzir yarn ou pnpm                                                                                                                              |
| Runtime      | Node 26 (`engines` no `package.json`; a Vercel descontinuou o Node 20)                                                                                                              |

## Comandos

- `npm run dev` — Next em `http://localhost:3000`
- `npm run lint` — eslint em `src` com `--max-warnings=0` (warning também reprova)
- `npm run lint:fix` — eslint com `--fix`
- `npm run tsc:check` — typecheck sem emitir
- `npm run build` — build de produção (é o que o deploy roda)
- `npm test` — `node --test` com `--experimental-strip-types` em `src/**/*.test.mjs`. O teste fica ao lado do módulo e importa o `.ts` com extensão; por isso módulos testados só podem ter `import type` (o runner não resolve `@/` nem import sem extensão). Lógica pura vai para um módulo assim; o resto se verifica no navegador.

## Estrutura

| Necessidade                                  | Local                                                                                               |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| página, layout, route handler                | `src/app` (`/` home, `/wallpaper` logado, `/montar` sem login)                                      |
| rotas de API                                 | `src/app/api/{preview/[key],search,tracks,share}`                                                   |
| configuração do next-auth e guarda de sessão | `src/lib/auth.ts` (`loginIsRequiredServer`); tipos da sessão em `src/types/next-auth.d.ts`          |
| modelo único de música                       | `src/types/track.ts` (`Track`) e `src/lib/tracks/mappers.ts`                                        |
| clientes das APIs externas                   | `src/lib/{spotify,deezer,itunes}.ts`; chart e busca por id com cache em `src/lib/tracks/catalog.ts` |
| validação de parâmetros e períodos           | `src/lib/params.ts`                                                                                 |
| player de preview, gesto e fundo tingido     | `src/components/AudioPreview/` e `src/lib/audio/gesture.ts`                                         |
| polaroid do story                            | `src/lib/share/` e `src/app/api/share/route.tsx`                                                    |
| componente                                   | `src/components/<Nome>/index.tsx` (PascalCase)                                                      |
| subcomponente de um único componente         | `src/components/<Pai>/components/<Nome>/` ou arquivo irmão                                          |
| provider client-side                         | `src/providers`, `src/app/providers.tsx` e `AudioPreviewProvider`                                   |

## Convenções

- Server component por padrão. `'use client'` só no menor componente que usa hook, evento ou API do navegador.
- Dados de música chegam ao client por props do server já como `Track`. O client não chama Spotify nem Deezer direto; o token do Spotify só é lido no server, e a sessão expõe apenas `accessToken` e `error`.
- Áudio só pelo `AudioPreviewProvider` (dois `<audio>` com crossfade). O `src` é sempre `/api/preview/<previewKey>`, porque as URLs do Deezer expiram em ~20 min. Os trechos do wallpaper visível são baixados antes (blob, 3 por vez, só com som ligado e sem economia de dados) para a troca no hover ser imediata; ao sair do card a música segue por 250 ms e cruza com a próxima. O navegador só libera áudio depois de um clique ou tecla na página: com som salvo como ligado e sem interação, o botão mostra "Toque para ouvir".
- Wallpapers ficam dentro de `FitToViewport`: em telas ≥1024 px a escala cabe na altura da janela; abaixo disso, na largura. Títulos vazados (`.text-outline`) usam Inter estático de `src/fonts`, porque o `-webkit-text-stroke` desenha as sobreposições internas da fonte variável.
- Hover e escala dos cards ficam em CSS (`.wall-card` em `globals.css`), não em estado React; só o card tocando re-renderiza.
- Estado lido de `localStorage` ou de um store externo não pode aparecer no HTML do servidor: use `INITIAL_STATE` no `getServerSnapshot`.
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
- O app no Spotify está em modo de desenvolvimento: só contas cadastradas no dashboard do Spotify conseguem logar. Quem não está cadastrado recebe 403 e é levado para `/montar?motivo=spotify`.
- `NEXT_PUBLIC_SITE_URL` (padrão `https://artfy.vercel.app`) define o endereço e o QR da polaroid.
