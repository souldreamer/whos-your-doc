import { Request, Response } from './Route';
import * as shuffle from 'shuffle-array';
import { Injectable } from 'injection-js';
import * as faker from 'faker/locale/en';
import { AverageableDocument, Doctor } from '../models/doctor.model';

function getRandomNum(min: number = 0, max: number = 1): number {
	return Math.floor(min + Math.random() * (max - min));
}
function getRandomFromArray(array: any[], min: number = 0, max: number = 1): number[] {
	return shuffle(array).slice(0, getRandomNum(min, max));
}

function getRandomAverageable(): AverageableDocument {
	const numEntries = Math.floor(Math.random() * 100);
	return {
		numEntries,
		total: Math.random() * 3 * numEntries + 1
	}
}

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
];

async function createDoctor() {
	const gender = Math.random() < 0.5 ? 0 : 1;
	const name = `${faker.name.firstName(gender)} ${faker.name.lastName(gender)}`;
	const specialtiesArray = getRandomFromArray(specialties, 1, 3);
	await Doctor.create({
		name,
		gender: ['male', 'female'][gender],
		avatar: faker.image.avatar(),
		price: getRandomAverageable(),
		friendliness: getRandomAverageable(),
		punctuality: getRandomAverageable(),
		knowledge: getRandomAverageable(),
		specialties: specialtiesArray,
		profession: specialtiesArray[0],
		bio: faker.lorem.paragraph(),
		address: faker.address.streetAddress(),
		practiceName: `${name} Clinic`
	});
}

async function createDoctors() {
	await Promise.all(Array(10000).fill(0).map(createDoctor));
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