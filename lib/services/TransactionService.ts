import { BaseService } from './BaseService';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { Transaction as ITransaction, PaginatedResult } from '../../types';
import { Document } from 'mongoose';

type TransactionDocument = ITransaction & Document;

export class TransactionService extends BaseService<TransactionDocument> {
    constructor() {
        super(new TransactionRepository());
    }

    async getTransactionsByDonator(donatorId: string): Promise<TransactionDocument[]> {
        return (this.repository as TransactionRepository).findByDonatorId(donatorId);
    }

    async getTransactionsByCategory(category: 'donation' | 'bill'): Promise<TransactionDocument[]> {
        return (this.repository as TransactionRepository).findByCategory(category);
    }

    async getTransactionsPaginated(
        filters: {
            donatorId?: string;
            category?: 'donation' | 'bill';
        },
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedResult<TransactionDocument>> {
        return (this.repository as TransactionRepository).findPaginated(filters, page, limit);
    }

    async getTotalByCategory(category: 'donation' | 'bill'): Promise<number> {
        return (this.repository as TransactionRepository).getTotalByCategory(category);
    }

    async getTotalByDonator(donatorId: string): Promise<number> {
        return (this.repository as TransactionRepository).getTotalByDonator(donatorId);
    }

    async createTransaction(data: Partial<ITransaction>): Promise<TransactionDocument> {
        // Validate required fields
        if (!data.photo || !data.title || !data.category || !data.description || !data.value || !data.donatorId) {
            throw new Error('Missing required fields');
        }

        // Validate category
        if (data.category !== 'donation' && data.category !== 'bill') {
            throw new Error('Invalid category. Must be "donation" or "bill"');
        }

        // Validate unit
        if (data.unit && data.unit !== 'R$' && data.unit !== 'USD') {
            throw new Error('Invalid unit. Must be "R$" or "USD"');
        }

        // Validate value is positive
        if (data.value <= 0) {
            throw new Error('Value must be positive');
        }

        return this.repository.create(data as any);
    }
}
