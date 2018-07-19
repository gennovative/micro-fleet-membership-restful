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
const common_1 = require("@micro-fleet/common");
const persistence_1 = require("@micro-fleet/persistence");
const CivilianEntity_1 = require("../entity/CivilianEntity");
const CivilianDTO_1 = require("../dto/CivilianDTO");
let CivilianRepository = class CivilianRepository extends persistence_1.RepositoryBase {
    constructor(dbConnector) {
        super(CivilianEntity_1.CivilianEntity, CivilianDTO_1.CivilianDTO, dbConnector);
    }
};
CivilianRepository = __decorate([
    common_1.injectable(),
    __param(0, common_1.inject(persistence_1.Types.DB_CONNECTOR)),
    __metadata("design:paramtypes", [Object])
], CivilianRepository);
exports.CivilianRepository = CivilianRepository;
//# sourceMappingURL=CivilianRepository.js.map