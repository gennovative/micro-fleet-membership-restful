"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const common_1 = require("@micro-fleet/common");
const isSupportTenancy = false;
/**
 * Defined available states on a account.
 *
 * @export
 * @enum {number}
 */
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SINGLE"] = "single";
    MaritalStatus["MARRIED"] = "married";
    MaritalStatus["SEPARATED"] = "separated";
    MaritalStatus["DEVORCED"] = "devorced";
    MaritalStatus["WIDOWED"] = "widowed";
})(MaritalStatus = exports.MaritalStatus || (exports.MaritalStatus = {}));
/**
 * Represents a group of setting items, can be assigned to programs or program groups.
 */
class CivilianDTO {
    constructor() {
        /**
         * Gets account id.
         */
        this.id = undefined;
        /**
         * Gets account username.
         */
        this.fullname = undefined;
        /**
         * Gets the birthday.
         */
        this.birthday = undefined;
        /**
         * Gets the gender.
         */
        this.gender = undefined;
        /**
         * Gets the cellphone.
         */
        this.cellphone = undefined;
        /**
         * Gets the homephone.
         */
        this.homephone = undefined;
        /**
         * Gets the address.
         */
        this.address = undefined;
        /**
         * Gets the address latitude.
         */
        this.addressLat = undefined;
        /**
         * Gets the address longtitude.
         */
        this.addressLong = undefined;
        /**
         * Gets the material status.
         */
        this.maritalStatus = undefined;
        /**
         * Gets the city Id.
         */
        this.cityId = undefined;
    }
}
exports.CivilianDTO = CivilianDTO;
CivilianDTO.validator = common_1.JoiModelValidator.create({
    fullname: joi.string().min(1).max(255).required(),
    birthday: joi.object().type(Date, 'Date').allow(null).optional(),
    gender: joi.string().min(1).max(20).optional(),
    cellphone: joi.string().min(1).max(20).allow(null).optional(),
    homephone: joi.string().min(1).max(20).allow(null).optional(),
    address: joi.string().min(1).max(200).allow(null).optional(),
    addressLat: joi.number().default(0).allow(null).optional(),
    addressLong: joi.number().default(0).allow(null).optional(),
    maritalStatus: joi.string()
        .only(MaritalStatus.SINGLE, MaritalStatus.DEVORCED, MaritalStatus.MARRIED, MaritalStatus.SEPARATED, MaritalStatus.WIDOWED)
        .allow(null).optional(),
    cityId: joi.string().allow(null).optional(),
}, isSupportTenancy, false);
CivilianDTO.translator = new common_1.ModelAutoMapper(CivilianDTO, CivilianDTO.validator);
//# sourceMappingURL=CivilianDTO.js.map