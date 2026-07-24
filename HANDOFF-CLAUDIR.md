# Handoff — Loja / Vitrine da OBE Informática

Repo: **https://github.com/claudirvisual/obe-loja**

App **standalone estático** (HTML/CSS/JS vanilla, sem build) para a raiz
**obeinformatica.com**. Castellano, moeda Guaraní, cobrança por **carné** (sem gateway).
Lê o catálogo do Supabase da OBE via `anon key`. Dela saem os links para
`alumnos.` (área do aluno) e `panel.` (sistema).

> **O que preciso de você (Claudir):** os 4 pontos da seção "Pendências" abaixo.
> Nada disso mexe no app em si — é dado no banco + confirmação + deploy.

---

## Stack / estrutura

- Sem framework, sem node, sem build. SPA com hash-routing.
- Deploy: `Dockerfile` (nginx:alpine) + `nginx.conf` já inclusos.
- Configuração central: **`assets/js/config.js`** (Supabase, contato, modo de lead).

```
index.html · assets/{css,js,img} · Dockerfile · nginx.conf · README.md
```

## Supabase (já configurado no front, anon key pública)

- URL: `https://grxutdnplfckxjorglti.supabase.co`
- `escola_id` (filtro obrigatório): `2ded99dd-6daf-47bd-b6bc-38a6c5a74d8b`
- Catálogo: tabela **`pedagogico_cursos`** (leitura via anon **já funciona** — RLS aberta).
- Preços em Guaraní nas colunas `valor_total_gs`, `valor_avista_gs`, `valor_boleto_gs`
  (carné), `parcelas_boleto_gs`.

---

## ⚠️ Pendências (com você)

### 1. Catálogo errado no banco
Hoje `pedagogico_cursos` (para essa escola) tem **34 cursos genéricos** herdados do
EDU-FINANCE (Agente Funerario, Papiloscopia, Perito Criminal, Áreas Forenses…). **Não são
os cursos da OBE.** O catálogo real são **5 cursos**:

1. Operador de Computadoras
2. Secretariado Ejecutivo
3. Diseño Gráfico
4. Operador Cajero
5. Reparación de Computadoras

→ Substituir os placeholders pelos 5 reais no ERP (nome, descrição, duração, modalidade).
A loja lê o banco, então mostra o que estiver lá. A modalidade é **mista** (presencial/EAD),
a confirmar por curso com a escola.

### 2. Preços em Guaraní nulos
Todas as colunas `*_gs` dos cursos estão `null`. Enquanto isso a loja mostra
**"Consultá el valor"**. Ao preencher `valor_boleto_gs` + `parcelas_boleto_gs`
(+ `valor_avista_gs`), o preço aparece automaticamente ("X cuotas de Gs Y").
Os campos base (`valor_total`=5000 etc.) parecem ser Reais do EDU-FINANCE — **não usar como Gs**.

### 3. Fluxo do lead (checkout = carné)
"Inscribirse" gera um lead (sem pagamento online). Tabela **`leads`** tem:
`nome, email, telefone, celular, curso, cpf, escola_id, origem, observacao`.
Definir em `config.js` → `LEAD_MODE`:
- `"supabase"` (atual): INSERT direto em `leads` com a anon key → **precisa de policy RLS
  de INSERT para o role `anon`** (hoje não testei o insert p/ não sujar produção).
- `"api"`: POST para `LEAD_API_ENDPOINT` (endpoint público na API). Preferível se não quiser
  INSERT direto com anon.

### 4. Deploy
Serviço novo na **raiz** obeinformatica.com (não mexer no que já está no ar).
```bash
docker build -t obe-loja .
# Traefik (ex.): Host(`obeinformatica.com`) → porta 80
```

---

## Dados que virão do cliente (via Henderson, não bloqueiam você)
Preenchidos em `config.js`: `WHATSAPP_NUMBER` (liga botão flutuante + CTAs),
`SOCIAL_PROOF` (anos/alunos/docentes), `TESTIMONIOS`, `TELEFONO`/`EMAIL_CONTACTO`/`DIRECCION`.

## Rodar local (precisa de HTTP, ES modules não abrem via file://)
```bash
python -m http.server 8080   # ou: npx serve .
```
