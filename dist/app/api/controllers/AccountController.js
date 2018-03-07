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
const express = require("express");
const TrailsApp = require("trails");
const back_lib_common_util_1 = require("back-lib-common-util");
const back_lib_common_web_1 = require("back-lib-common-web");
const back_lib_id_generator_1 = require("back-lib-id-generator");
// import { AccountDTO } from '../../dto/AccountDTO';
// import { IAccountRepository } from '../../interfaces/IAccountRepository';
const back_lib_membership_contracts_1 = require("back-lib-membership-contracts");
// import { IRoleRepository } from '../../interfaces/IRoleRepository';
const AuthFilter_1 = require("back-lib-common-web/dist/app/filters/AuthFilter");
// import { Types as T } from '../../constants/Types';
const { controller, action, filter } = back_lib_common_web_1.decorators;
const ROLE_REPO = 'membership.IRoleRepository';
let AccountController = class AccountController extends back_lib_common_web_1.RestCRUDControllerBase {
    constructor(trailsApp, _repo, 
        // @inject(ROLE_REPO) private _roleRepo: IRoleRepository,
        _idGen, _authAddon) {
        super(trailsApp, back_lib_membership_contracts_1.AccountDTO);
        this._repo = _repo;
        this._idGen = _idGen;
        this._authAddon = _authAddon;
    }
    authenticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = req.body;
            let account = yield this._repo.findByCredentials(body.username, body.password);
            if (account) {
                let [token, refreshToken] = yield Promise.all([
                    this._authAddon.createToken(account, false),
                    this._authAddon.createToken(account, true)
                ]);
                // let token = await this._authAddon.createToken(account, false);
                // let refreshToken = await this._authAddon.createToken(account, true);
                let loggedAccount = yield this._repo.patch({ id: account.id, refreshToken });
                if (loggedAccount) {
                    return this.ok(res, {
                        id: account.id,
                        username: account.username,
                        role: account.role,
                        token: token,
                        refreshToken: refreshToken
                    });
                }
                return this.internalError(res, 'An error occured!');
            }
            return this.unauthorized(res);
            //TODO: Should return only username, fullname and roles.
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let refreshToken = req.body.refreshToken;
            let accountId = req.params['accountId'];
            let checkToken = yield this._repo.checkRefresh(accountId, refreshToken);
            let account = {
                id: accountId,
                username: req.params['username'],
            };
            let token = yield this._authAddon.createToken(account, false);
            return this.ok(res, { token: token });
        });
    }
    /**
     * @override
     */
    doCreate(dto, req, res) {
        dto = this.translator.merge(dto, {
            id: this._idGen.nextBigInt().toString()
        });
        return this.repo.create(dto);
    }
    /**
     * @override
     */
    // @filter(AuthFilter, f => f.guard)
    doPatch(model, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = req.body.model;
            let id = body.id, username = body.username, password = body.password, status = body.status, roleId = body.roleId;
            let patchRes = yield this._repo.changePassword({ id, username, password, status, roleId });
            return patchRes;
        });
    }
};
__decorate([
    action('POST', 'login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "authenticate", null);
__decorate([
    action('POST', 'refresh-token'),
    filter(AuthFilter_1.AuthFilter, f => f.guard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "refreshToken", null);
AccountController = __decorate([
    back_lib_common_util_1.injectable(),
    controller('accounts'),
    __param(0, back_lib_common_util_1.inject(back_lib_common_web_1.Types.TRAILS_APP)),
    __param(1, back_lib_common_util_1.inject(back_lib_membership_contracts_1.Types.ACCOUNT_REPO)),
    __param(2, back_lib_common_util_1.inject(back_lib_id_generator_1.Types.ID_PROVIDER)),
    __param(3, back_lib_common_util_1.inject(back_lib_common_web_1.Types.AUTH_ADDON)),
    __metadata("design:paramtypes", [TrailsApp, Object, back_lib_id_generator_1.IdProvider,
        back_lib_common_web_1.AuthAddOn])
], AccountController);
exports.AccountController = AccountController;
