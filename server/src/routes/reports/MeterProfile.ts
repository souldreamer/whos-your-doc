import { Response } from '../Route';
import { Types } from 'mongoose';
import { MeterReadings } from '../../models/meter-readings.model';
import { JwtDecodedRequest } from '../Authenticate';
import { Injectable } from 'injection-js';

@Injectable()
export default class MeterProfile {
	async generate(req: JwtDecodedRequest, res: Response) {
		const meter = new Types.ObjectId(req.body.meter || req.query.meter);
		const startDate = new Date(+(req.body.startDate || req.query.startDate));
		const endDate = new Date(+(req.body.endDate || req.query.endDate));
		const loadProfile = await MeterReadings.find({
			date: {$gte: startDate, $lte: endDate},
			meter
		}).sort({date: 1});
		res.status(200).json(loadProfile);
	}
}
