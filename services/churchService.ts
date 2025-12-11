import { Church } from '../types';

const MOCK_CHURCHES: Church[] = [
    {
        id: '1',
        name: 'Catedral da Sé',
        address: 'Praça da Sé, s/n - Sé, São Paulo - SP',
        lat: -23.550520,
        lng: -46.633308,
        image: 'https://picsum.photos/800/600?random=1',
        massTimes: ['Dom: 09:00, 11:00, 17:00', 'Seg-Sex: 12:00, 15:00'],
        description: 'A Catedral Metropolitana de São Paulo é um dos maiores templos neogóticos do mundo.',
        phone: '(11) 3107-6832'
    },
    {
        id: '2',
        name: 'Paróquia Nossa Senhora do Brasil',
        address: 'Praça Nossa Sra. do Brasil, 01 - Jardim América',
        lat: -23.5678,
        lng: -46.6698,
        image: 'https://picsum.photos/800/600?random=2',
        massTimes: ['Dom: 08:30, 10:00, 12:00', 'Sáb: 16:00'],
        description: 'Conhecida por sua beleza artística e cerimônias de casamento tradicionais.',
        phone: '(11) 3082-9786'
    },
    {
        id: '3',
        name: 'Igreja de São Bento',
        address: 'Largo de São Bento, s/n - Centro',
        lat: -23.5453,
        lng: -46.6342,
        image: 'https://picsum.photos/800/600?random=3',
        massTimes: ['Dom: 10:00 (Canto Gregoriano)', 'Diariamente: 07:00'],
        description: 'Histórico mosteiro beneditino com missas acompanhadas de canto gregoriano.',
        phone: '(11) 3328-8799'
    }
];

export const ChurchService = {
    getChurches: async (): Promise<Church[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...MOCK_CHURCHES];
    },

    getChurchById: async (id: string): Promise<Church | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_CHURCHES.find(c => c.id === id);
    },

    updateChurch: async (updatedChurch: Partial<Church> & { id?: string }): Promise<Church> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('Simulating update for:', updatedChurch);
        // In a real app we would update the backend. Here we just return the merged object.
        // For the specific case of InstitutionDashboard editing "Catedral da Sé" (id 1):
        const existing = MOCK_CHURCHES.find(c => c.name === updatedChurch.name) || MOCK_CHURCHES[0];
        return { ...existing, ...updatedChurch };
    }
};
