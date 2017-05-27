import { Schema, model, Document, Types } from 'mongoose';

export const Averageable = new Schema({
	total: Schema.Types.Number,
	numEntries: Schema.Types.Number
});

export const Doctor = model('Doctor', new Schema({
	name: {type: Schema.Types.String, required: true, index: true},
	gender: {type: Schema.Types.String, enum: ['male', 'female'], required: true},
	price: {type: Schema.Types.Number, enum: [1, 2, 3]},
	friendliness: Averageable,
	punctuality: Averageable,
	knowledge: Averageable,
	specialties: [Schema.Types.String],
	profession: Schema.Types.String,
	bio: Schema.Types.String,
	address: Schema.Types.String,
	practiceName: Schema.Types.String
}));

export class AverageableNumber {
	total?: number;
	numEntries?: number;
}
export function getAverageableValue(num: AverageableNumber): number {
	return (num.total != null && num.numEntries != null && num.numEntries != 0)
		? num.total / num.numEntries : 0;
}

export interface DoctorDocument extends Document {
	name: string;
	gender: string;
	price?: number;
	friendliness?: AverageableNumber;
	punctuality?: AverageableNumber;
	knowledge?: AverageableNumber;
	specialties?: string[];
	profession?: string;
	bio?: string;
	address?: string;
	practiceName?: string;
}
