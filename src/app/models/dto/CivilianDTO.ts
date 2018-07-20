import * as joi from 'joi';
import { JoiModelValidator, ModelAutoMapper } from '@micro-fleet/common';

const isSupportTenancy = false;

/**
 * Defined available states on a account.
 * 
 * @export
 * @enum {number}
 */
export enum MaritalStatus {

	/**
	 * Account can login.
	 */
	SINGLE = 'single',

	/**
	 * Account cannot login and will not available to any operation.
	 */
	MARRIED = 'married',

	/**
	 * Account cannot login until "unlocked_at", but is still available for
	 * some operations.
	 */
	SEPARATED = 'separated',

	/**
	 * Account cannot login until manually unbanned, but is still available for
	 * some operations.
	 */
	DEVORCED = 'devorced',

	WIDOWED = 'widowed'
}

/**
 * Represents a group of setting items, can be assigned to programs or program groups.
 */
export class CivilianDTO 
	implements IModelDTO, ISoftDeletable {

	public static validator: JoiModelValidator<CivilianDTO>;
	public static translator: ModelAutoMapper<CivilianDTO>;

	/**
	 * Gets account id.
	 */
	public readonly id: BigInt = undefined;

	/**
	 * Gets account username.
	 */
	public readonly fullname: string = undefined;

	/**
	 * Gets the birthday.
	 */
	public readonly birthday: Date = undefined;

	/**
	 * Gets the gender.
	 */
	public readonly gender: string = undefined;

	/**
	 * Gets the cellphone.
	 */
	public readonly cellphone: string = undefined;

	/**
	 * Gets the homephone.
	 */
	public readonly homephone: string = undefined;

	/**
	 * Gets the address.
	 */
	public readonly address: string = undefined;

	/**
	 * Gets the address latitude.
	 */
	public readonly addressLat: number = undefined;

	/**
	 * Gets the address longtitude.
	 */
	public readonly addressLong: number = undefined;

	/**
	 * Gets the material status.
	 */
	public readonly maritalStatus: Date = undefined;

	/**
	 * Gets the city Id.
	 */
	public readonly cityId: string = undefined;

}

CivilianDTO.validator = JoiModelValidator.create({
	fullname: joi.string().min(1).max(255).required(),
	birthday: joi.object().type(Date, 'Date').allow(null).optional(),
	gender: joi.string().min(1).max(20).optional(),
	cellphone: joi.string().min(1).max(20).allow(null).optional(),
	homephone: joi.string().min(1).max(20).allow(null).optional(),
	address: joi.string().min(1).max(200).allow(null).optional(),
	addressLat: joi.number().default(0).allow(null).optional(),
	addressLong: joi.number().default(0).allow(null).optional(),
	maritalStatus: joi.string().only(MaritalStatus.SINGLE, MaritalStatus.DEVORCED, MaritalStatus.MARRIED, MaritalStatus.SEPARATED, MaritalStatus.WIDOWED).allow(null).optional(),
	cityId: joi.string().allow(null).optional(),
}, isSupportTenancy, false);

CivilianDTO.translator = new ModelAutoMapper(CivilianDTO, CivilianDTO.validator);