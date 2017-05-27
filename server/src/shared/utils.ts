import { Types } from 'mongoose';

export function mapToObjectId(array: (string|number|Types.ObjectId)[]): Types.ObjectId[] {
	return array.map(element => new Types.ObjectId(element));
}
