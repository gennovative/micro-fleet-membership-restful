import TrailsApp = require('trails');
import jwt = require('jsonwebtoken');
import * as passport from 'passport';
import * as passportJwt from 'passport-jwt';
import { ConfigurationProvider, Types as fT } from 'back-lib-foundation';
import { Types as cmT } from 'back-lib-common-contracts';
import { injectable, inject } from 'back-lib-common-util';
import { TrailsServerAddOn, Types as T } from 'back-lib-common-web';
import bluebird = require('bluebird');

import { Types as appT } from '../constants/Types';
import { IAccountRepository } from '../interfaces/IAccountRepository';

const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;
// const opts = {
// 	secretOrKey: TOKEN_CONFIG.jwtSecret,
// 	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// };
const ISSUER = 'http://localhost:3000';

export type AuthResult = {
	payload: any,
	info: any,
	status: any
};

@injectable()
export class AuthAddOn implements IServiceAddOn {

	constructor(
		@inject(T.TRAILS_ADDON) private _serverAddOn: TrailsServerAddOn,
		@inject(cmT.CONFIG_PROVIDER) private _configProvider: ConfigurationProvider,
		@inject(appT.ACCOUNT_REPO) private _accountRepo: IAccountRepository,
	) {
	}


	public get server(): TrailsApp {
		return this._serverAddOn.server;
	}


	//#region Init

	/**
	 * @see IServiceAddOn.init
	 */
	public init(): Promise<void> {
		this._serverAddOn.server['config'].web.middlewares.passportInit = passport.initialize();

		const opts = {
			algorithms: ['HS256'],
			secretOrKey: this._configProvider.get('jwtSecret'),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			issuer: ISSUER
		};
		this.initAccessToken(opts);
		// this.initRefreshToken(opts);
		return Promise.resolve();
	}

	private initAccessToken(opts): void {
		// `payload` is decrypted from Access token from header.
		let strategy = new JwtStrategy(opts, (payload, done) => {
			// TODO: 1. Validate payload object
			// Optional: Log timestamp for statistics purpose
			done(null, payload);
		});
		passport.use('jwt-access', strategy);
	}

	private initRefreshToken(opts): void {
		// `payload` is decrypted from Refresh token from header.
		let strategy = new JwtStrategy(opts, async (payload, done) => {
			// 1. Validate payload property
			// 2. Validate refresh token from db (exp)
			// 3. Update token exp time
			// 4. Return new payload

			// let user = await this._accountRepo.findByPk(payload.id);
			// //  = users[payload.id] || null;
			// if (user) {
			// 	return done(null, {
			// 		id: user.id
			// 	});
			// } else {
			// 	return done(new Error('User not found'), null);
			// }
			done();
		});
		passport.use('jwt-refresh', strategy);
	}

	//#endregion Init

	public authenticate(request, response, next): Promise<AuthResult> {
		return new Promise<any>((resolve, reject) => {
			passport.authenticate('jwt-access', (error, payload, info, status) => {
				if (error) {
					return reject(error);
				}
				resolve({ payload, info, status });
			})(request, response, next);
		});
	}

	public async login(username: string, password: string): Promise<any> {
		let user = await this._accountRepo.findByCredentials(username, password);
		if (user) {
			let token = await this.createToken(user);
			return { token: token, role: '' };
		}
		return null;
		// this.createToken..
	}

	public async createToken(payload): Promise<string> {
		let sign = new Promise<any>((resolve, reject) => {
			jwt.sign(
				// Data
				{
					accountId: payload.id,
					username: payload.username
				},
				// Secret
				this._configProvider.get('jwtSecret'), 
				// Config
				{
					expiresIn: 10,
					issuer: ISSUER,
				},
				// Callback
				(err, token) => {
					if (token) {
						resolve(token);
					}
				});
		});
		let token = await sign;
		return token;
	}



	/**
	 * @see IServiceAddOn.deadLetter
	 */
	public deadLetter(): Promise<void> {
		return Promise.resolve();
	}

	/**
	 * @see IServiceAddOn.dispose
	 */
	public dispose(): Promise<void> {
		return Promise.resolve();
	}
}