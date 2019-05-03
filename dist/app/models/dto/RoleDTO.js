"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const common_1 = require("@micro-fleet/common");
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
RoleDTO.validator = common_1.JoiModelValidator.create({
    name: joi.string().min(1).max(255).required(),
}, isSupportTenancy, false);
RoleDTO.translator = new common_1.ModelAutoMapper(RoleDTO, RoleDTO.validator);
//# sourceMappingURL=RoleDTO.js.map