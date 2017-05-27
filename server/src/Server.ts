import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
// import * as jwt from 'jsonwebtoken';

import { RouteRenderFunction } from './routes/Route';
import { createServer } from 'http';

export type HTTPMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export interface RouteMountInformation {
	method: HTTPMethod | HTTPMethod[];
	path: string;
	route: RouteRenderFunction;
	isMiddleware?: boolean;
}

export class Server {
	app: express.Application;

	static getPort(defaultPort: number): number {
		try {
			const port = parseInt(process.env.PORT, 10);
			if (isNaN(port) || port < 0) {
				return defaultPort;
			}
			return port;
		} catch (e) {
			return defaultPort;
		}
	}

	static onServerMountError(error: NodeJS.ErrnoException) {
		if (error.syscall !== 'listen') {
			throw error;
		}

		switch (error.code) {
		case 'EACCESS':
			console.error('Creating server requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error('Port is already in use. Try another');
			process.exit(1);
			break;
		default:
			throw error;
		}
	}

	static bootstrap(routes: RouteMountInformation[] = []) {
		const server = new Server(routes);
		const port = Server.getPort(8080);
		server.app.set('port', port);

		const httpServer = createServer(server.app);
		httpServer.listen(port);
		httpServer.on('error', Server.onServerMountError);
		httpServer.on('connection', (socket) => {
			socket.setKeepAlive(true);
			socket.setTimeout(15 * 60 * 1000);
		});
		
		console.log(`Server listening on port ${port}`);
	}

	constructor(routes: RouteMountInformation[] = []) {
		this.app = express();

		this.app.use(cors());
		this.app.use(logger('dev'));
		this.app.use(bodyParser.json({strict: false}));
		this.app.use(bodyParser.urlencoded({extended: false}));
		
		for (const route of routes.filter(rt => rt.isMiddleware)) {
			const router = express.Router();
			router.use(route.route);
			this.app.use(route.path, router);
		}

		const router = express.Router();
		for (const route of routes.filter(rt => rt.isMiddleware !== true)) {
			const methods = Array.isArray(route.method) ? route.method : [route.method];
			for (const method of methods) {
				switch (method) {
				case 'GET':
					router.get(route.path, route.route);
					break;
				case 'POST':
					router.post(route.path, route.route);
					break;
				case 'DELETE':
					router.delete(route.path, route.route);
					break;
				case 'PUT':
					router.put(route.path, route.route);
					break;
				case 'PATCH':
					router.patch(route.path, route.route);
					break;
				default:
					break;
				}
			}
		}

		this.app.use('/', router);
	}
}
