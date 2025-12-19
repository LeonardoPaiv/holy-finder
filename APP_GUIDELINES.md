# Guia de Código - Holy Finder

## 📋 Índice

1. [Arquitetura MVVM](#arquitetura-mvvm)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Padrões de Código](#padrões-de-código)
4. [Backend (API)](#backend-api)
5. [Frontend (Components)](#frontend-components)
6. [Boas Práticas](#boas-práticas)
7. [Exemplos](#exemplos)

---

## 🏗️ Arquitetura MVVM

### Princípios Fundamentais

O aplicativo segue o padrão **MVVM (Model-View-ViewModel)** para separação de responsabilidades:

- **Model**: Dados e lógica de negócio (tipos, modelos MongoDB)
- **View**: Componentes React (JSX/TSX) - apenas apresentação
- **ViewModel**: Hooks customizados que gerenciam estado e lógica

### Regras MVVM

> [!IMPORTANT]
> **Regra de Ouro**: Componentes React devem ser **apenas** apresentacionais. Toda lógica de negócio, estado e handlers devem estar em ViewModels.

#### ✅ Correto
```tsx
// ViewModel: components/viewmodels/MapViewViewModel.ts
export const useMapViewViewModel = (center, onSearchArea) => {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  
  const handleSearchArea = async () => {
    // Lógica complexa aqui
    const result = await fetchData();
    setPosition(result);
  };
  
  return { position, handleSearchArea };
};

// View: components/mapview/MapView.tsx
export const MapView = ({ onSearchArea }) => {
  const { position, handleSearchArea } = useMapViewViewModel(undefined, onSearchArea);
  
  return (
    <button onClick={handleSearchArea}>Buscar</button>
  );
};
```

#### ❌ Incorreto
```tsx
// View com lógica misturada
export const MapView = ({ onSearchArea }) => {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  
  return (
    <button onClick={async () => {
      // ❌ Lógica inline no JSX
      const result = await fetchData();
      setPosition(result);
    }}>
      Buscar
    </button>
  );
};
```

---

## 📁 Estrutura de Pastas

### Frontend

```
/components
├── /viewmodels          # ViewModels (hooks customizados)
│   ├── AppViewModel.ts
│   ├── MapViewViewModel.ts
│   └── ChurchDialogViewModel.ts
├── /contexts            # Contextos React globais
│   ├── AppContext.tsx
│   └── InstitutionPostContext.tsx
├── /mapview             # Componentes do mapa (agrupados por feature)
│   ├── MapView.tsx
│   ├── MapFilters.tsx
│   ├── SearchAreaButton.tsx
│   └── RecenterButton.tsx
├── /church-dialog       # Componentes do dialog de igreja
│   ├── ScheduleSection.tsx
│   └── PhotoSection.tsx
├── /posts               # Componentes de posts
│   ├── PostsFeedTab.tsx
│   └── CreatePost.tsx
└── ChurchDialog.tsx     # Componentes standalone

/hooks                   # Hooks reutilizáveis
├── useAuth.ts
├── useConfirm.tsx
├── useFindNearest.tsx
└── useInfinitePosts.ts

/services                # Serviços de API (frontend)
├── companyService.ts
├── postService.ts
├── feedService.ts
└── storageService.ts

/utils                   # Utilitários puros
├── shareUtils.ts
└── constants.ts

/types.ts                # Definições de tipos TypeScript
```

### Backend

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
└── /feed
    └── /posts/route.ts

/lib
├── /models              # Modelos MongoDB (Mongoose)
│   ├── Company.ts
│   ├── Post.ts
│   ├── User.ts
│   └── common.ts
├── /repositories        # Camada de acesso a dados
│   ├── BaseRepository.ts
│   ├── CompanyRepository.ts
│   ├── PostRepository.ts
│   └── UserRepository.ts
├── /services            # Lógica de negócio (backend)
│   ├── BaseService.ts
│   ├── CompanyService.ts
│   ├── PostService.ts
│   └── UserService.ts
├── dbConnect.ts         # Conexão MongoDB
└── supabase.ts          # Cliente Supabase
```

---

## 🎯 Padrões de Código

### 1. Handlers Fora do JSX

> [!WARNING]
> **NUNCA** declare funções inline em `onClick`, `onChange`, etc.

#### ✅ Correto
```tsx
export const MyComponent = () => {
  const { handleClick, handleChange } = useMyViewModel();
  
  return (
    <>
      <button onClick={handleClick}>Click</button>
      <input onChange={handleChange} />
    </>
  );
};
```

#### ❌ Incorreto
```tsx
export const MyComponent = () => {
  return (
    <>
      <button onClick={() => {
        // ❌ Lógica inline
        console.log('clicked');
      }}>Click</button>
      
      <input onChange={(e) => {
        // ❌ Handler inline
        setValue(e.target.value);
      }} />
    </>
  );
};
```

### 2. Isolamento de Código Reutilizável

Quando identificar código duplicado ou similar, extraia para:

#### **Utils** - Funções puras sem estado
```typescript
// utils/shareUtils.ts
export const getCompanyShareData = (cnpj: string, name: string) => ({
  title: `${name} - Holy Finder`,
  text: `Confira ${name} no Holy Finder`,
  url: `${window.location.origin}/company/${cnpj}`
});

export const shareContent = async (data: ShareData) => {
  if (navigator.share) {
    await navigator.share(data);
  }
};
```

#### **Hooks** - Lógica com estado reutilizável
```typescript
// hooks/useConfirm.tsx
export const useConfirm = () => {
  const confirm = (message: string, onConfirm: () => Promise<void>) => {
    toast.custom((t) => (
      <ConfirmToast 
        message={message}
        onConfirm={onConfirm}
        onCancel={() => toast.dismiss(t.id)}
      />
    ));
  };
  
  return { confirm };
};
```

#### **Contexts** - Estado global compartilhado
```typescript
// components/contexts/AppContext.tsx
interface AppContextType {
  religion: string;
  setReligion: (religion: string) => void;
  userLocation: UserLocation | null;
  setUserLocation: (location: UserLocation) => void;
}

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [religion, setReligion] = useState('Católica');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  
  return (
    <AppContext.Provider value={{ religion, setReligion, userLocation, setUserLocation }}>
      {children}
    </AppContext.Provider>
  );
};
```

#### **Components** - UI reutilizável
```tsx
// components/ConfirmToast.tsx
interface ConfirmToastProps {
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const ConfirmToast: FC<ConfirmToastProps> = ({ message, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);
  
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };
  
  return (
    <div>
      <p>{message}</p>
      <button onClick={handleConfirm} disabled={loading}>
        {loading ? 'Carregando...' : 'Confirmar'}
      </button>
      <button onClick={onCancel} disabled={loading}>Cancelar</button>
    </div>
  );
};
```

### 3. Organização de ViewModels

Cada ViewModel deve:
- Ser um hook customizado (`use` prefix)
- Retornar apenas o necessário para a View
- Encapsular toda lógica de estado e handlers
- Usar outros hooks (contexts, custom hooks)

```typescript
// components/viewmodels/ChurchDialogViewModel.ts
export const useChurchDialogViewModel = (church: Company | null, onClose: () => void) => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportText, setReportText] = useState('');
  
  // Reset ao mudar church
  useEffect(() => {
    setIsReporting(false);
    setReportText('');
  }, [church]);
  
  const handleSendReport = () => {
    // Lógica de envio
    alert('Problema reportado!');
    setReportText('');
    setIsReporting(false);
  };
  
  const handleClose = () => {
    setIsReporting(false);
    onClose();
  };
  
  const handleShare = async () => {
    if (!church) return;
    const shareData = getCompanyShareData(church._id, church.name);
    await shareContent(shareData);
  };
  
  return {
    isReporting,
    setIsReporting,
    reportText,
    setReportText,
    handleSendReport,
    handleClose,
    handleShare,
  };
};
```

---

## 🔌 Backend (API)

### Arquitetura em Camadas

```
Route (API) → Service → Repository → Model (MongoDB)
```

#### 1. **Routes** - Endpoints da API
```typescript
// app/api/companies/nearby/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CompanyService } from '@/lib/services/CompanyService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const radius = parseFloat(searchParams.get('radius') || '5');
  const type = searchParams.get('type') || undefined;
  
  const service = new CompanyService();
  const companies = await service.getCompaniesByRadius(lat, lng, radius, type);
  
  return NextResponse.json(companies);
}
```

**Responsabilidades**:
- Validar parâmetros de entrada
- Chamar serviços apropriados
- Retornar respostas HTTP formatadas
- Tratar erros HTTP (400, 401, 404, 500)

#### 2. **Services** - Lógica de negócio
```typescript
// lib/services/CompanyService.ts
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
  
  async createDefaultCompany(cnpj: string, location?: { lat: number; lng: number }): Promise<{ company: CompanyDocument; isNew: boolean }> {
    const existing = await this.getCompanyByCnpj(cnpj);
    if (existing) {
      return { company: existing, isNew: false };
    }
    
    const defaultCompany: Partial<ICompany> = {
      _id: cnpj,
      name: "Nova Instituição",
      type: Religions.CATOLICA,
      geo: {
        type: "Point",
        coordinates: location ? [location.lng, location.lat] : [-47.8919, -15.7975]
      }
    };
    
    const newCompany = await this.repository.create(defaultCompany as any);
    return { company: newCompany, isNew: true };
  }
}
```

**Responsabilidades**:
- Implementar regras de negócio
- Orquestrar operações entre múltiplos repositórios
- Validar dados de negócio
- Transformar dados entre camadas

#### 3. **Repositories** - Acesso a dados
```typescript
// lib/repositories/CompanyRepository.ts
export class CompanyRepository extends BaseRepository<ICompany> {
  constructor() {
    super(Company);
  }
  
  async findByRadius(
    lat: number, 
    lng: number, 
    radiusInKm: number, 
    type?: string
  ): Promise<(ICompany & Document)[]> {
    const query: any = {
      geo: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusInKm * 1000
        }
      }
    };
    
    if (type) {
      query.type = type;
    }
    
    return this.model.find(query).exec();
  }
}
```

**Responsabilidades**:
- Queries MongoDB
- Operações CRUD básicas
- Índices e otimizações de banco

#### 4. **Models** - Schemas MongoDB
```typescript
// lib/models/Company.ts
import mongoose, { Schema } from 'mongoose';

const CompanySchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(Religions), required: true },
  geo: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  missas: [MissaSchema],
  events: [EventSchema]
}, { timestamps: true });

CompanySchema.index({ geo: '2dsphere' });

export const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);
```

**Responsabilidades**:
- Definir estrutura de dados
- Validações de schema
- Índices de banco
- Métodos de instância/estáticos

### Regras de Camadas

> [!CAUTION]
> **NUNCA pule camadas!** Routes não devem acessar Repositories diretamente.

```
✅ Route → Service → Repository → Model
❌ Route → Repository (pular Service)
❌ Route → Model (pular Service e Repository)
```

---

## 🎨 Frontend (Components)

### Hierarquia de Componentes

```
Page (app/page.tsx)
  ↓
Container Component (usa ViewModel)
  ↓
Presentational Components (recebem props)
```

### Exemplo Completo: MapView

#### 1. Page
```tsx
// app/page.tsx
const App: FC = () => {
  const {
    selectedCompany,
    setSelectedCompany,
    mapCenter,
    companies,
    religion,
    handleSearchArea,
  } = useAppViewModel();
  
  const { setIsReligionDialogOpen } = useApp();
  
  return (
    <div className="w-full h-full">
      <MapView
        companies={companies}
        onSelectCompany={setSelectedCompany}
        currentReligion={religion}
        onSearchArea={handleSearchArea}
        center={mapCenter}
        onToggleSettings={() => setIsReligionDialogOpen(true)}
      />
      
      <ChurchDialog
        church={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </div>
  );
};
```

#### 2. Container Component
```tsx
// components/mapview/MapView.tsx
export const MapView: FC<MapViewProps> = ({ 
  companies, 
  onSelectCompany, 
  currentReligion, 
  onSearchArea, 
  center,
  onToggleSettings
}) => {
  const {
    position,
    userLocation,
    showSearchButton,
    mapRef,
    handleManualLocationRequest,
    handleRecenter,
    handleMapMove,
    handleSearchArea,
  } = useMapViewViewModel(center, onSearchArea);
  
  return (
    <div className="w-full h-full absolute inset-0 bg-slate-100">
      <MapContainer center={position} zoom={14} ref={mapRef}>
        <MapController center={position} />
        <MapEvents onMoveEnd={handleMapMove} />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/..." />
        
        {companies.map((company) => (
          <Marker 
            key={company._id} 
            position={[company.geo.coordinates[1], company.geo.coordinates[0]]} 
            eventHandlers={{ click: () => onSelectCompany(company) }}
          />
        ))}
      </MapContainer>
      
      <SearchAreaButton show={showSearchButton} onSearch={handleSearchArea} />
      <MapFilters currentReligion={currentReligion} onToggleSettings={onToggleSettings} />
      <RecenterButton show={!!userLocation} onRecenter={handleRecenter} />
    </div>
  );
};
```

#### 3. Presentational Components
```tsx
// components/mapview/SearchAreaButton.tsx
interface SearchAreaButtonProps {
  show: boolean;
  onSearch: () => void;
}

export const SearchAreaButton: FC<SearchAreaButtonProps> = ({ show, onSearch }) => {
  if (!show) return null;
  
  return (
    <button 
      onClick={onSearch}
      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]"
    >
      Buscar nesta área
    </button>
  );
};
```

### Quebra de Componentes

Quando um componente fica muito grande (>200 linhas), quebre em:

1. **Por feature** - Agrupe componentes relacionados em pastas
   ```
   /mapview
     ├── MapView.tsx (container)
     ├── MapFilters.tsx
     ├── SearchAreaButton.tsx
     └── RecenterButton.tsx
   ```

2. **Por seção** - Extraia seções lógicas
   ```tsx
   // Antes: ChurchDialog.tsx (300 linhas)
   
   // Depois:
   // ChurchDialog.tsx (100 linhas) - container
   // church-dialog/ScheduleSection.tsx
   // church-dialog/PhotoSection.tsx
   // church-dialog/ContactSection.tsx
   ```

---

## ✨ Boas Práticas

### 1. Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `MapView`, `ChurchDialog` |
| ViewModels | `use` + PascalCase | `useAppViewModel`, `useMapViewViewModel` |
| Hooks | `use` + PascalCase | `useAuth`, `useConfirm` |
| Services | PascalCase + `Service` | `CompanyService`, `PostService` |
| Utils | camelCase | `shareContent`, `getCompanyShareData` |
| Constantes | UPPER_SNAKE_CASE | `DEFAULT_POSITION`, `MAX_RADIUS` |

### 2. Imports

Organize imports por categoria:
```typescript
// 1. Externos
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import toast from 'react-hot-toast';

// 2. Internos - tipos
import { Company } from '@/types';

// 3. Internos - hooks/contexts
import { useApp } from '@/components/AppContext';
import { useMapViewViewModel } from '../viewmodels/MapViewViewModel';

// 4. Internos - componentes
import { SearchAreaButton } from './SearchAreaButton';
import { MapFilters } from './MapFilters';

// 5. Internos - utils/services
import { shareContent } from '@/utils/shareUtils';
import { CompanyService } from '@/services/companyService';
```

### 3. TypeScript

Sempre defina tipos para:
- Props de componentes
- Retornos de ViewModels
- Parâmetros de funções
- Respostas de API

```typescript
// ✅ Correto
interface MapViewProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  currentReligion: string;
  center?: { lat: number; lng: number };
}

export const MapView: FC<MapViewProps> = ({ companies, onSelectCompany }) => {
  // ...
};

// ❌ Incorreto
export const MapView = ({ companies, onSelectCompany }: any) => {
  // ...
};
```

### 4. Error Handling

```typescript
// Services (frontend)
export const CompanyService = {
  getCompanies: async (lat: number, lng: number): Promise<Company[]> => {
    try {
      const response = await fetch(`/api/companies/nearby?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching companies:', error);
      return []; // Fallback seguro
    }
  }
};

// ViewModels
const fetchData = async () => {
  try {
    const data = await CompanyService.getCompanies(lat, lng);
    setCompanies(data);
  } catch (error) {
    console.error('Error:', error);
    toast.error('Erro ao carregar dados');
  }
};
```

### 5. Performance

#### Memoização
```tsx
import { memo, useMemo, useCallback } from 'react';

// Componentes pesados
export const MapView = memo(({ companies, onSelectCompany }) => {
  // ...
});

// Cálculos custosos
const filteredCompanies = useMemo(() => {
  return companies.filter(c => c.type === religion);
}, [companies, religion]);

// Callbacks para child components
const handleClick = useCallback(() => {
  onSelectCompany(company);
}, [company, onSelectCompany]);
```

#### Lazy Loading
```tsx
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('../components/mapview/MapView').then(mod => mod.MapView), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse" />
});
```

### 6. Estado Local vs Global

| Use Estado Local (useState) | Use Context/Global |
|------------------------------|-------------------|
| Estado específico do componente | Estado compartilhado entre múltiplos componentes |
| Não precisa persistir | Precisa persistir (localStorage) |
| Não afeta outros componentes | Afeta toda a aplicação |

**Exemplo**: 
- Local: `isReporting` em `ChurchDialog`
- Global: `religion`, `userLocation` em `AppContext`

---

## 📚 Exemplos

### Exemplo 1: Refatorar Componente com Lógica Inline

#### ❌ Antes
```tsx
export const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  return (
    <div>
      <button onClick={async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/data');
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }}>
        Carregar
      </button>
      
      <input onChange={(e) => {
        const filtered = data.filter(item => 
          item.name.includes(e.target.value)
        );
        setData(filtered);
      }} />
      
      {loading ? <p>Carregando...</p> : (
        <ul>
          {data.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
      )}
    </div>
  );
};
```

#### ✅ Depois

**ViewModel**:
```typescript
// components/viewmodels/MyComponentViewModel.ts
export const useMyComponentViewModel = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleLoadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilter = (searchTerm: string) => {
    const filtered = data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };
  
  return {
    filteredData,
    loading,
    handleLoadData,
    handleFilter,
  };
};
```

**View**:
```tsx
// components/MyComponent.tsx
export const MyComponent = () => {
  const { filteredData, loading, handleLoadData, handleFilter } = useMyComponentViewModel();
  
  return (
    <div>
      <button onClick={handleLoadData}>Carregar</button>
      <input onChange={(e) => handleFilter(e.target.value)} />
      
      {loading ? <p>Carregando...</p> : (
        <ul>
          {filteredData.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
      )}
    </div>
  );
};
```

### Exemplo 2: Extrair Código Duplicado para Utils

#### ❌ Antes
```tsx
// ComponentA.tsx
const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: `${company.name} - Holy Finder`,
      text: `Confira ${company.name}`,
      url: `${window.location.origin}/company/${company._id}`
    });
  }
};

// ComponentB.tsx
const shareCompany = async () => {
  if (navigator.share) {
    await navigator.share({
      title: `${institution.name} - Holy Finder`,
      text: `Confira ${institution.name}`,
      url: `${window.location.origin}/company/${institution._id}`
    });
  }
};
```

#### ✅ Depois

**Utils**:
```typescript
// utils/shareUtils.ts
export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export const getCompanyShareData = (cnpj: string, name: string): ShareData => ({
  title: `${name} - Holy Finder`,
  text: `Confira ${name} no Holy Finder`,
  url: `${window.location.origin}/company/${cnpj}`
});

export const shareContent = async (data: ShareData): Promise<void> => {
  if (!navigator.share) {
    console.warn('Web Share API not supported');
    return;
  }
  
  try {
    await navigator.share(data);
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
  }
};
```

**Uso**:
```tsx
// ComponentA.tsx
import { shareContent, getCompanyShareData } from '@/utils/shareUtils';

const handleShare = async () => {
  const shareData = getCompanyShareData(company._id, company.name);
  await shareContent(shareData);
};

// ComponentB.tsx
import { shareContent, getCompanyShareData } from '@/utils/shareUtils';

const shareCompany = async () => {
  const shareData = getCompanyShareData(institution._id, institution.name);
  await shareContent(shareData);
};
```

### Exemplo 3: Criar Hook Reutilizável

#### ❌ Antes
```tsx
// ComponentA.tsx
const [posts, setPosts] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const newPosts = await fetchPosts(page);
  setPosts([...posts, ...newPosts]);
  setPage(page + 1);
  setHasMore(newPosts.length > 0);
};

// ComponentB.tsx - código duplicado
const [items, setItems] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [hasMoreItems, setHasMoreItems] = useState(true);

const loadMoreItems = async () => {
  const newItems = await fetchItems(currentPage);
  setItems([...items, ...newItems]);
  setCurrentPage(currentPage + 1);
  setHasMoreItems(newItems.length > 0);
};
```

#### ✅ Depois

**Hook**:
```typescript
// hooks/useInfinitePosts.ts
export const useInfinitePosts = (fetchFn: (page: number) => Promise<any[]>) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const newItems = await fetchFn(page);
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
      setHasMore(newItems.length > 0);
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const reset = () => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  };
  
  return { items, hasMore, loading, loadMore, reset };
};
```

**Uso**:
```tsx
// ComponentA.tsx
const { items: posts, hasMore, loading, loadMore } = useInfinitePosts(fetchPosts);

// ComponentB.tsx
const { items, hasMore, loading, loadMore } = useInfinitePosts(fetchItems);
```

---

## 🎓 Checklist de Refatoração

Ao refatorar um componente, verifique:

- [ ] Toda lógica está no ViewModel?
- [ ] Não há funções inline em `onClick`, `onChange`, etc?
- [ ] Código duplicado foi extraído para utils/hooks/components?
- [ ] Imports estão organizados?
- [ ] Tipos TypeScript estão definidos?
- [ ] Error handling está implementado?
- [ ] Componente tem menos de 200 linhas?
- [ ] Nomes seguem convenções?
- [ ] Performance otimizada (memo, useMemo, useCallback)?
- [ ] Estado local vs global está correto?

---

## 📖 Resumo

### Frontend
```
Page → ViewModel (lógica) → View (apresentação) → Child Components
         ↓
    Hooks, Contexts, Services, Utils
```

### Backend
```
Route → Service → Repository → Model
```

### Regras de Ouro

1. **Componentes são apenas apresentação** - toda lógica vai para ViewModels
2. **Sem funções inline no JSX** - declare handlers fora
3. **DRY (Don't Repeat Yourself)** - extraia código duplicado
4. **Camadas bem definidas** - não pule camadas no backend
5. **TypeScript sempre** - tipos para tudo
6. **Error handling** - sempre trate erros
7. **Performance** - use memo, lazy loading quando necessário

---

> [!TIP]
> Ao refatorar, faça incrementalmente. Não tente refatorar tudo de uma vez. Comece por um componente, teste, e depois passe para o próximo.
