import { Model, Document, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document<any>> {
    constructor(protected readonly model: Model<T>) { }

    async create(data: Partial<T>): Promise<T> {
        const created = await this.model.create(data as any);
        return created as any;
    }

    async findAll(filter: any = {}): Promise<T[]> {
        return this.model.find(filter).exec();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async findOne(filter: any): Promise<T | null> {
        return this.model.findOne(filter).exec();
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }
}
