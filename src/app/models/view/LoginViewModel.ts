import * as joi from 'joi';
import { JoiModelValidator, ModelAutoMapper } from '@micro-fleet/common';

/**
 * Represents a group of setting items, can be assigned to programs or program groups.
 */
export class LoginViewModel {

	public static validator: JoiModelValidator<LoginViewModel>;
	public static translator: ModelAutoMapper<LoginViewModel>;

	/**
	 * Gets account username.
	 */
	public readonly username: string = undefined;

	/**
	 * Gets the password.
	 */
	public readonly password: string = undefined;
}

LoginViewModel.validator = JoiModelValidator.create({
	username: joi.string().min(1).max(100).required(),
	password: joi.string().min(6).max(255).required(),
});

LoginViewModel.translator = new ModelAutoMapper(LoginViewModel, LoginViewModel.validator);