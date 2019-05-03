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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const common_1 = require("@micro-fleet/common");
const oauth_1 = require("@micro-fleet/oauth");
const web_1 = require("@micro-fleet/web");
const LoginViewModel_1 = require("../models/view/LoginViewModel");
const Types_1 = require("../constants/Types");
let AuthController = class AuthController extends web_1.RestControllerBase {
    //#endregion Getters & Setters
    constructor(_accRepo, _authAddon) {
        super();
        this._accRepo = _accRepo;
        this._authAddon = _authAddon;
    }
    //#region Getters & Setters
    get repo() {
        return this._accRepo;
    }
    async authenticate(req, res) {
        const credentials = req['model'];
        const account = await this.repo.findByCredentials(credentials.username, credentials.password);
        if (!account) {
            // TODO 1: Should increase loginAttempt
            // TODO 2: Should lock when exceed login limits
            return this.unauthorized(res);
        }
        const payload = {
            accountId: account.id,
            username: account.username,
            role: account.role,
        };
        const [token, refreshToken] = await Promise.all([
            this._authAddon.createToken(payload, false),
            this._authAddon.createToken(payload, true),
        ]);
        const loggedAccount = await this.repo.patch({ id: account.id, refreshToken });
        if (loggedAccount) {
            return this.ok(res, {
                username: account.username,
                role: account.role,
                token: token,
                refreshToken: refreshToken,
            });
        }
        return this.internalError(res, 'An error occured!');
        // TODO: Should return only username, fullname and roles.
    }
    async refreshToken(req, res) {
        const refreshToken = req.body.refreshToken;
        const accountId = req.params.id;
        const isTokenValid = await this._accRepo.checkRefresh(accountId, refreshToken);
        if (!isTokenValid) {
            return this.forbidden(res, 'INVALID_REFRESH_TOKEN');
        }
        const account = {
            id: accountId,
            username: req.params['username'],
        };
        const token = await this._authAddon.createToken(account, false);
        return this.ok(res, { token: token });
    }
};
__decorate([
    web_1.decorators.POST('login'),
    web_1.decorators.model({ ModelClass: LoginViewModel_1.LoginViewModel }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticate", null);
__decorate([
    web_1.decorators.POST('refresh-token/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
AuthController = __decorate([
    web_1.decorators.controller('auth'),
    __param(0, common_1.inject(Types_1.Types.ACCOUNT_REPO)),
    __param(1, common_1.inject(oauth_1.Types.AUTH_ADDON)),
    __metadata("design:paramtypes", [Object, oauth_1.AuthAddOn])
], AuthController);
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map