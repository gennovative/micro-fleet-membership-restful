import * as joi from 'joi';
import { JoiModelValidator, ModelAutoMapper } from 'back-lib-common-contracts';

const isSupportTenancy = false;

/**
 * Defined available states on a account.
 * 
 * @export
 * @enum {number}
 */
export enum AccountStatus {

	/**
	 * Account can login.
	 */
	ACTIVE = 'active',

	/**
	 * Account cannot login and will not available to any operation.
	 */
	DISABLED = 'disabled',

	/**
	 * Account cannot login until "unlocked_at", but is still available for
	 * some operations.
	 */
	LOCKED = 'locked',

	/**
	 * Account cannot login until manually unbanned, but is still available for
	 * some operations.
	 */
	BANNED = 'banned',
}

/**
 * Represents a group of setting items, can be assigned to programs or program groups.
 */
export class AccountDTO 
	implements IModelDTO, ISoftDeletable {

	public static validator: JoiModelValidator<AccountDTO>;
	public static translator: ModelAutoMapper<AccountDTO>;

	/**
	 * Gets account id.
	 */
	public readonly id: BigSInt = undefined;

	/**
	 * Gets account username.
	 */
	public readonly username: string = undefined;

	/**
	 * Gets the password.
	 */
	public readonly password: string = undefined;

	/**
	 * Gets the login attempts.
	 */
	public readonly loginAttempts: number = undefined;

	/**
	 * Gets the last time of failed login attempt.
	 */
	public readonly lastAttemptAt: Date = undefined;

	/**
	 * Gets the last time of successful login attempt.
	 */
	public readonly lastLoginAt: Date = undefined;

	/**
	 * Gets the last IP address of successful login.
	 */
	public readonly lastLoginFrom: string = undefined;

	/**
	 * Gets the time when this account WILL be unlocked.
	 */
	public readonly unclockedAt: Date = undefined;

	/**
	 * Gets the time when this account WILL be unlocked.
	 */
	public readonly status: string = undefined;

	/**
	 * Gets the UTC time when this model is marked as deleted.
	 */
	public readonly deletedAt: Date = undefined;

	/**
	 * Gets the UTC time when this model is created.
	 */
	public readonly createdAt: Date = undefined;

	/**
	 * Gets the UTC time when this model is last updated.
	 */
	public readonly updatedAt: Date = undefined;

	/**
	 * Gets the FK of Civilian Id.
	 */
	// public readonly civilianId: BigSInt = undefined;
}

AccountDTO.validator = JoiModelValidator.create({
	username: joi.string().min(1).max(100).required(),
	password: joi.string().min(6).max(255).required(),
	loginAttempts: joi.number().allow(null).optional(),
	lastAttemptAt: joi.object().type(Date, 'Date').allow(null).optional(),
	lastLoginAt: joi.object().type(Date, 'Date').allow(null).optional(),
	lastLoginFrom: joi.string().min(7).max(45).allow(null).optional(),
	unclockedAt: joi.object().type(Date, 'Date').allow(null).optional(),
	status: joi.string().only(AccountStatus.ACTIVE, AccountStatus.BANNED, AccountStatus.DISABLED, AccountStatus.LOCKED).default(AccountStatus.ACTIVE).optional(),
	deletedAt: joi.object().type(Date, 'Date').allow(null).optional(),
	createdAt: joi.object().type(Date, 'Date').optional(),
	updatedAt: joi.object().type(Date, 'Date').optional(),
	// civilianId: joi.number().required(),
}, isSupportTenancy, false);

AccountDTO.translator = new ModelAutoMapper(AccountDTO, AccountDTO.validator);