"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const back_lib_common_contracts_1 = require("back-lib-common-contracts");
const isSupportTenancy = false;
/**
 * Represents a group of setting items, can be assigned to programs or program groups.
 */
class RoleDTO {
    constructor() {
        /**
         * Gets role id.
         */
        this.id = undefined;
        /**
         * Gets role name.
         */
        this.name = undefined;
    }
}
exports.RoleDTO = RoleDTO;
RoleDTO.validator = back_lib_common_contracts_1.JoiModelValidator.create({
    name: joi.string().min(1).max(255).required()
}, isSupportTenancy, false);
RoleDTO.translator = new back_lib_common_contracts_1.ModelAutoMapper(RoleDTO, RoleDTO.validator);
