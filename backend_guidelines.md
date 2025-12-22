# Backend Guidelines - Holy Finder

## 📋 Índice

1. [Arquitetura em Camadas](#arquitetura-em-camadas)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Padrões de Código](#padrões-de-código)
4. [Boas Práticas](#boas-práticas)
5. [Exemplos](#exemplos)

---

## 🏗️ Arquitetura em Camadas

### Princípios Fundamentais

O backend segue uma arquitetura em camadas bem definida:

```
Route (API) → Service → Repository → Model (MongoDB)
```

### Regras de Camadas

> [!CAUTION]
> **NUNCA pule camadas!** Routes não devem acessar Repositories diretamente.

```
✅ Route → Service → Repository → Model
❌ Route → Repository (pular Service)
❌ Route → Model (pular Service e Repository)
```

---

## 📁 Estrutura de Pastas

```
/app/api
├── /companies
│   ├── /[cnpj]
│   │   ├── /basic-info/route.ts
│   │   ├── /location/route.ts
│   │   ├── /cover-image/route.ts
│   │   └── route.ts
│   ├── /nearby/route.ts
│   └── /nearest/route.ts
├── /users
│   └── /[email]/route.ts
├── /feed
│   └── /posts/route.ts
└── /moderation
    ├── /status/route.ts
    └── /companies
        └── /[cnpj]/route.ts

/lib
├── /models              # Modelos MongoDB (Mongoose)
│   ├── Company.ts
│   ├── Post.ts
│   ├── User.ts
│   ├── Report.ts
│   └── common.ts
├── /repositories        # Camada de acesso a dados
│   ├── BaseRepository.ts
│   ├── CompanyRepository.ts
│   ├── PostRepository.ts
│   ├── UserRepository.ts
│   └── ReportRepository.ts
├── /services            # Lógica de negócio (backend)
│   ├── BaseService.ts
│   ├── CompanyService.ts
│   ├── PostService.ts
│   └── UserService.ts
├── /utils               # Utilitários backend
│   └── stringUtils.ts
├── apiUtils.ts          # Utilitários de API (auth, etc)
├── dbConnect.ts         # Conexão MongoDB (carrega todos os modelos)
└── supabase.ts          # Cliente Supabase
```

> [!IMPORTANT]
> O arquivo `dbConnect.ts` carrega automaticamente todos os modelos para garantir que referências e populate funcionem corretamente.

---

## 🎯 Padrões de Código

### 1. Routes - Endpoints da API

```typescript
// app/api/companies/nearby/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/lib/services/CompanyService';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '5');
    const type = searchParams.get('type') || undefined;
    
    // Validação de parâmetros
    if (!lat || !lng) {
      return NextResponse.json({ error: 'Missing lat or lng' }, { status: 400 });
    }
    
    const service = new CompanyService();
    const companies = await service.getCompaniesByRadius(lat, lng, radius, type);
    
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

**Responsabilidades**:
- Conectar ao banco de dados (`dbConnect()`)
- Validar parâmetros de entrada
- Chamar serviços apropriados
- Retornar respostas HTTP formatadas
- Tratar erros HTTP (400, 401, 404, 500)

### 1.1. Conexão com Banco de Dados

> [!IMPORTANT]
> Sempre use `dbConnect()` no início de cada API route para garantir conexão com MongoDB.

```typescript
// lib/dbConnect.ts
import mongoose from 'mongoose';

async function dbConnect() {
  // Mantém cache da conexão para evitar múltiplas conexões
  // Carrega automaticamente todos os modelos para garantir
  // que referências (populate) funcionem corretamente
}

export default dbConnect;
```

**Por que carregar todos os modelos?**
- Garante que `populate()` funcione em todas as referências
- Evita erros de "Model not registered"
- Inicializa índices corretamente
- Previne problemas com hot reload em desenvolvimento

**Ordem de carregamento**:
1. `common.ts` - Schemas compartilhados
2. `Company.ts` - Modelo sem dependências
3. `User.ts` - Referencia Company
4. `Post.ts` - Referencia Company e User
5. `Report.ts` - Referencia Company e User
6. `PostsReports.ts` - Referencia Post, User e Company

### 2. Services - Lógica de Negócio

```typescript
// lib/services/CompanyService.ts
import { BaseService } from './BaseService';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { CompanyDocument } from '../models/Company';

export class CompanyService extends BaseService<CompanyDocument> {
  constructor() {
    super(new CompanyRepository());
  }
  
  async getCompaniesByRadius(
    lat: number, 
    lng: number, 
    radiusInKm: number = 5, 
    type?: string
  ): Promise<CompanyDocument[]> {
    return (this.repository as CompanyRepository).findByRadius(lat, lng, radiusInKm, type);
  }
  
  async createDefaultCompany(
    cnpj: string, 
    location?: { lat: number; lng: number }
  ): Promise<{ company: CompanyDocument; isNew: boolean }> {
    const existing = await this.getCompanyByCnpj(cnpj);
    if (existing) {
      return { company: existing, isNew: false };
    }
    
    const defaultCompany = {
      _id: cnpj,
      name: "Nova Instituição",
      type: "Católica",
      geo: {
        type: "Point",
        coordinates: location ? [location.lng, location.lat] : [-47.8919, -15.7975]
      }
    };
    
    const newCompany = await this.repository.create(defaultCompany as any);
    return { company: newCompany, isNew: true };
  }
  
  async toggleCompanyActive(cnpj: string, active: boolean): Promise<CompanyDocument | null> {
    return (this.repository as CompanyRepository).updateActiveStatus(cnpj, active);
  }
}
```

**Responsabilidades**:
- Implementar regras de negócio
- Orquestrar operações entre múltiplos repositórios
- Validar dados de negócio
- Transformar dados entre camadas

### 3. Repositories - Acesso a Dados

```typescript
// lib/repositories/CompanyRepository.ts
import { BaseRepository } from './BaseRepository';
import Company from '../models/Company';
import { Company as ICompany } from '../../types';
import { Document } from 'mongoose';

type CompanyDocument = ICompany & Document;

export class CompanyRepository extends BaseRepository<CompanyDocument> {
  constructor() {
    super(Company);
  }
  
  async findByRadius(
    lat: number, 
    lng: number, 
    radiusInKm: number, 
    type?: string
  ): Promise<CompanyDocument[]> {
    const query: any = {
      geo: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusInKm * 1000
        }
      },
      active: true
    };
    
    if (type) {
      query.type = type;
    }
    
    return this.model.find(query);
  }
  
  async updateActiveStatus(cnpj: string, active: boolean): Promise<CompanyDocument | null> {
    return this.model.findByIdAndUpdate(
      cnpj,
      { active },
      { new: true }
    );
  }
  
  async countActive(): Promise<number> {
    return this.model.countDocuments({ active: true });
  }
}
```

**Responsabilidades**:
- Queries MongoDB
- Operações CRUD básicas
- Índices e otimizações de banco

### 4. Models - Schemas MongoDB

```typescript
// lib/models/Company.ts
import mongoose, { Schema } from 'mongoose';

const CompanySchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Católica', 'Evangélica', 'Espírita'], required: true },
  geo: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  active: { type: Boolean, default: true },
  missas: [MissaSchema],
  events: [EventSchema]
}, { timestamps: true });

CompanySchema.index({ geo: '2dsphere' });
CompanySchema.index({ active: 1 });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
```

**Responsabilidades**:
- Definir estrutura de dados
- Validações de schema
- Índices de banco
- Métodos de instância/estáticos

### 5. UUID como Identificador

\u003e [!IMPORTANT]
\u003e Todos os novos modelos devem usar UUID (String) ao invés de ObjectId para o campo `_id`.

```typescript
// lib/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

const UserSchema = new Schema({
  _id: { 
    type: String, 
    default: () => crypto.randomUUID() 
  },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  // ... outros campos
}, { timestamps: true });

// Para interfaces de Document com UUID
export interface UserDocument extends Omit<Document, '_id'> {
  _id: string; // UUID
  email: string;
  fullName: string;
  // ... outros campos
}

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
```

**Benefícios do UUID**:
- Compatibilidade com sistemas externos
- IDs únicos gerados no cliente
- Melhor para sistemas distribuídos
- Formato padronizado (RFC 4122)


---

## ✨ Boas Práticas

### 1. Autenticação e Autorização

```typescript
// lib/apiUtils.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from './models/common';

export const verifyAuth = async (
  request: NextRequest,
  allowedTypes: string[] = [],
  allowedRoles: UserRole[] = []
) => {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return {
      errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }
  
  // Verify token and check roles/types
  // ...
  
  return { user, errorResponse: null };
};
```

**Uso em Routes**:
```typescript
export async function PATCH(request: NextRequest) {
  const { errorResponse, user } = await verifyAuth(
    request, 
    [], 
    [UserRole.MODERATOR, UserRole.SUPER_ADMIN]
  );
  
  if (errorResponse) {
    return errorResponse;
  }
  
  // Continue with authorized logic
}
```

### 2. Error Handling

```typescript
// Routes
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const service = new CompanyService();
    const data = await service.getData();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/companies:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

// Services
async getData() {
  try {
    return await this.repository.findAll();
  } catch (error) {
    console.error('Error in CompanyService.getData:', error);
    throw error; // Re-throw para route handler
  }
}
```

### 3. Validação de Dados

```typescript
// Route com validação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, coordinates } = body;
    
    // Validação
    if (!name || !type || !coordinates) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return NextResponse.json(
        { error: 'Invalid coordinates format' }, 
        { status: 400 }
      );
    }
    
    const service = new CompanyService();
    const result = await service.create(body);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
```

### 4. Queries Eficientes

```typescript
// Use Promise.all para queries paralelas
async getModerationStatus() {
  const [activeCompanies, activeUsers, totalPosts, pendingReports] = await Promise.all([
    new CompanyRepository().countActive(),
    new UserRepository().countActive(),
    new PostRepository().countAll(),
    new ReportRepository().countPending(),
  ]);
  
  return {
    activeCompanies,
    activeUsers,
    totalPosts,
    pendingReports,
  };
}

// Use índices apropriados
CompanySchema.index({ geo: '2dsphere' });
CompanySchema.index({ active: 1, type: 1 });
```

### 5. Paginação

```typescript
// Repository
async findPaginated(
  filters: any,
  page: number,
  limit: number
): Promise<PaginatedResult<CompanyDocument>> {
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    this.model.find(filters).skip(skip).limit(limit).sort({ updatedAt: -1 }),
    this.model.countDocuments(filters)
  ]);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  };
}
```

---

## 📚 Exemplos

### Exemplo Completo: CRUD de Companies

#### 1. Model
```typescript
// lib/models/Company.ts
const CompanySchema = new Schema({
  _id: String,
  name: String,
  type: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });
```

#### 2. Repository
```typescript
// lib/repositories/CompanyRepository.ts
export class CompanyRepository extends BaseRepository<CompanyDocument> {
  async findActive(): Promise<CompanyDocument[]> {
    return this.model.find({ active: true });
  }
  
  async updateActiveStatus(id: string, active: boolean) {
    return this.model.findByIdAndUpdate(id, { active }, { new: true });
  }
}
```

#### 3. Service
```typescript
// lib/services/CompanyService.ts
export class CompanyService extends BaseService<CompanyDocument> {
  async toggleActive(id: string, active: boolean) {
    return (this.repository as CompanyRepository).updateActiveStatus(id, active);
  }
}
```

#### 4. Route
```typescript
// app/api/companies/[id]/route.ts
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { active } = await request.json();
    
    if (typeof active !== 'boolean') {
      return NextResponse.json({ error: 'Invalid active value' }, { status: 400 });
    }
    
    const service = new CompanyService();
    const result = await service.toggleActive(params.id, active);
    
    if (!result) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

---

## 🎓 Checklist de Implementação

Ao criar uma nova API, verifique:

- [ ] Conecta ao banco com `dbConnect()`?
- [ ] Valida todos os parâmetros de entrada?
- [ ] Usa a camada Service (não acessa Repository diretamente)?
- [ ] Implementa error handling adequado?
- [ ] Retorna status HTTP corretos (200, 201, 400, 401, 404, 500)?
- [ ] Implementa autenticação quando necessário?
- [ ] Usa Promise.all para queries paralelas?
- [ ] Implementa paginação quando apropriado?
- [ ] Adiciona índices necessários no Model?
- [ ] Logs de erro estão implementados?

---

## 📖 Resumo

### Arquitetura
```
Route → Service → Repository → Model
```

### Regras de Ouro

1. **Nunca pule camadas** - sempre use Service entre Route e Repository
2. **Sempre conecte ao banco** - `await dbConnect()` em todas as routes
3. **Valide entrada** - verifique parâmetros antes de processar
4. **Error handling** - sempre use try-catch e retorne erros apropriados
5. **Use Promise.all** - para queries paralelas
6. **Autenticação** - use `verifyAuth` para rotas protegidas
7. **Paginação** - implemente para listas grandes
8. **Índices** - adicione índices para queries frequentes
9. **Use UUID** - para `_id` em novos modelos ao invés de ObjectId

---

> [!TIP]
> Ao criar uma nova API, use uma existente como referência. Mantenha a consistência no padrão de código.
