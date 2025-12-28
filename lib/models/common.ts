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
    INSTITUTION_ADMIN = 'institution admin',
    INSTITUTION_OWNER = 'institution owner'
}

export enum UserRole {
    BASIC = 'basic',
    MODERATOR = 'moderator',
    SUPER_ADMIN = 'super admin',
    BANNED = 'banned'
}

export const EventSchema = new Schema({
    name: { type: String, required: true },
    // Dias da semana (para eventos recorrentes) - opcional
    days: [{
        type: String,
        enum: Object.values(WeekDays),
        required: false
    }],
    // Datas específicas (formato ISO: "2025-12-25") - opcional
    dates: [{
        type: String,
        required: false,
        validate: {
            validator: function(v: string) {
                // Valida formato ISO date (YYYY-MM-DD)
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: 'Date must be in ISO format (YYYY-MM-DD)'
        }
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
