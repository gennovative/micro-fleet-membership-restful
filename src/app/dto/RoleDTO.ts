import * as joi from 'joi';
import { JoiModelValidator, ModelAutoMapper } from '@micro-fleet/common';

const isSupportTenancy = false;

/**
 * Represents a group of setting items, can be assigned to programs or program groups.
 */
export class RoleDTO 
	implements IModelDTO, ISoftDeletable {

	public static validator: JoiModelValidator<RoleDTO>;
	public static translator: ModelAutoMapper<RoleDTO>;

	/**
	 * Gets role id.
	 */
	public readonly id: BigInt = undefined;

	/**
	 * Gets role name.
	 */
	public readonly name: string = undefined;

}

RoleDTO.validator = JoiModelValidator.create({
	name: joi.string().min(1).max(255).required()
}, isSupportTenancy, false);

RoleDTO.translator = new ModelAutoMapper(RoleDTO, RoleDTO.validator);