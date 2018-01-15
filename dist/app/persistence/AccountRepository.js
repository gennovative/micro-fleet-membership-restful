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
const scrypt = require("scrypt");
const back_lib_common_util_1 = require("back-lib-common-util");
const back_lib_persistence_1 = require("back-lib-persistence");
const AccountDTO_1 = require("../dto/AccountDTO");
const AccountEntity_1 = require("../entity/AccountEntity");
let AccountRepository = class AccountRepository extends back_lib_persistence_1.RepositoryBase {
    constructor(dbConnector) {
        super(AccountEntity_1.AccountEntity, dbConnector);
    }
    /**
     * @override
     */
    create(model, opts) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            let passBuffer = yield this.hash(model.password);
            let password = passBuffer.toString('base64');
            console.log(password);
            model = AccountDTO_1.AccountDTO.translator.merge(model, {
                password
            });
            return yield _super("create").call(this, model, opts);
        });
    }
    findByCredentials(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryProm = this._processor.executeQuery((builder) => {
                return builder
                    .where('username', username)
                    .limit(1);
            });
            let [account] = yield Promise.all([queryProm]);
            let isMatched = yield this.verify(account.password, password);
            console.log('isMatched: ', isMatched);
            return (isMatched ? account : null);
        });
    }
    hash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = yield scrypt.params(0.1);
            return yield scrypt.kdf(password, params);
        });
    }
    verify(hash, password) {
        return scrypt.verifyKdf(hash, password);
    }
};
AccountRepository = __decorate([
    back_lib_common_util_1.injectable(),
    __param(0, back_lib_common_util_1.inject(back_lib_persistence_1.Types.DB_CONNECTOR)),
    __metadata("design:paramtypes", [Object])
], AccountRepository);
exports.AccountRepository = AccountRepository;
