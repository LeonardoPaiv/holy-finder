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

export enum Religions {
    CATOLICA = 'Católica',
    EVANGELICA = 'Evangélica',
    ESPIRITA = 'Espírita',
    MATRIZ_AFRICANA = 'Matriz Africana',
    JUDAICA = 'Judaica',
    BUDDISTA = 'Budista',
    MUÇULMANA = 'Muçulmana',
    OUTRAS = 'Outras'
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
