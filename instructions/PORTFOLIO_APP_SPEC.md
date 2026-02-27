# 📋 Portfolio Linktree App — Especificação Completa

> Stack: **Next.js 16+ (App Router) + TypeScript + MongoDB + NextAuth (Google Login)**  
> Objetivo: Uma página pública de portfólio concentrada em um único link, com painel admin para gestão do conteúdo.

---

## 📁 Estrutura de Pastas

```
/
├── app/
│   ├── (public)/
│   │   └── [username]/
│   │       └── page.tsx              # Página pública do portfólio
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Página de login com Google
│   ├── admin/
│   │   ├── layout.tsx                # Layout protegido do admin
│   │   └── page.tsx                  # Painel de administração
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth handler
│   │   ├── profile/
│   │   │   └── route.ts              # GET + PUT do perfil do usuário logado
│   │   ├── portfolio/
│   │   │   └── route.ts              # GET + POST + DELETE de itens de portfólio
│   │   ├── companies/
│   │   │   └── route.ts              # GET + POST + DELETE de empresas
│   │   ├── testimonials/
│   │   │   └── route.ts              # GET + POST + DELETE de depoimentos
│   │   └── meta/
│   │       └── route.ts              # Scraper de favicon/title de URLs externas
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Redireciona para /login ou /admin
├── components/
│   ├── public/                       # Componentes da página pública
│   │   ├── ProfileHeader.tsx
│   │   ├── ContactLinks.tsx
│   │   ├── CTABanner.tsx
│   │   ├── CurrentlySection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   └── CompaniesSection.tsx
│   └── admin/                        # Componentes do painel admin
│       ├── ProfileForm.tsx
│       ├── PortfolioForm.tsx
│       ├── CompanyForm.tsx
│       └── TestimonialForm.tsx
├── lib/
│   ├── mongodb.ts                    # Conexão singleton com MongoDB
│   ├── models/
│   │   ├── User.ts                   # Schema do usuário/perfil
│   │   ├── Portfolio.ts              # Schema de item de portfólio
│   │   ├── Company.ts                # Schema de empresa
│   │   └── Testimonial.ts           # Schema de depoimento
│   └── auth.ts                       # Configuração do NextAuth
├── middleware.ts                     # Protege rotas /admin
├── .env.local
└── next.config.ts
```

---

## 🔐 Variáveis de Ambiente (.env.local)

```env
# MongoDB
DB_URI=mongodb+srv://...

# NextAuth
NEXTAUTH_SECRET=sua_chave_secreta_aqui
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## 🗄️ Modelos do MongoDB

### `User` (lib/models/User.ts)

```typescript
{
  _id: ObjectId,
  email: string,             // único, vindo do Google
  name: string,              // editável pelo admin
  image: string,             // URL da foto (Google ou custom)
  username: string,          // slug único para a URL pública: /[username]
  location: string,          // ex: "25y, São Paulo"
  headline: string,          // H1 da página pública
  description: string,       // Parágrafo abaixo do H1
  whatsapp: string,          // número com DDI ex: "5511999999999"
  ctaLabel: string,          // Texto do botão CTA
  ctaUrl: string,            // URL do botão CTA
  createdAt: Date,
  updatedAt: Date
}
```

### `Portfolio` (lib/models/Portfolio.ts)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,          // referência ao User
  title: string,             // ex: "Umacako - Hábitos"
  description: string,       // ex: "App para Celular/PC"
  url: string,               // link externo do projeto
  imageUrl: string,          // imagem de capa (upload ou URL)
  order: number,             // para ordenação drag-n-drop futura
  createdAt: Date
}
```

### `Company` (lib/models/Company.ts)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  name: string,              // capturado automaticamente via scraper
  url: string,               // URL do site da empresa
  faviconUrl: string,        // favicon capturado automaticamente
  order: number,
  createdAt: Date
}
```

### `Testimonial` (lib/models/Testimonial.ts)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,          // o dono do perfil
  authorName: string,        // nome de quem escreveu
  authorImage: string,       // foto do autor (opcional, URL)
  text: string,              // texto do depoimento
  approved: boolean,         // moderação pelo admin
  createdAt: Date
}
```

---

## 🔑 Autenticação (NextAuth)

**Arquivo:** `lib/auth.ts`

- Provider: **Google**
- Ao fazer login pela primeira vez, criar documento `User` no MongoDB com os dados do Google (`email`, `name`, `image`)
- Gerar `username` automaticamente a partir do nome (ex: "Thomas Almeida" → `thomas-almeida`), garantindo unicidade com sufixo numérico se necessário
- Salvar o `id` do MongoDB na session JWT para uso nas APIs
- Callback `session` deve expor: `session.user.id`, `session.user.username`

**Arquivo:** `middleware.ts`

- Proteger todas as rotas `/admin/*` — redirecionar para `/login` se não autenticado
- Rota `/login` redireciona para `/admin` se já autenticado

---

## 🌐 API Routes

### `GET/PUT /api/profile`

- **GET**: Retorna o perfil completo do usuário autenticado
- **PUT**: Atualiza campos editáveis do perfil (name, image, location, headline, description, whatsapp, ctaLabel, ctaUrl, username)
- Validar unicidade do `username` no PUT
- Autenticação obrigatória via session

### `GET /api/profile/[username]` (pública)

- Retorna perfil público pelo username (sem dados sensíveis)
- Retorna 404 se não encontrado

### `GET/POST/DELETE /api/portfolio`

- **GET**: Lista todos os portfólios do usuário autenticado
- **POST**: Cria novo item de portfólio
- **DELETE** `?id=xxx`: Remove item pelo ID

### `GET/POST/DELETE /api/companies`

- **GET**: Lista empresas do usuário autenticado
- **POST**: Recebe apenas a `url`, executa scraper (ver `/api/meta`), salva resultado
- **DELETE** `?id=xxx`: Remove empresa

### `GET/POST/PUT/DELETE /api/testimonials`

- **GET**: Lista depoimentos `approved: true` do usuário (pública via `?username=xxx`) ou todos para o admin
- **POST** (pública): Qualquer visitante pode enviar. Campos: `authorName`, `authorImage?`, `text`, `userId`
- **PUT** `?id=xxx` (admin): Aprovar/reprovar (`approved: true/false`)
- **DELETE** `?id=xxx` (admin): Remove depoimento

### `GET /api/meta?url=xxx`

- Faz fetch da URL informada (server-side para evitar CORS)
- Extrai via parsing HTML: `<title>` ou `og:site_name` para o nome, favicon via `<link rel="icon">` ou `favicon.ico` padrão
- Retorna: `{ name: string, faviconUrl: string }`
- Timeout de 5 segundos, retornar erro gracioso se falhar

---

## 🖥️ Painel Admin (`/admin`)

### Layout

- Header fixo com foto do usuário (vinda do Google/editável), nome e botão de logout
- Link "Ver minha página pública" abrindo `/{username}` em nova aba
- Abas ou seções de scroll suave: Perfil | Portfólio | Empresas | Depoimentos

### Seção: Perfil

Campos editáveis em um formulário único com botão "Salvar":

| Campo | Tipo | Observação |
|-------|------|------------|
| Foto | Image upload ou URL | Preview em tempo real |
| Nome | text | Pré-preenchido do Google |
| Username (slug) | text | Mostrar URL resultante: `seusite.com/{username}` |
| Localização | text | ex: "25y, São Paulo" |
| Título (H1) | text | Headline da página pública |
| Descrição | textarea | Parágrafo abaixo do título |
| WhatsApp | text | Apenas números com DDI |
| CTA Label | text | Texto do botão |
| CTA URL | text/url | Link do botão |

### Seção: Portfólio

- Lista de cards com imagem, título, descrição e botão remover
- Formulário de adição: título, descrição, URL do projeto, URL da imagem de capa
- Preview da imagem ao colar a URL

### Seção: Empresas

- Campo único: **URL do site da empresa**
- Ao colar a URL e clicar "Adicionar", chamar `/api/meta?url=xxx`
- Mostrar loading enquanto busca dados
- Exibir card com favicon + nome capturado para confirmar antes de salvar
- Lista de empresas já salvas com opção de remover

### Seção: Depoimentos

- Lista de todos os depoimentos (aprovados e pendentes)
- Badge de status: "Pendente" (amarelo) / "Aprovado" (verde)
- Botões: Aprovar | Reprovar | Excluir
- Depoimentos pendentes aparecem primeiro

---

## 📱 Página Pública (`/[username]`) — Mobile First

> **Implementar pixel perfect conforme o mockup anexado.**  
> Paleta: fundo branco `#FFFFFF`, texto primário `#111111`, secundário `#666666`.  
> Fonte: Sistema (Inter ou similar sem-serif).

### Estrutura e Componentes

#### 1. `ProfileHeader` — Topo da página

```
[NOME COMPLETO]        [FOTO circular ~64px]
[localização em cinza]
```

- Nome: `font-size: 28px`, `font-weight: 800`, linha dupla permitida
- Localização: `font-size: 14px`, `color: #888`
- Foto: `border-radius: 50%`, `width: 64px`, `height: 64px`, `object-fit: cover`
- Layout: `display: flex`, `justify-content: space-between`, `align-items: flex-start`
- Padding: `24px 20px 16px`

#### 2. `ContactLinks` — Botões de contato

```
[  WhatsApp  ]   [  Email/Gmail  ]
```

- Dois botões lado a lado (`display: grid; grid-template-columns: 1fr 1fr; gap: 12px`)
- WhatsApp: fundo `#25D366`, ícone SVG do WhatsApp, texto "WhatsApp", `color: white`
- Gmail: fundo `#EA4335`, ícone SVG do Gmail (M), texto do email, `color: white`
- Ambos: `border-radius: 12px`, `padding: 14px`, `font-weight: 600`, `font-size: 15px`
- Clicar no WhatsApp: abre `https://wa.me/{whatsapp}` em nova aba
- Clicar no Gmail: abre `mailto:{email}`

#### 3. `CTABanner` — Chamada para ação

```
[Título grande em negrito]
[Descrição em texto normal]
[ 🔗 Inscreva-se na minha newsletter    [ícone Gmail] ]
```

- Título: `font-size: 26px`, `font-weight: 800`, `line-height: 1.2`, `margin-top: 32px`
- Descrição: `font-size: 15px`, `color: #555`, `margin: 12px 0 20px`
- Botão CTA: largura 100%, `border: 1.5px solid #ddd`, `border-radius: 12px`, `padding: 14px 16px`
- Layout interno do botão: `display: flex; justify-content: space-between; align-items: center`
- Texto do botão: `font-size: 15px`, `font-weight: 500`
- Ícone à direita (Gmail ou link): `width: 24px`

#### 4. `CurrentlySection` — Atualmente

```
Atualmente
─────────────────────────
🏢 [Cargo/Posição]
   [NOME DA EMPRESA em maiúsculo cinza]

📚 [Curso/Área]
   [NOME DA INSTITUIÇÃO em maiúsculo cinza]
```

- Título da seção: `font-size: 20px`, `font-weight: 800`, `margin: 32px 0 16px`
- Cada item: `display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px`
- Ícone: emoji ou SVG, `width: 32px; height: 32px`
- Texto principal: `font-size: 15px; font-weight: 600`
- Subtexto (empresa/instituição): `font-size: 12px; font-weight: 700; color: #999; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 2px`

> **Nota:** Os campos "onde trabalha" e "onde estuda" fazem parte do perfil do usuário. Adicionar no modelo `User`:  
> `jobTitle`, `jobCompany`, `studyCourse`, `studyInstitution`

#### 5. `TestimonialsSection` — Coworks / Depoimentos

```
Coworks
Meus colegas falam por mim!
─────────────────────────────
[foto] "Texto do depoimento"
       [Nome do autor]

[foto] "Texto do depoimento"
       [Nome do autor]
```

- Título: `font-size: 20px; font-weight: 800; margin: 32px 0 4px`
- Subtítulo: `font-size: 14px; color: #888; margin-bottom: 16px`
- Cada item: `display: flex; gap: 12px; align-items: flex-start; margin-bottom: 20px`
- Foto: circular, `width: 40px; height: 40px; border-radius: 50%; object-fit: cover`
- Texto: aspas tipográficas, `font-size: 14px; color: #333; font-style: italic`
- Nome: `font-size: 13px; font-weight: 600; color: #555; margin-top: 4px`
- Exibir apenas depoimentos com `approved: true`

#### 6. `PortfolioSection` — Portfólio

```
Portfólio
──────────
[ IMAGEM CAPA ]
Título do Projeto
Tipo / Descrição curta

[ IMAGEM CAPA ]
...
```

- Título: `font-size: 20px; font-weight: 800; margin: 32px 0 16px`
- Cada item: `margin-bottom: 28px`
- Imagem: `width: 100%; aspect-ratio: 16/9; border-radius: 16px; object-fit: cover; background: #f0f0f0`
- Título do projeto: `font-size: 16px; font-weight: 700; margin-top: 10px`
- Descrição: `font-size: 13px; color: #888; margin-top: 4px`
- Toda a área clicável → abre `url` em nova aba
- Cursor pointer, hover leve: `opacity: 0.9; transition: opacity 0.2s`

#### 7. `CompaniesSection` — Empresas

```
Empresas que confiam no meu trabalho, você pode ser a próxima!
────────────────────────────────────────────────────────────────
[favicon] Nome da empresa
          Conhecer a empresa ↗

[favicon] Nome da empresa
          Conhecer a empresa ↗
```

- Título: `font-size: 20px; font-weight: 800; line-height: 1.3; margin: 32px 0 16px`
- Cada item: `display: flex; gap: 14px; align-items: center; padding: 8px 0`
- Favicon: `width: 40px; height: 40px; border-radius: 8px; object-fit: contain; background: #f5f5f5; padding: 4px`
- Nome da empresa: `font-size: 15px; font-weight: 600`
- Link "Conhecer a empresa": `font-size: 12px; color: #E84C4C; font-weight: 500; margin-top: 2px`
- Clicar no item → abre `url` da empresa em nova aba

---

## 📐 Layout Geral da Página Pública

```css
/* Container principal */
.page-container {
  max-width: 480px;       /* Mobile first */
  margin: 0 auto;
  padding: 0 20px 60px;
  background: #ffffff;
  min-height: 100vh;
}

/* Desktop / Notebook */
@media (min-width: 768px) {
  .page-container {
    max-width: 560px;
    padding: 40px 40px 80px;
    box-shadow: 0 0 40px rgba(0,0,0,0.06);
    margin: 40px auto;
    border-radius: 24px;
  }
}
```

**Ordem dos componentes na página (de cima para baixo):**
1. `ProfileHeader`
2. `ContactLinks`
3. `CTABanner`
4. `CurrentlySection`
5. `TestimonialsSection`
6. `PortfolioSection`
7. `CompaniesSection`

---

## 🔄 Fluxo de Dados da Página Pública

A página `/[username]/page.tsx` deve ser **Server Component** com **`generateMetadata`** para SEO:

```typescript
// app/(public)/[username]/page.tsx

import { notFound } from 'next/navigation'
import { getProfileByUsername } from '@/lib/models/User'
import { getApprovedTestimonials } from '@/lib/models/Testimonial'
import { getPortfolios } from '@/lib/models/Portfolio'
import { getCompanies } from '@/lib/models/Company'

export async function generateMetadata({ params }) {
  const profile = await getProfileByUsername(params.username)
  if (!profile) return {}
  return {
    title: `${profile.name} — Portfólio`,
    description: profile.description,
    openGraph: {
      images: [profile.image],
    },
  }
}

export default async function PublicPage({ params }) {
  const profile = await getProfileByUsername(params.username)
  if (!profile) notFound()

  const [testimonials, portfolios, companies] = await Promise.all([
    getApprovedTestimonials(profile._id),
    getPortfolios(profile._id),
    getCompanies(profile._id),
  ])

  return (
    <main className="page-container">
      <ProfileHeader profile={profile} />
      <ContactLinks email={profile.email} whatsapp={profile.whatsapp} />
      <CTABanner headline={profile.headline} description={profile.description} ctaLabel={profile.ctaLabel} ctaUrl={profile.ctaUrl} />
      <CurrentlySection profile={profile} />
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      {portfolios.length > 0 && <PortfolioSection portfolios={portfolios} />}
      {companies.length > 0 && <CompaniesSection companies={companies} />}
    </main>
  )
}
```

> **IMPORTANTE:** Nenhuma chamada de API client-side na página pública. Tudo server-side para performance máxima e SEO.

---

## 🔌 Conexão MongoDB (lib/mongodb.ts)

Usar padrão singleton para evitar múltiplas conexões em desenvolvimento:

```typescript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.DB_URI!

if (!MONGODB_URI) throw new Error('DB_URI não definida no .env.local')

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }
  cached.conn = await cached.promise
  return cached.conn
}
```

---

## 🛡️ Middleware de Proteção

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

## 📦 Dependências Necessárias

```bash
npm install next-auth mongoose
npm install @types/mongoose --save-dev

# Para scraping de favicon/meta no servidor
npm install cheerio node-fetch
```

---

## 🎨 Notas de Design para Implementação

1. **Mobile first sempre**: Partir do menor breakpoint e escalar com `@media (min-width: 768px)`
2. **Sem bibliotecas CSS externas obrigatórias**: Pode usar Tailwind CSS ou CSS Modules — mas manter fidelidade ao mockup
3. **Cores exatas do mockup:**
   - WhatsApp button: `#25D366`
   - Gmail button: `#EA4335`
   - Link "Conhecer a empresa": `#E84C4C` (vermelho suave)
   - Texto secundário/cinza: `#888888`
   - Texto terciário (labels uppercase): `#999999`
   - Borda padrão: `#EEEEEE`
   - Fundo: `#FFFFFF`
4. **Imagens de portfólio**: Renderizar com `next/image` com `fill` e `object-fit: cover`
5. **Favicons de empresas**: Usar tag `<img>` comum (não `next/image`) pois são URLs externas dinâmicas — adicionar domínios externos no `next.config.ts` se usar `next/image`
6. **Transições**: Suaves em hover (0.2s ease) nos cards de portfólio e links de empresas
7. **Loading states no admin**: Skeleton loaders nos cards ao carregar listas

---

## ✅ Checklist de Funcionalidades

### Página Pública
- [ ] Exibe foto, nome e localização do usuário
- [ ] Botões clicáveis de WhatsApp e Gmail
- [ ] CTA com título, descrição e botão linkado
- [ ] Seção "Atualmente" com trabalho e estudo
- [ ] Seção de depoimentos aprovados (Coworks)
- [ ] Grid de portfólio com imagens linkadas
- [ ] Lista de empresas com favicon e link

### Painel Admin
- [ ] Login com Google (NextAuth)
- [ ] Edição de perfil completo
- [ ] Upload/URL de foto de perfil
- [ ] CRUD de portfólio
- [ ] CRUD de empresas com auto-fetch de favicon
- [ ] Moderação de depoimentos (aprovar/reprovar/excluir)
- [ ] Link direto para a página pública

### Backend / API
- [ ] Conexão singleton com MongoDB
- [ ] Proteção de rotas admin via middleware
- [ ] API de scraping de meta dados de URLs
- [ ] Geração automática de username único no primeiro login
- [ ] Todos os endpoints validam a sessão antes de mutações
