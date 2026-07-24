# OBE Informática — Vitrine / E-commerce

Loja/vitrine na raiz **obeinformatica.com** da OBE Informática (escola de formação
profissional, Paraguai). App **standalone**, estático, sem build step.

- Idioma: **castellano** (Paraguai). Moeda: **Guaraní (Gs)**.
- Cobrança: **exclusivamente por carnê** (cuotas). **Sem gateway / sem pagamento online.**
- Lê o catálogo direto do **Supabase da OBE** via chave `anon` (pública, ok no front).
- Dela saem 2 links: **Área del alumno** (`alumnos.obeinformatica.com`) e **Sistema** (`panel.obeinformatica.com`).

## Stack

HTML + CSS + JavaScript **vanilla (ES modules)**. SPA com **hash-routing** (`#/cursos`,
`#/curso/<id>`, `#/inscripcion`). Sem framework, sem node, sem build. Serve como arquivos
estáticos — nginx incluído.

```
index.html
assets/
  css/styles.css       estilos (marca OBE: dourado/preto)
  js/config.js         ⚙️ TODA a configuração (chaves, URLs, modo de checkout)
  js/data.js           camada Supabase (catálogo + envio de lead)
  js/ui.js             formatação (Guaraní, preços, textos)
  js/app.js            router + views (home, catálogo, detalhe, inscrição)
  img/logo.jpg
Dockerfile             nginx:alpine servindo os estáticos
nginx.conf             fallback SPA + gzip + cache
_preview_artifact.html  (NÃO faz parte do site — fonte do preview publicado)
```

> O `Dockerfile` copia só `index.html` + `assets/`. Arquivos com `_` no início não sobem.

## Configuração — `assets/js/config.js`

Tudo que muda por ambiente/cliente está aqui:

| Chave | O que é |
|---|---|
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Supabase da OBE (chave pública) |
| `ESCOLA_ID` | filtro obrigatório: `2ded99dd-6daf-47bd-b6bc-38a6c5a74d8b` |
| `URL_ALUMNOS` / `URL_PANEL` | links pras outras caras do sistema |
| `WHATSAPP_NUMBER` | nº WhatsApp (ex: `595981...`). Vazio = some o botão flutuante + CTAs de WhatsApp |
| `EMAIL_CONTACTO` / `TELEFONO` / `DIRECCION` | contato no rodapé (vazio = some) |
| `INSTAGRAM_URL` | link do Instagram no rodapé |
| `SOCIAL_PROOF` | `{ anos, alumnos, docentes }` — prova social. `null` oculta o número (NÃO inventar) |
| `TESTIMONIOS` | array `{nombre, ciudad, texto}` — vazio = seção não aparece |
| `LEAD_MODE` | como envia a inscrição: `supabase` \| `api` \| `off` |
| `LEAD_API_ENDPOINT` | endpoint público, se `LEAD_MODE = "api"` |

**Home ampliada:** a página inicial tem hero, barra de números, seção "¿Por qué OBE?",
catálogo, "Cómo funciona", FAQ e CTA final — tudo com animação ao rolar + botões flutuantes
(WhatsApp e voltar-ao-topo). Conteúdo estático (FAQ, passos, diferenciais) está em `app.js`.

## Dados

Tabela `pedagogico_cursos` (34 cursos da OBE, `modalidade: ead`). Campos usados:
`nome, descricao, ementa, o_que_estuda, duracao_meses, carga_horaria, modalidade,
qtd_certificados` + preços em Guaraní `valor_*_gs`.

O catálogo **já é legível** pela chave `anon` (RLS de leitura aberta — confirmado).

### ⚠️ Pendências pra resolver com o Claudir (projeto principal)

0. **⚠️ CATÁLOGO ERRADO no banco (crítico pro go-live).** Os 34 cursos hoje em
   `pedagogico_cursos` são genéricos herdados do EDU-FINANCE (Agente Funerario, Papiloscopia,
   Perito Criminal…) — **não são o que a OBE ensina**. O catálogo real da OBE são **5 cursos**:
   Operador de Computadoras, Secretariado Ejecutivo, Diseño Gráfico, Operador Cajero,
   Reparación de Computadoras (modalidade mista, ajustar por curso). O ERP precisa
   **substituir os placeholders pelos 5 reais** (com preços em Gs). O site lê o banco, então
   mostra o que estiver lá — o preview já exibe os 5 corretos como referência.


1. **Preços em Guaraní estão TODOS nulos.** As colunas `valor_total_gs`,
   `valor_boleto_gs`, `valor_avista_gs`, `parcelas_boleto_gs` estão `null` nos 34 cursos.
   Só existem os valores base (`valor_total` = 5000, etc.) que parecem ser do EDU-FINANCE
   (provavelmente Reais) — **não** dá pra exibir como Guaraní.
   → Enquanto `*_gs` for nulo, a vitrine mostra **"Consultá el valor"** e leva ao formulário.
   Assim que o ERP preencher os `*_gs`, os preços (X cuotas de Gs Y) aparecem **sozinhos**.

2. **Fluxo do checkout / lead.** "Inscrever" = gerar uma solicitação (lead), sem pagamento.
   A tabela `leads` existe e tem: `nome, email, telefone, celular, curso, cpf, escola_id,
   origem, observacao`. Falta confirmar:
   - inserção **direta** em `leads` com a chave `anon` (há policy de INSERT pra anon?), **ou**
   - um **endpoint público** na API (`api.obeinformatica.com/...`).
   → Hoje `config.LEAD_MODE = "supabase"` (insert direto). Se o certo for a API, trocar pra
   `"api"` e setar `LEAD_API_ENDPOINT`. Enquanto não confirmar, dá pra usar `"off"` (demo).

## Deploy (feito pelo projeto principal — worker4 + Traefik + Portainer)

Stack `obe`, serviço novo na **raiz** `obeinformatica.com` (não mexer no que já está no ar).

```bash
docker build -t obe-loja .
# via Traefik (labels de exemplo):
#   traefik.http.routers.obe-loja.rule=Host(`obeinformatica.com`)
#   traefik.http.services.obe-loja.loadbalancer.server.port=80
```

Nada de segredo sensível no bundle — só a chave `anon` (pública por design).

## Rodar local

Precisa de um servidor HTTP (ES modules não funcionam via `file://`):

```bash
npx serve .        # ou: python -m http.server 8080
```
