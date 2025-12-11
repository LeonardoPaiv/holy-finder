import { FeedPost } from '../types';

const MOCK_FEED: FeedPost[] = [
    {
        id: '1',
        author: 'Pascom Catedral',
        content: 'Hoje teremos adoração ao Santíssimo Sacramento às 19h. Todos estão convidados para este momento de profunda oração.',
        image: 'https://picsum.photos/800/400?random=10',
        date: '2 horas atrás'
    },
    {
        id: '2',
        author: 'Grupo de Jovens',
        content: 'O retiro de carnaval está chegando! As inscrições encerram nesta sexta-feira. Não deixe para a última hora.',
        date: '5 horas atrás'
    },
    {
        id: '3',
        author: 'Festa da Padroeira',
        image: 'https://picsum.photos/800/400?random=11',
        date: '1 dia atrás'
    }
];

export const FeedService = {
    getFeed: async (): Promise<FeedPost[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...MOCK_FEED];
    }
};
