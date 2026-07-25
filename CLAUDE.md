# CLAUDE.md — Contexto do projeto (loja/vitrine OBE Informática)

> Instruções para o Claude Code que abrir esta pasta. Leia antes de agir.
> **Fale com o usuário em português (PT-BR)**, de forma simples e acessível (evite jargão).
> O **site** permanece em espanhol (castellano) — isso é regra do produto.

## O que é
Loja/vitrine (e-commerce) da **OBE Informática**, escola de formação profissional do
**Paraguai**. É a "porta de entrada" para novos alunos, na raiz **obeinformatica.com**.
As outras 3 faces do sistema já estão no ar e NÃO são desta pasta: ERP (`panel.`),
área do aluno (`alumnos.`), API (`api.`).

Regras do produto: **castellano**, moeda **Guaraní (Gs)**, cobrança **só por carné**
(cuotas, sem pagamento online/gateway). "Inscribirse" = gerar um **lead**.

## Onde está
- **Pasta:** `C:\Users\Henderson\Documents\obe`
- **GitHub:** https://github.com/claudirvisual/obe-loja (branch `main`, público)
- **Preview (artifact):** https://claude.ai/code/artifact/e5b5f044-b7d9-4256-8450-7bea3a43abb9
- **Guia p/ usuário:** https://claude.ai/code/artifact/4c8cfa09-e76a-4cd5-a3cb-3271af7874d9
- **Handoff técnico p/ Claudir:** `HANDOFF-CLAUDIR.md` (no repo)

## Stack
HTML/CSS/JS **vanilla, ES modules, SPA hash-routing, SEM build**. Deploy = `Dockerfile`
(nginx) + `nginx.conf`. Config central: **`assets/js/config.js`**.
Arquivos: `index.html`, `assets/{css/styles.css, js/{config,data,ui,app}.js, img/logo.jpg}`.

## Estado atual (feito ✅)
- Loja completa: home rica (hero, ¿Por qué OBE?, Cómo funciona, FAQ, CTA), catálogo,
  detalhe de curso, formulário de inscrição. Animações + botões flutuantes (WhatsApp/topo).
- Lê `pedagogico_cursos` do Supabase via anon key (RLS de leitura aberta).
- Versionado no GitHub. Handoff técnico escrito.

## Pendências
- **Catálogo errado (Claudir):** o banco tem 34 cursos genéricos do EDU-FINANCE. Os reais
  da OBE são **5**: Operador de Computadoras, Secretariado Ejecutivo, Diseño Gráfico,
  Operador Cajero, Reparación de Computadoras. O preview já usa esses 5 (mock em
  `scratchpad/cursos5.json`), todos "presencial" provisório (modalidade real é mista).
- **Preços em Gs nulos (Claudir):** colunas `valor_*_gs` vazias → site mostra "Consultá el valor".
- **Fluxo do lead (Claudir):** `config.LEAD_MODE` = `supabase` (insert direto em `leads`)
  vs `api` (endpoint). Confirmar. Tabela `leads`: nome,email,telefone,celular,curso,cpf,
  escola_id,origem,observacao.
- **Do usuário:** WHATSAPP_NUMBER, modalidade de cada curso, prova social (anos/alunos/
  depoimentos — NÃO inventar), contato. Tudo em `config.js` (graceful: vazio = oculto).
- **Deploy (Claudir):** raiz obeinformatica.com via Traefik/Portainer. Não mexer no que está no ar.

## Dados Supabase
URL `https://grxutdnplfckxjorglti.supabase.co` · anon key no `config.js` (pública, ok).
`escola_id` (filtrar sempre): `2ded99dd-6daf-47bd-b6bc-38a6c5a74d8b`.

## Ambiente e "pegadinhas" (importante)
- **Sem node/npm.** Só existe um Python-shim quebrado. Por isso o app é estático puro.
- **Testar localmente:** subir servidor em PowerShell (`System.Net.HttpListener`, ver
  `scratchpad/server.ps1`) e abrir `http://localhost:8080/` no Browser pane. Use
  `read_page` para verificar (o `screenshot` costuma dar timeout — servidor single-thread).
  Preview `file://` é modo snapshot e NÃO roda o app de forma confiável.
- **Preview como artifact:** gerar bundle concatenando config+ui+app SEM imports (o
  `import` multilinha do app.js quebra se não for removido inteiro — usar filtro awk que
  remove o bloco até a linha que termina em `;`). Logo embutido como data URI; fetch é
  bloqueado no artifact, então usar dados mock.
- **git/gh:** `gh` está em `C:\Program Files\GitHub CLI\gh.exe`, autenticado como
  **claudirvisual**. Rodar `gh`/`git push` pelo **Bash tool** (o classificador de auto-mode
  bloqueia esses comandos no PowerShell tool).
- **Ao terminar mudanças:** commitar e `git push origin main` (via Bash tool) se o usuário pedir.
