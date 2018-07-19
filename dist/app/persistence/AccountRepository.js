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
const scrypt = require("scrypt");
const common_1 = require("@micro-fleet/common");
const persistence_1 = require("@micro-fleet/persistence");
const AccountEntity_1 = require("../entity/AccountEntity");
const AccountDTO_1 = require("../dto/AccountDTO");
let AccountRepository = class AccountRepository extends persistence_1.RepositoryBase {
    constructor(dbConnector) {
        super(AccountEntity_1.AccountEntity, AccountDTO_1.AccountDTO, dbConnector);
    }
    /**
     * @override
     */
    async create(model, opts) {
        let queryProm = this._processor.executeQuery((builder) => {
            let query = builder
                .select('accounts.*', 'account_roles.name as role')
                .leftOuterJoin('account_roles', 'accounts.role_id', 'account_roles.id')
                .where('username', model.username)
                .limit(1);
            // console.log(query.toSQL());
            return query;
        });
        let account = await queryProm;
        if (!account[0]) {
            const passBuffer = await this._hash(model.password);
            const password = passBuffer.toString('base64');
            model = AccountDTO_1.AccountDTO.translator.merge(model, {
                password
            });
            return await super.create(model, opts);
        }
        return null;
    }
    async findByCredentials(username, password) {
        let queryProm = this._processor.executeQuery((builder) => {
            let query = builder
                .select('accounts.*', 'account_roles.name as role')
                .leftOuterJoin('account_roles', 'accounts.role_id', 'account_roles.id')
                .where('username', username)
                .limit(1);
            // console.log(query.toSQL());
            return query;
        });
        const account = await queryProm;
        if (account[0]) {
            const passBuffer = Buffer.from(account[0].password, 'base64');
            const isMatched = await this._verify(passBuffer, password);
            let accoutnDto = this._processor.toDTO(account[0], false);
            accoutnDto.role = account[0]['role'];
            return (isMatched ? accoutnDto : null);
        }
        return null;
    }
    async checkRefresh(id, refreshToken) {
        let queryProm = this._processor.executeQuery((builder) => {
            let query = builder.where({
                refresh_token: refreshToken,
                id: id
            }).limit(1);
            return query;
        });
        const account = await queryProm;
        return (account && account[0]);
    }
    async _hash(password) {
        let params = await scrypt.params(0.1);
        return await scrypt.kdf(password, params);
    }
    _verify(kdf, key) {
        return scrypt.verifyKdf(kdf, key);
    }
    async changePassword(id, password) {
        const passBuffer = await this._hash(password);
        const passStr = passBuffer.toString('base64');
        return this.patch({ id, password: passStr })
            .then((props) => {
            return (!!props);
        });
    }
};
AccountRepository = __decorate([
    common_1.injectable(),
    __param(0, common_1.inject(persistence_1.Types.DB_CONNECTOR)),
    __metadata("design:paramtypes", [Object])
], AccountRepository);
exports.AccountRepository = AccountRepository;
//# sourceMappingURL=AccountRepository.js.map