"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const back_lib_persistence_1 = require("back-lib-persistence");
const back_lib_common_contracts_1 = require("back-lib-common-contracts");
class AccountEntity extends back_lib_persistence_1.EntityBase {
    constructor() {
        super(...arguments);
        this.username = undefined;
        this.password = undefined;
        this.loginAttempts = undefined;
        this.lastAttemptAt = undefined;
        this.lastLoginAt = undefined;
        this.lastLoginFrom = undefined;
        this.unclockedAt = undefined;
        this.status = undefined;
        this.deletedAt = undefined;
        this.createdAt = undefined;
        this.updatedAt = undefined;
        this.civilianId = undefined;
    }
    /**
     * @override
     */
    static get tableName() {
        return AccountEntity.TABLE_NAME;
    }
}
// public static get relationMappings(): any {
// 	// Lazy reference to avoid circular reference.
// 	// `relationMappings()` is called only once for each connection.
// 	const { DeviceGroupEntity } = require('../entity/DeviceGroupEntity');
// 	return {
// 		belongtoDeviceGroups: {
// 			relation: Model.HasOneRelation,
// 			modelClass: DeviceGroupEntity,
// 			join: {
// 				from: 'public.devices.group_id',
// 				to: 'public.device_groups.id'
// 			}
// 		}
// 	};
// }
AccountEntity.TABLE_NAME = 'public.accounts';
exports.AccountEntity = AccountEntity;
AccountEntity.translator = new back_lib_common_contracts_1.ModelAutoMapper(AccountEntity);
