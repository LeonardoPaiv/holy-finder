import mongoose, { Schema } from 'mongoose';

export interface Transaction {
    _id: string; // UUID
    photo: string;
    title: string;
    category: 'donation' | 'bill';
    description: string;
    value: number;
    unit: 'R$' | 'USD';
    donatorId: string | undefined;
    createdAt?: Date;
    updatedAt?: Date;
}

const TransactionSchema = new Schema<Transaction>({
    _id: { 
        type: String, 
        default: () => crypto.randomUUID() 
    },
    photo: { type: String, required: true },
    title: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['donation', 'bill'], 
        required: true 
    },
    description: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { 
        type: String, 
        enum: ['R$', 'USD'], 
        required: true,
        default: 'R$'
    },
    donatorId: { type: String, required: false }
}, {
    timestamps: true
});

// Add indexes for common queries
TransactionSchema.index({ donatorId: 1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ createdAt: -1 });

const TransactionModel = mongoose.models.Transaction || mongoose.model<Transaction>('Transaction', TransactionSchema);

export default TransactionModel;
