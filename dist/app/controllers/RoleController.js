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
const RoleDTO_1 = require("../dto/RoleDTO");
const Types_1 = require("../constants/Types");
let RoleController = class RoleController extends web_1.RestControllerBase {
    //#endregion Getters & Setters
    constructor(_roleRepo, _idGen) {
        super();
        this._roleRepo = _roleRepo;
        this._idGen = _idGen;
    }
    //#region Getters & Setters
    get repo() {
        return this._roleRepo;
    }
    get trans() {
        return RoleDTO_1.RoleDTO.translator;
    }
    //#region Basic CRUD operations
    /**
     * GET /roles/countAll
     */
    async countAll(req, res) {
        const nRows = await this.repo.countAll();
        this.ok(res, nRows);
    }
    /**
     * POST /roles
     */
    async create(req, res) {
        const dto = this.trans.merge(req['model'], {
            id: this._idGen.nextBigInt().toString()
        });
        const createdDto = await this.repo.create(dto);
        this.created(res, createdDto);
    }
    /**
     * DELETE /roles/:id
     */
    async deleteHard(req, res) {
        const id = req.params.id, [err, pk] = RoleDTO_1.RoleDTO.validator.pk(id);
        if (err) {
            this.validationError(res, err);
            return;
        }
        const nRows = await this.repo.deleteHard(pk);
        this.ok(res, nRows);
    }
    /**
     * GET /roles/exists?name=Gennova
     */
    async exists(req, res) {
        const uniqueProps = req.query;
        const gotIt = await this.repo.exists(uniqueProps);
        this.ok(res, gotIt);
    }
    /**
     * GET /roles/:id
     */
    async findByPk(req, res) {
        const id = req.params.id, [err, pk] = RoleDTO_1.RoleDTO.validator.pk(id);
        if (err) {
            this.validationError(res, err);
            return;
        }
        const dto = await this.repo.findByPk(pk);
        this.ok(res, dto);
    }
    /**
     * GET /roles/page/2/20/name/desc
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
     * PATCH /roles
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
     * PUT /roles
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
    web_1.decorators.GET('countAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "countAll", null);
__decorate([
    web_1.decorators.POST(),
    web_1.decorators.model({ ModelClass: RoleDTO_1.RoleDTO }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
__decorate([
    web_1.decorators.DELETE(':id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "deleteHard", null);
__decorate([
    web_1.decorators.GET('exists'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "exists", null);
__decorate([
    web_1.decorators.GET(':id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "findByPk", null);
__decorate([
    web_1.decorators.GET('page/:pageIndex?/:pageSize?/:sortBy?/:sortType?'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "page", null);
__decorate([
    web_1.decorators.PATCH(),
    web_1.decorators.model({
        ModelClass: RoleDTO_1.RoleDTO,
        isPartial: true
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "patch", null);
__decorate([
    web_1.decorators.PUT(),
    web_1.decorators.model({ ModelClass: RoleDTO_1.RoleDTO }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "update", null);
RoleController = __decorate([
    common_1.injectable(),
    web_1.decorators.controller('roles'),
    web_1.decorators.authorized(),
    __param(0, common_1.inject(Types_1.Types.ROLE_REPO)),
    __param(1, common_1.inject(id_generator_1.Types.ID_PROVIDER)),
    __metadata("design:paramtypes", [Object, id_generator_1.IdProviderAddOn])
], RoleController);
exports.RoleController = RoleController;
//# sourceMappingURL=RoleController.js.map