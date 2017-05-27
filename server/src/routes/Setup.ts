import { Request, Response } from './Route';
import * as password from 'password-hash-and-salt';
import { Types } from 'mongoose';
import * as shuffle from 'shuffle-array';
import { Injectable } from 'injection-js';

const MAX_NUM_METERS = 35;
function getRandomNumMeters(min: number = 0, max: number = MAX_NUM_METERS): number {
	return Math.floor(min + Math.random() * (max - min));
}
function getRandomMeters(min: number = 0, max: number = MAX_NUM_METERS): number[] {
	return shuffle(Array(max).fill(0).map((x, i) => i)).slice(0, getRandomNumMeters(min, max));
}

async function hashPassword(pass: string) {
	let futurePassword = new Promise((resolve, reject) => {
		password(pass).hash((error, hash) => {
			if (error) {
				return reject(error);
			}
			resolve(hash);
		});
	});
	return await futurePassword;
}

interface UserType {
	name: string;
	password: string;
	rights: number[];
	areaRights: string[];
	meterRights: number[];
	passwordLastUpdated: Date;
	updated: Date;
}

const NOW = new Date();
const UPD = {passwordLastUpdated: NOW, updated: NOW};
const SETUP_USERS: UserType[] = [
	{
		name: 'userAll',
		password: 'bla',
		rights: [],
		areaRights: ['World'],
		meterRights: [],
		...UPD
	},
	{
		name: 'userRO',
		password: 'robla',
		rights: [],
		areaRights: ['Romania'],
		meterRights: getRandomMeters(5, 10),
		...UPD
	},
	{
		name: 'userTM',
		password: 'tmbla',
		rights: [],
		areaRights: ['Timis'],
		meterRights: getRandomMeters(1, 3),
		...UPD
	},
	{
		name: 'userSM',
		password: 'smbla',
		rights: [],
		areaRights: ['Italy', 'Switzerland', 'China'],
		meterRights: [],
		...UPD
	}
];

async function createUsers() {
	const meters = await Meter.find();
	const users = await Promise.all(SETUP_USERS.map(async (user) => ({
		...user,
		password: await hashPassword(user.password),
		areaRights: await Promise.all(user.areaRights.map(async (name) => await Area.findOne({name}))),
		meterRights: user.meterRights.map(meterIndex => meters[meterIndex]._id)
	})));
	await User.create(users);
}

interface AreaType {
	name: string;
	children: AreaType[] | null;
	meters: number;
}

const SETUP_AREAS: AreaType[] = [
	{name: 'World', meters: 10, children: [
		{name: 'Europe', meters: 0, children: [
			{name: 'Romania', meters: 5, children: [
				{name: 'Timis', meters: 5, children: null},
				{name: 'Bucuresti', meters: 2, children: null}
			]},
			{name: 'Italy', meters: 1, children: null},
			{name: 'Switzerland', meters: 1, children: null}
		]},
		{name: 'Asia', meters: 5, children: [
			{name: 'Japan', meters: 0, children: [
				{name: 'Tokyo', meters: 5, children: null}
			]},
			{name: 'China', meters: 1, children: null}
		]}
	]}
];

async function createArea(area: AreaType, parent?: Types.ObjectId): Promise<Types.ObjectId> {
	let children: Types.ObjectId[] = [];
	
	let dbArea = await Area.create({
		name: area.name,
		parent,
		children
	}) as AreaDocument;
	
	dbArea.children = dbArea.children || [];
	for (let child of area.children || []) {
		dbArea.children.push(await createArea(child, dbArea._id));
	}
	await dbArea.save();
	
	await Promise.all(Array(area.meters).fill(0).map(_ => createMeter(dbArea._id)));
	await Promise.all(Array(area.meters * 100).fill(0).map(_ => createMeter(dbArea._id, true)));
	return dbArea._id;
}

async function createAreas() {
	for (let area of SETUP_AREAS) {
		await createArea(area);
	}
	setImmediate(computeAllAreas);
}

function randomMeterName(): string {
	return `Meter ${Math.floor(Math.random() * Math.pow(36, 5)).toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

async function createMeter(parentArea: Types.ObjectId, isFiller: boolean = false) {
	const meter = await Meter.create({
		name: randomMeterName(),
		area: parentArea,
		updated: NOW
	}) as MeterDocument;
	const numBaseDays = isFiller ? 1 : 45;
	const numRandomDays = isFiller ? 6 : 30;
	await createReadings(meter._id, Math.floor(Math.random() * numRandomDays) + numBaseDays);
}

function addHours(date: Date, hours: number): Date {
	return new Date(date.valueOf() + hours * 60 * 60 * 1000);
}

async function createReadings(meter: Types.ObjectId, numDays: number) {
	const readings = [];
	let crtDate = addHours(new Date(NOW.getUTCFullYear(), NOW.getUTCMonth(), NOW.getUTCDate()), -1);
	const baseConsumption = Math.random() * 1000;
	const rndConsumption = () => baseConsumption + (Math.random() - 0.5) * baseConsumption * 0.1;
	for (let i = 0; i < numDays; i++) {
		const currentDay = crtDate.getDate();
		while (currentDay === crtDate.getDate()) {
			readings.push({
				meter,
				date: crtDate,
				Qi: rndConsumption(),
				Qe: rndConsumption(),
				Wi: rndConsumption(),
				We: rndConsumption()
			});
			crtDate = addHours(crtDate, -1);
		}
	}
	await MeterReadings.create(readings);
}

@Injectable()
export default class Setup {
	static success(res: Response) {
		res.status(200).end();
	}
	
	static fail(res: Response, err?: Error) {
		res.status(501).end(err);
	}
	
	static maker<T>(res: Response, promise: Promise<T>): Promise<void> {
		return promise.then(() => Setup.success(res), err => Setup.fail(res, err));
	}
	
	execute(req: Request, res: Response) {
		Setup.maker(
			res,
			createAreas()
			.then(createUsers)
		);
	}
}