import mongoose, { Schema, Document } from 'mongoose';
import { Company } from '../../types';
import { EventSchema, GeoSchema, Religions } from './common';

// Define CompanyDocument type that extends both Company interface and Document
export type CompanyDocument = Company & Document;

const CompanySchema = new Schema<CompanyDocument>({
    _id: { type: String, required: true }, // CNPJ
    email: { type: String, required: true },
    name: { type: String, required: true },
    geo: { type: GeoSchema, required: true },
    type: {
        type: String,
        enum: Religions,
        required: true
    },
    photo: { type: String, required: false },
    tel: { type: String, required: false },
    address: { type: String, required: false },
    dedicatedMapsUrl: { type: String, required: false },
    events: [EventSchema],
    missas: [EventSchema],
    active: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
    _id: false // Disable auto _id since we define it manually
});

CompanySchema.index({ geo: '2dsphere' });

// Force model reload to pick up EventSchema changes
if (mongoose.models.Company) {
    delete mongoose.models.Company;
}

const CompanyModel = mongoose.model<CompanyDocument>('Company', CompanySchema);

const syncIndexes = () => {
    CompanyModel.syncIndexes().then(() => {
        console.log('Company indexes synced');
    }).catch((err: any) => {
        console.error('Company index sync failed', err);
    });
};

if (mongoose.connection.readyState === 1) {
    syncIndexes();
} else {
    mongoose.connection.once('connected', syncIndexes);
}

export default CompanyModel;
