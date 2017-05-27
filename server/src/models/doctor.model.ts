import { Schema, model, Document } from 'mongoose';

export const Averageable = new Schema({
	total: Schema.Types.Number,
	numEntries: Schema.Types.Number
});

export const Geolocation = new Schema({
	lat: Schema.Types.Number,
	lng: Schema.Types.Number
});

export const Doctor = model('Doctor', new Schema({
	name: {type: Schema.Types.String, required: true, index: true},
	gender: {type: Schema.Types.String, enum: ['male', 'female'], required: true},
	avatar: Schema.Types.String,
	price: Averageable,
	friendliness: Averageable,
	punctuality: Averageable,
	knowledge: Averageable,
	specialties: [Schema.Types.String],
	profession: Schema.Types.String,
	bio: Schema.Types.String,
	address: Schema.Types.String,
	practiceName: Schema.Types.String,
	geo: Geolocation
}));

export interface AverageableDocument {
	total?: number;
	numEntries?: number;
}
export function getAverageableValue(num: AverageableDocument): number {
	return (num.total != null && num.numEntries != null && num.numEntries != 0)
		? num.total / num.numEntries : 0;
}

export interface GeolocationDocument {
	lat: number,
	lng: number
}

export interface DoctorDocument extends Document {
	name: string;
	gender: string;
	avatar?: string;
	price?: AverageableDocument;
	friendliness?: AverageableDocument;
	punctuality?: AverageableDocument;
	knowledge?: AverageableDocument;
	specialties?: string[];
	profession?: string;
	bio?: string;
	address?: string;
	practiceName?: string;
	geo?: GeolocationDocument;
}
