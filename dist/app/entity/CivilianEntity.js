"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@micro-fleet/common");
const persistence_1 = require("@micro-fleet/persistence");
class CivilianEntity extends persistence_1.EntityBase {
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
        this.deletedAt = undefined;
    }
    /**
     * @override
     */
    static get tableName() {
        return 'public.civilians';
    }
}
exports.CivilianEntity = CivilianEntity;
CivilianEntity.translator = new common_1.ModelAutoMapper(CivilianEntity);
//# sourceMappingURL=CivilianEntity.js.map