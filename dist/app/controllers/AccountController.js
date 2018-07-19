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
const joi = require("joi");
const common_1 = require("@micro-fleet/common");
const web_1 = require("@micro-fleet/web");
const id_generator_1 = require("@micro-fleet/id-generator");
const AccountDTO_1 = require("../dto/AccountDTO");
const Types_1 = require("../constants/Types");
let AccountController = class AccountController extends web_1.RestControllerBase {
    //#endregion Getters & Setters
    constructor(_accRepo, _idGen, _authAddon) {
        super();
        this._accRepo = _accRepo;
        this._idGen = _idGen;
        this._authAddon = _authAddon;
    }
    //#region Getters & Setters
    get repo() {
        return this._accRepo;
    }
    get trans() {
        return AccountDTO_1.AccountDTO.translator;
    }
    async authenticate(req, res) {
        let body = req.body;
        let account = await this._accRepo.findByCredentials(body.username, body.password);
        if (account) {
            let [token, refreshToken] = await Promise.all([
                this._authAddon.createToken(account, false),
                this._authAddon.createToken(account, true)
            ]);
            // let token = await this._authAddon.createToken(account, false);
            // let refreshToken = await this._authAddon.createToken(account, true);
            let loggedAccount = await this._accRepo.patch({ id: account.id, refreshToken });
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
    //#region Basic CRUD operations
    /**
     * GET /accounts/countAll
     */
    async countAll(req, res) {
        const nRows = await this.repo.countAll();
        this.ok(res, nRows);
    }
    /**
     * POST /accounts
     */
    async create(req, res) {
        const dto = this.trans.merge(req['model'], {
            id: this._idGen.nextBigInt().toString()
        });
        const createdDto = await this.repo.create(dto);
        this.created(res, createdDto);
    }
    /**
     * DELETE /accounts/:id
     */
    async deleteSoft(req, res) {
        const id = req.params.id, [err, pk] = AccountDTO_1.AccountDTO.validator.pk(id);
        if (err) {
            this.validationError(res, err);
            return;
        }
        const nRows = await this.repo.deleteSoft(pk);
        this.ok(res, nRows);
    }
    /**
     * DELETE /accounts/hard/:id
     */
    async deleteHard(req, res) {
        const id = req.params.id, [err, pk] = AccountDTO_1.AccountDTO.validator.pk(id);
        if (err) {
            this.validationError(res, err);
            return;
        }
        const nRows = await this.repo.deleteHard(pk);
        this.ok(res, nRows);
    }
    /**
     * GET /accounts/exists?name=Gennova
     */
    async exists(req, res) {
        const uniqueProps = req.query;
        const gotIt = await this.repo.exists(uniqueProps);
        this.ok(res, gotIt);
    }
    /**
     * GET /accounts/:id
     */
    async findByPk(req, res) {
        const id = req.params.id, [err, pk] = AccountDTO_1.AccountDTO.validator.pk(id);
        if (err) {
            this.validationError(res, err);
            return;
        }
        const dto = await this.repo.findByPk(pk);
        this.ok(res, dto);
    }
    /**
     * GET /accounts/recover/:id
     */
    async recover(req, res) {
        const id = req.params.id, [err, pk] = AccountDTO_1.AccountDTO.validator.pk(id);
        if (err) {
            this.validationError(res, err);
            return;
        }
        const nRows = await this.repo.recover(pk);
        this.ok(res, nRows);
    }
    /**
     * GET /accounts/page/2/20/name/desc
     */
    async page(req, res) {
        let pageIndex, pageSize, sortBy, sortType, error;
        ({ value: pageIndex, error } = joi.number().min(1).default(1).validate(req.params.pageIndex));
        if (error) {
            throw error;
        }
        ({ value: pageSize, error } = joi.number().min(10).max(100).default(25).validate(req.params.pageSize));
        if (error) {
            throw error;
        }
        ({ value: sortBy, error } = joi.string().min(1).validate(req.params.sortBy));
        if (error) {
            throw error;
        }
        ({ value: sortType, error } = joi.string().valid('asc', 'desc').validate(req.params.sortType));
        if (error) {
            throw error;
        }
        const result = await this.repo.page(pageIndex, pageSize, {
            sortBy, sortType
        });
        this.ok(res, result ? result.asObject() : new common_1.PagedArray());
    }
    /**
     * PATCH /accounts
     */
    async patch(req, res) {
        const props = req['mode'];
        if (props.hasOwnProperty('password')) {
            return this.clientError(res, 'NOT_ALLOW_CHANGING_PASSWORD_WITH_THIS_ENDPOINT');
        }
        const updatedProps = await this.repo.patch(props);
        this.ok(res, updatedProps);
    }
    /**
     * PUT /accounts
     */
    async update(req, res) {
        const dto = req['mode'];
        if (dto.hasOwnProperty('password')) {
            return this.clientError(res, 'NOT_ALLOW_CHANGING_PASSWORD_WITH_THIS_ENDPOINT');
        }
        const updatedModel = await this.repo.update(dto);
        this.ok(res, updatedModel);
    }
};
__decorate([
    web_1.decorators.POST('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "authenticate", null);
__decorate([
    web_1.decorators.POST('refresh-token/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "refreshToken", null);
__decorate([
    web_1.decorators.GET('countAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "countAll", null);
__decorate([
    web_1.decorators.POST(),
    web_1.decorators.model({ ModelClass: AccountDTO_1.AccountDTO }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "create", null);
__decorate([
    web_1.decorators.DELETE(':id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteSoft", null);
__decorate([
    web_1.decorators.DELETE('hard/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "deleteHard", null);
__decorate([
    web_1.decorators.GET('exists'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "exists", null);
__decorate([
    web_1.decorators.GET(':id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "findByPk", null);
__decorate([
    web_1.decorators.GET('recover/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "recover", null);
__decorate([
    web_1.decorators.GET('page/:pageIndex?/:pageSize?/:sortBy?/:sortType?'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "page", null);
__decorate([
    web_1.decorators.PATCH(),
    web_1.decorators.model({
        ModelClass: AccountDTO_1.AccountDTO,
        isPartial: true
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "patch", null);
__decorate([
    web_1.decorators.PUT(),
    web_1.decorators.model({ ModelClass: AccountDTO_1.AccountDTO }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "update", null);
AccountController = __decorate([
    common_1.injectable(),
    web_1.decorators.controller('accounts'),
    web_1.decorators.authorized(),
    __param(0, common_1.inject(Types_1.Types.ACCOUNT_REPO)),
    __param(1, common_1.inject(id_generator_1.Types.ID_PROVIDER)),
    __param(2, common_1.inject(web_1.Types.AUTH_ADDON)),
    __metadata("design:paramtypes", [Object, id_generator_1.IdProviderAddOn,
        web_1.AuthAddOn])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=AccountController.js.map