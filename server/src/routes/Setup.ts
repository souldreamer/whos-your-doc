import { Request, Response } from './Route';
// import * as shuffle from 'shuffle-array';
import { Injectable } from 'injection-js';
import * as faker from 'faker/locale/en';
import { AverageableDocument, Doctor, GeolocationDocument } from '../models/doctor.model';

/*function getRandomNum(min: number = 0, max: number = 1): number {
	return Math.floor(min + Math.random() * (max - min));
}
function getRandomFromArray(array: any[], min: number = 0, max: number = 1): number[] {
	return shuffle(array).slice(0, getRandomNum(min, max));
}*/

function getRandomAverageable(): AverageableDocument {
	const numEntries = Math.floor(Math.random() * 100);
	return {
		numEntries,
		total: Math.random() * 3 * numEntries + 1
	}
}

/*
const specialties = [
	'Allergology', 'Andrology', 'Anesthesia', 'Angiology', 'Aviation medicine', 'Biomedicine',
	'Cardiology', 'Dentistry', 'Dentistry branches', 'Dermatology', 'Disaster medicine',
	'Emergency medicine', 'Endocrinology', 'Family medicine', 'Fictional medical specialists',
	'Gastroenterology', 'General practice', 'Medical genetics', 'Geriatrics', 'Gerontology', 'Gynaecology',
	'Hematology', 'Hepatology', 'Immunology', 'Infectious diseases', 'Intensive care medicine',
	'Internal medicine', 'Men\'s health', 'Military medicine', 'Nephrology', 'Neurology',
	'Nuclear medicine', 'Obstetrics', 'Oncology', 'Ophthalmology', 'Otorhinolaryngology',
	'Palliative medicine', 'Pathology', 'Pediatrics', 'Podiatry', 'Preventive medicine',
	'Prison medicine', 'Psychiatric specialities', 'Psychiatry', 'Pulmonology', 'Radiology',
	'Rehabilitation medicine', 'Rheumatology', 'Serology', 'Sexual health', 'Sleep medicine',
	'Space medicine', 'Sports medicine', 'Sports physicians', 'Surgery', 'Surgical specialties',
	'Toxicology', 'Transplantation medicine', 'Trichology', 'Tropical medicine', 'Urology',
	'Wilderness medicine'
];*/

interface IDoctor {
	name: string;
	gender: string;
	avatar?: string;
	specialties?: string[];
	profession?: string;
	address?: string;
	practiceName?: string;
	geo?: GeolocationDocument;
}

const DOCTORS: IDoctor[] = [
	{
		name: '',
		gender: '',
		avatar: '',
		specialties: [''],
		profession: '',
		address: '',
		practiceName: '',
		geo: {
			lat: 0,
			lng: 0
		}
	}
];

async function createDoctor(doc: IDoctor) {
	await Doctor.create({
		name: doc.name,
		gender: doc.gender,
		avatar: doc.avatar,
		price: getRandomAverageable(),
		friendliness: getRandomAverageable(),
		punctuality: getRandomAverageable(),
		knowledge: getRandomAverageable(),
		specialties: doc.specialties,
		profession: doc.profession,
		bio: faker.lorem.paragraph(),
		address: doc.address,
		practiceName: doc.practiceName,
		geo: doc.geo
	});
}

async function createDoctors() {
//	await Promise.all(Array(10000).fill(0).map(createDoctor));
	await Promise.all(DOCTORS.map(doc => createDoctor(doc)));
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
			createDoctors()
		);
	}
}