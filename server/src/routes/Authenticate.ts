import { NextFunction, Request, Response } from './Route';
import { Inject, Injectable } from 'injection-js';
import { JwtSecret } from '../shared/env.tokens';
import { autobind } from 'core-decorators';
import { UserDocument } from '../models/user.model';

export interface JwtDecodedRequest extends Request {
	decoded: UserDocument;
}

@Injectable()
export default class Authenticate {
	constructor() {}
	
	@autobind
	async auth(req: Request, res: Response) {
/*		console.dir(req.body);
		const { username: name, password: pass } = req.body;
		const user = await User.findOne({name}) as UserDocument;
		if (user == null) {
			res.status(404).json({authenticated: false, message: 'User not found'});
			return;
		}
		password(pass).verifyAgainst(user.password, (error, verified) => {
			if (error) {
				return res.status(501).end(error);
			}
			if (!verified) {
				return res.status(500).json({authenticated: false, message: 'Wrong password'});
			}
			
			const token = jwt.sign(user.toObject(), this.jwtSecret, {expiresIn: '24h'});
			res.status(200).json({authenticated: true, token, id: user._id, username: user.name});
		});*/
	}
	
	@autobind
	authVerification(req: JwtDecodedRequest, res: Response, next: NextFunction) {
		console.log('[...] auth verification');
		if (req.path === '/authenticate') {
			console.log('authenticate call in authVerification');
			next();
			return;
		}
		
		const token = req.body.token || req.query.token || req.headers['x-access-token'];
/*		if (token != null) {
			jwt.verify(
				token,
				this.jwtSecret,
				(err: JsonWebTokenError | TokenExpiredError | NotBeforeError, decoded: UserDocument) => {
					if (err) {
						return res.status(500).json({success: false, message: 'Failed to authenticate token'});
					}*/
					req.decoded = token;//decoded;
					return next();
//				}
//			);
//		} else {
//			res.status(403).json({success: false, message: 'No token provided'});
//		}
	}
}
