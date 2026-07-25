# Deploy — Loja OBE na raiz (obeinformatica.com)

Runbook curto pra publicar a vitrine na **raiz** `obeinformatica.com`, com o
`www` redirecionando pra ela. Feito pra rodar no servidor (worker4 + Traefik +
Portainer). Nada aqui mexe no `panel.`, `alumnos.` ou `api.`.

## Retrato atual (conferido em produção)

| Endereço | Hoje serve | Depois |
|---|---|---|
| `obeinformatica.com` (raiz) | login do aluno (cópia do `alumnos.`) | **a loja** |
| `www.obeinformatica.com` | (confirmar DNS) | 301 → raiz |
| `alumnos.obeinformatica.com` | login do aluno ✓ | igual (não muda) |
| `panel.obeinformatica.com` | ERP "EDU-FINANCE PRO" ✓ | igual (não muda) |
| `api.obeinformatica.com` | API ✓ | igual (não muda) |

A loja já traz os botões **"Área del alumno"** → `alumnos.` e **"Sistema"** →
`panel.` (topo e rodapé). Não precisa configurar nada disso.

## Pré-requisitos

1. **DNS (Super Domínios):** confirmar que `www.obeinformatica.com` tem registro
   apontando pro servidor (CNAME → `obeinformatica.com` ou A → mesmo IP da raiz).
   A raiz já resolve (hoje serve o login), então o apex está ok.
2. **Remover a rota antiga da raiz:** achar o container/stack que hoje responde
   por `Host(\`obeinformatica.com\`)` (a tela de login) e **remover/repontar esse
   router**. Se dois routers reivindicarem o mesmo Host, o Traefik dá conflito.
   → O login do aluno **não se perde**: continua no `alumnos.`.

## Passos

Ajuste os 3 nomes marcados no `docker-compose.yml` (rede do Traefik, entrypoint
HTTPS, certresolver) pros mesmos que o `panel./alumnos.` já usam. Depois:

```bash
git clone https://github.com/claudirvisual/obe-loja.git
cd obe-loja
docker compose up -d --build
```

Ou, no Portainer: **Stacks → Add stack → Repository** apontando pro repo, arquivo
`docker-compose.yml`.

## Conferir

```bash
curl -I https://obeinformatica.com          # 200, HTML da loja
curl -I https://www.obeinformatica.com       # 301 -> https://obeinformatica.com
```

No navegador: abrir `obeinformatica.com`, ver a home da loja, e testar os botões
"Área del alumno" e "Sistema".

## Atualizar depois (novas versões)

```bash
cd obe-loja && git pull && docker compose up -d --build
```

---

## ⚠️ Antes de abrir pro público (conteúdo)

O deploy acima já deixa a loja **no ar**, mas ela lê o catálogo do Supabase. Hoje:

- **Catálogo:** o banco tem 34 cursos genéricos do EDU-FINANCE (não os 5 da OBE).
  A loja mostra o que estiver no banco → corrigir no ERP antes de divulgar.
- **Preços em Gs:** nulos → aparece "Consultá el valor". Preencher `valor_*_gs`.
- **Lead (Inscribirse):** `config.js → LEAD_MODE`. Confirmar se é insert direto no
  Supabase (precisa policy de INSERT pro `anon`) ou endpoint da API.
- **Contato/WhatsApp:** vazios em `config.js` → botão e dados ficam ocultos.

Detalhes em `HANDOFF-CLAUDIR.md`.
