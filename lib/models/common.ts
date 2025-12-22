import { Schema } from 'mongoose';

export enum WeekDays {
    SEGUNDA = 'Segunda',
    TERCA = 'Terça',
    QUARTA = 'Quarta',
    QUINTA = 'Quinta',
    SEXTA = 'Sexta',
    SABADO = 'Sábado',
    DOMINGO = 'Domingo'
}

export { Religions } from '@/types';

export enum UserType {
    INACTIVE = 'inactive',
    COMUM = 'comum',
    INSTITUTION_ADMIN = 'institution admin'
}

export enum UserRole {
    BASIC = 'basic',
    MODERATOR = 'moderator',
    SUPER_ADMIN = 'super admin',
    BANNED = 'banned'
}

export const EventSchema = new Schema({
    name: { type: String, required: true },
    days: [{
        type: String,
        enum: Object.values(WeekDays),
        required: true
    }],
    hours: [{ type: String, required: true }],
    description: { type: String, required: false },
}, { _id: false });

export const GeoSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
    }
}, { _id: false });
