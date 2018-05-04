import { Model } from 'objection';
import { EntityBase } from 'back-lib-persistence';
import { ModelAutoMapper } from 'back-lib-common-contracts';

export class RoleEntity
	extends EntityBase
	implements ISoftDeletable {

	public static translator: ModelAutoMapper<RoleEntity>;

	private static readonly TABLE_NAME = 'public.account_roles';

	/**
	 * @override
	 */
	public static get tableName(): string {
		return RoleEntity.TABLE_NAME;
	}

	public name: string = undefined;
}

RoleEntity.translator = new ModelAutoMapper(RoleEntity);