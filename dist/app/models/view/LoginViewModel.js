"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const common_1 = require("@micro-fleet/common");
/**
 * Represents a group of setting items, can be assigned to programs or program groups.
 */
class LoginViewModel {
    constructor() {
        /**
         * Gets account username.
         */
        this.username = undefined;
        /**
         * Gets the password.
         */
        this.password = undefined;
    }
}
exports.LoginViewModel = LoginViewModel;
LoginViewModel.validator = common_1.JoiModelValidator.create({
    username: joi.string().min(1).max(100).required(),
    password: joi.string().min(6).max(255).required(),
});
LoginViewModel.translator = new common_1.ModelAutoMapper(LoginViewModel, LoginViewModel.validator);
//# sourceMappingURL=LoginViewModel.js.map