# Mapa da Fé

[English](README.md) · **Português**

Localizador de instituições religiosas em mapa, com feed comunitário geolocalizado, painel para as instituições e sistema de moderação.

Feito com Next.js 14 (App Router) · TypeScript · MongoDB · Supabase · Leaflet

---

## Sobre o projeto

O Mapa da Fé conecta pessoas a instituições religiosas próximas — igrejas, templos, terreiros, sinagogas e mesquitas. O usuário abre o mapa, filtra por religião e encontra o que está perto, com horários de missas/cultos, eventos e contato.

Do outro lado, cada instituição administra sua própria página: dados, localização, foto de capa, agenda e publicações no feed. Uma camada de moderação mantém o conteúdo sob controle.

O app cobre **8 tradições religiosas** (Católica, Evangélica, Espírita, Matriz Africana, Judaica, Budista, Muçulmana e Outras), cada uma com identidade de cor própria no mapa.

## Funcionalidades

### Para quem procura

- **Mapa interativo** com busca por raio e filtro por religião ("buscar nesta área")
- **Encontrar mais próxima** usando a geolocalização do dispositivo
- **Página da instituição** com horários de missas/cultos, eventos, telefone, endereço e link direto para o Google Maps
- **Feed comunitário** com publicações das instituições da região, ordenadas por proximidade e com scroll infinito
- **Denúncia de publicações** para conteúdo impróprio
- **Doações** e histórico de transações *(atrás de feature flag)*

### Para as instituições

- Cadastro com validação de CNPJ e hCaptcha
- Dashboard para editar dados básicos, localização no mapa, foto de capa e agenda
- Publicação de posts no feed, com **moderação automática de imagem** antes de publicar
- Gestão de usuários vinculados e transferência de titularidade

### Para moderadores

- Painel de moderação de instituições, publicações, denúncias e usuários
- Suspensão de posts, banimento de usuários e alteração de papéis
- Fluxo de denúncias com estados (pendente / resolvida / rejeitada)

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS |
| Banco | MongoDB + Mongoose (índices geoespaciais `2dsphere`) |
| Auth & Storage | Supabase |
| Mapas | Leaflet + react-leaflet |
| Estado de servidor | TanStack Query |
| Anti-bot | hCaptcha |
| Moderação de imagem | Sightengine |
| Anúncios | Google AdSense *(atrás de feature flag)* |

## Arquitetura

O backend segue uma separação em camadas, cada uma com uma responsabilidade:

```
Route Handler  ->  Service       ->  Repository        ->  Model
(app/api/*)        (lib/services)    (lib/repositories)    (lib/models)
 HTTP + auth       regra de negócio  acesso ao banco       schema Mongoose
```

Toda rota autenticada passa por `verifyAuth` (`lib/apiUtils.ts`), que valida o token do Supabase no servidor e checa tipo, papel e status de banimento do usuário.

No frontend, as telas usam um padrão **MVVM**: os componentes cuidam da apresentação e os *view models* (`components/viewmodels/`) concentram a lógica, apoiados por contextos e hooks customizados.

As buscas por proximidade usam consultas geoespaciais nativas do MongoDB — `$near` para instituições e um pipeline com `$geoNear` para o feed.

### Estrutura de pastas

```
app/            Rotas do App Router
  api/          Route handlers (REST)
  institution/  Área logada da instituição + painel de moderação
components/     Componentes de UI, contextos e view models
lib/
  models/       Schemas Mongoose
  repositories/ Acesso a dados
  services/     Regras de negócio
  apiUtils.ts   verifyAuth e validações de rota
hooks/          Hooks de UI e data-fetching
services/       Clientes de API consumidos pelo frontend
utils/          Helpers (mapa, cores, telefone, compartilhamento)
```

## Rodando localmente

**Pré-requisitos:** Node.js `24.11.1` (veja o `.nvmrc`), uma instância MongoDB e um projeto Supabase.

```bash
nvm use              # opcional, respeita o .nvmrc
npm install
cp .env.example .env.local
# preencha os valores em .env.local
npm run dev
```

A aplicação sobe em `http://localhost:3000`.

### Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha. Variáveis com o prefixo `NEXT_PUBLIC_` são expostas ao navegador — **nunca** use esse prefixo em segredos.

| Variável | Escopo | Descrição |
|---|---|---|
| `MONGODB_URI` | servidor | String de conexão do MongoDB |
| `NEXT_PUBLIC_SUPABASE_URL` | público | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | público | Chave anônima do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **servidor** | Chave de service role — ignora RLS, jamais exponha |
| `NEXT_PUBLIC_BUCKET_NAME` | público | Bucket de storage das imagens |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | público | Site key do hCaptcha |
| `NEXT_PUBLIC_APP_URL` | público | URL base da aplicação |
| `MODERATION_PROVIDER` | servidor | Provedor de moderação (`sightengine`) |
| `SIGHTENGINE_API_USER` | servidor | Usuário da API Sightengine |
| `SIGHTENGINE_API_SECRET` | servidor | Segredo da API Sightengine |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` | público | Publisher ID do AdSense |
| `NEXT_PUBLIC_GOOGLE_AD_SLOT` | público | Ad slot (`auto` para anúncios automáticos) |
| `NEXT_PUBLIC_ENABLE_DONATIONS` | público | Feature flag: botão de doações |
| `NEXT_PUBLIC_ENABLE_ADS` | público | Feature flag: anúncios no feed |

As duas *feature flags* têm padrão `false` — o recurso só liga com o valor exato `'true'`.

## Modelo de permissões

O acesso é definido por duas dimensões independentes:

**Tipo** (`UserType`) — o vínculo com uma instituição:

| Valor | Significado |
|---|---|
| `inactive` | Cadastro ainda não confirmado |
| `comum` | Usuário comum |
| `institution admin` | Administra uma instituição |
| `institution owner` | Titular da instituição |

**Papel** (`UserRole`) — o nível na plataforma:

| Valor | Significado |
|---|---|
| `basic` | Padrão |
| `moderator` | Acessa o painel de moderação |
| `super admin` | Controle total |
| `banned` | Bloqueado |

Moderadores não podem alterar super admins nem promover usuários além de `basic`/`banned` — essas regras são aplicadas no servidor.

## Scripts

| Comando | Ação |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build de produção |
| `npm run lint` | ESLint |

## Documentação adicional

- [`APP_GUIDELINES.md`](APP_GUIDELINES.md) — visão geral do produto e convenções
- [`frontend_guidelines.md`](frontend_guidelines.md) — padrões de frontend
- [`backend_guidelines.md`](backend_guidelines.md) — padrões de backend
