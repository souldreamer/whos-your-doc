import 'reflect-metadata';
import { ReflectiveInjector } from 'injection-js';

import * as mongoose from 'mongoose';

import { Server } from './src/Server';
import { Store } from './src/Store';

import Setup from './src/routes/Setup';
import Authenticate from './src/routes/Authenticate';

import { config as dotEnvConfig } from 'dotenv';
import { DbServer, JwtSecret } from './src/shared/env.tokens';
import { RouteRenderFunction, NextFunction, Request, Response } from './src/routes/Route';
import UserRoute from './src/routes/User';
import { Reports, MeterProfile } from './src/routes/reports/index';
dotEnvConfig();

(mongoose as any).Promise = global.Promise;
mongoose.connect(process.env.DB_SERVER);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.info('Connected to Mongo DB server');
});

const injector = ReflectiveInjector.resolveAndCreate([
	{provide: DbServer, useValue: process.env.DB_SERVER},
	{provide: JwtSecret, useValue: process.env.JWT_SECRET},
	Store,
	Setup,
	Authenticate,
	UserRoute,
	...Reports
]);

function wrapAsyncRoute(routeFn: RouteRenderFunction) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await routeFn(req, res, next);
		} catch (err) {
			next(err);
		}
	};
}

Server.bootstrap([
	{method: [], isMiddleware: true, path: '/api', route: injector.get(Authenticate).authVerification},
	{method: 'GET', path: '/onetime/setup', route: injector.get(Setup).execute},
	{method: 'POST', path: '/api/authenticate', route: wrapAsyncRoute(injector.get(Authenticate).auth)},
	{method: 'GET', path: '/api/areas', route: injector.get(UserRoute).getAreas},
	{method: 'GET', path: '/api/meters', route: wrapAsyncRoute(injector.get(UserRoute).getMeters)},
	{method: 'GET', path: '/api/reports/meter-profile', route: wrapAsyncRoute(injector.get(MeterProfile).generate)}
]);
