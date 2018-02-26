"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const back_lib_persistence_1 = require("back-lib-persistence");
const back_lib_common_contracts_1 = require("back-lib-common-contracts");
class CivilianEntity extends back_lib_persistence_1.EntityBase {
    constructor() {
        super(...arguments);
        this.fullname = undefined;
        this.birthday = undefined;
        this.gender = undefined;
        this.cellphone = undefined;
        this.homephone = undefined;
        this.address = undefined;
        this.addressLat = undefined;
        this.addressLong = undefined;
        this.maritalStatus = undefined;
        this.cityId = undefined;
    }
    /**
     * @override
     */
    static get tableName() {
        return CivilianEntity.TABLE_NAME;
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
CivilianEntity.TABLE_NAME = 'public.civilians';
exports.CivilianEntity = CivilianEntity;
CivilianEntity.translator = new back_lib_common_contracts_1.ModelAutoMapper(CivilianEntity);
