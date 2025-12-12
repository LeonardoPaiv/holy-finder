import mongoose, { Schema } from 'mongoose';
import { Company, CompanyType } from '../../types';
import { EventSchema, GeoSchema, Religions } from './common';

const CompanySchema = new Schema<Company>({
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
    events: [EventSchema],
    missas: [EventSchema],
    level: {
        type: String,
        enum: ['comum', 'admin'],
        required: true,
        default: 'comum'
    }
}, {
    timestamps: true,
    _id: false // Disable auto _id since we define it manually
});

export default mongoose.models.Company || mongoose.model<Company>('Company', CompanySchema);
