"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const back_lib_foundation_1 = require("back-lib-foundation");
const back_lib_common_contracts_1 = require("back-lib-common-contracts");
const back_lib_common_util_1 = require("back-lib-common-util");
const back_lib_common_web_1 = require("back-lib-common-web");
const Types_1 = require("../constants/Types");
const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;
// const opts = {
// 	secretOrKey: TOKEN_CONFIG.jwtSecret,
// 	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// };
const ISSUER = 'http://localhost:3000';
let AuthAddOn = class AuthAddOn {
    constructor(_serverAddOn, _configProvider, _accountRepo) {
        this._serverAddOn = _serverAddOn;
        this._configProvider = _configProvider;
        this._accountRepo = _accountRepo;
    }
    get server() {
        return this._serverAddOn.server;
    }
    //#region Init
    /**
     * @see IServiceAddOn.init
     */
    init() {
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
    initAccessToken(opts) {
        let strategy = new JwtStrategy(opts, (payload, done) => {
            done(null, payload);
        });
        passport.use('jwt-access', strategy);
    }
    initRefreshToken(opts) {
        let strategy = new JwtStrategy(opts, (payload, done) => __awaiter(this, void 0, void 0, function* () {
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
        }));
        passport.use('jwt-refresh', strategy);
    }
    //#endregion Init
    authenticate(request, response, next) {
        return new Promise((resolve, reject) => {
            passport.authenticate('jwt-access', (error, payload, info, status) => {
                if (error) {
                    return reject(error);
                }
                resolve({ payload, info, status });
            })(request, response, next);
        });
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this._accountRepo.findByCredentials(username, password);
            if (user) {
                let token = yield this.createToken(user);
                return { token: token, role: '' };
            }
            return null;
            // this.createToken..
        });
    }
    createToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let sign = new Promise((resolve, reject) => {
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
                    expiresIn: 60 * 30,
                    issuer: ISSUER,
                }, 
                // Callback
                (err, token) => {
                    if (token) {
                        resolve(token);
                    }
                });
            });
            let token = yield sign;
            return token;
        });
    }
    /**
     * @see IServiceAddOn.deadLetter
     */
    deadLetter() {
        return Promise.resolve();
    }
    /**
     * @see IServiceAddOn.dispose
     */
    dispose() {
        return Promise.resolve();
    }
};
AuthAddOn = __decorate([
    back_lib_common_util_1.injectable(),
    __param(0, back_lib_common_util_1.inject(back_lib_common_web_1.Types.TRAILS_ADDON)),
    __param(1, back_lib_common_util_1.inject(back_lib_common_contracts_1.Types.CONFIG_PROVIDER)),
    __param(2, back_lib_common_util_1.inject(Types_1.Types.ACCOUNT_REPO)),
    __metadata("design:paramtypes", [back_lib_common_web_1.TrailsServerAddOn,
        back_lib_foundation_1.ConfigurationProvider, Object])
], AuthAddOn);
exports.AuthAddOn = AuthAddOn;
