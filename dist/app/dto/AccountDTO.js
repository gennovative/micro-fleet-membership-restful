"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
const back_lib_common_contracts_1 = require("back-lib-common-contracts");
const isSupportTenancy = false;
/**
 * Defined available states on a account.
 *
 * @export
 * @enum {number}
 */
var AccountStatus;
(function (AccountStatus) {
    /**
     * Account can login.
     */
    AccountStatus["ACTIVE"] = "active";
    /**
     * Account cannot login and will not available to any operation.
     */
    AccountStatus["DISABLED"] = "disabled";
    /**
     * Account cannot login until "unlocked_at", but is still available for
     * some operations.
     */
    AccountStatus["LOCKED"] = "locked";
    /**
     * Account cannot login until manually unbanned, but is still available for
     * some operations.
     */
    AccountStatus["BANNED"] = "banned";
})(AccountStatus = exports.AccountStatus || (exports.AccountStatus = {}));
/**
 * Represents a group of setting items, can be assigned to programs or program groups.
 */
class AccountDTO {
    constructor() {
        /**
         * Gets account id.
         */
        this.id = undefined;
        /**
         * Gets account username.
         */
        this.username = undefined;
        /**
         * Gets the password.
         */
        this.password = undefined;
        /**
         * Gets the login attempts.
         */
        this.loginAttempts = undefined;
        /**
         * Gets the last time of failed login attempt.
         */
        this.lastAttemptAt = undefined;
        /**
         * Gets the last time of successful login attempt.
         */
        this.lastLoginAt = undefined;
        /**
         * Gets the last IP address of successful login.
         */
        this.lastLoginFrom = undefined;
        /**
         * Gets the time when this account WILL be unlocked.
         */
        this.unclockedAt = undefined;
        /**
         * Gets the time when this account WILL be unlocked.
         */
        this.status = undefined;
        /**
         * Gets the UTC time when this model is marked as deleted.
         */
        this.deletedAt = undefined;
        /**
         * Gets the UTC time when this model is created.
         */
        this.createdAt = undefined;
        /**
         * Gets the UTC time when this model is last updated.
         */
        this.updatedAt = undefined;
        /**
         * Gets the FK of Civilian Id.
         */
        this.civilianId = undefined;
    }
}
exports.AccountDTO = AccountDTO;
AccountDTO.validator = back_lib_common_contracts_1.JoiModelValidator.create({
    username: joi.string().min(1).max(100).required(),
    password: joi.string().min(6).max(255).required(),
    loginAttempts: joi.number().optional(),
    lastAttemptAt: joi.object().type(Date, 'Date').allow(null).optional(),
    lastLoginAt: joi.object().type(Date, 'Date').allow(null).optional(),
    lastLoginFrom: joi.string().min(7).max(45).allow(null).optional(),
    unclockedAt: joi.object().type(Date, 'Date').allow(null).optional(),
    status: joi.string().only(AccountStatus.ACTIVE, AccountStatus.BANNED, AccountStatus.DISABLED, AccountStatus.LOCKED).default(AccountStatus.ACTIVE).optional(),
    deletedAt: joi.object().type(Date, 'Date').allow(null).optional(),
    createdAt: joi.object().type(Date, 'Date').optional(),
    updatedAt: joi.object().type(Date, 'Date').optional(),
    civilianId: joi.number().required(),
}, isSupportTenancy, false);
AccountDTO.translator = new back_lib_common_contracts_1.ModelAutoMapper(AccountDTO, AccountDTO.validator);
