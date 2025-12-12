import { BaseRepository } from '../repositories/BaseRepository';
import { Document, UpdateQuery } from 'mongoose';

export abstract class BaseService<T extends Document> {
    constructor(protected readonly repository: BaseRepository<T>) { }

    async create(data: Partial<T>): Promise<T> {
        return this.repository.create(data);
    }

    async findAll(filter: any = {}): Promise<T[]> {
        return this.repository.findAll(filter);
    }

    async findById(id: string): Promise<T | null> {
        return this.repository.findById(id);
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        return this.repository.update(id, data);
    }

    async delete(id: string): Promise<T | null> {
        return this.repository.delete(id);
    }
}
