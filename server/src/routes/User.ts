import { Injectable } from 'injection-js';

@Injectable()
export default class User {
	
	/*
	getAreas(req: JwtDecodedRequest, res: Response) {
		const areaRights = mapToObjectId(req.decoded.areaRights || []);
		res.status(200).json(getUserAreas(areaRights));
	}
	
	async getMeters(req: JwtDecodedRequest, res: Response) {
		const start = +(req.body.start || req.query.start || 0);
		const limit = +(req.body.limit || req.query.limit || 50);
		const filters: Partial<MeterFilter> = JSON.parse(req.body.filters || req.query.filters || '{}');
		const areaRights = mapToObjectId(req.decoded.areaRights || []);
		const meterRights = mapToObjectId(req.decoded.meterRights || []);
		const userAreas = getUserAreas(areaRights).map(area => area._id);
		const userMetersQuery = () => getUserMeters(meterRights, userAreas).sort({name: 1});
		const userFilteredMeters = async () => {
			let filteredMeters = userMetersQuery();
			if (filters.id != null) {
				filteredMeters = filteredMeters.find({_id: new Types.ObjectId(filters.id)});
			}
			if (filters.name != null) {
				filteredMeters = filteredMeters.find({name: new RegExp(filters.name, 'i')});
			}
			if (filters.area != null) {
				filteredMeters = filteredMeters.populate({
					path: 'area',
					match: { name: new RegExp(filters.area, 'i') }
				});
			} else {
				filteredMeters = filteredMeters.populate('area');
			}
			if (filters.general != null) {
				const generalRegExp = new RegExp(filters.general, 'i');
				return (await filteredMeters).filter((meter: any) =>
					meter.area != null && (generalRegExp.test(meter.area.name) || generalRegExp.test(meter.name))
				);
			}
			return (await filteredMeters).filter(meter => meter.area != null);
		};
		const filteredMeters = (await userFilteredMeters());
		const userMeters = filteredMeters.slice(start, start + limit);
		const numUserMeters = filteredMeters.length;
		res.status(200).json({
			total: numUserMeters,
			start,
			data: userMeters
		});
	}*/
}
