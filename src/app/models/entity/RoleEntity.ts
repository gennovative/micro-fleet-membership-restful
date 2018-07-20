import { ModelAutoMapper } from '@micro-fleet/common';
import { EntityBase } from '@micro-fleet/persistence';

export class RoleEntity
	extends EntityBase
	implements ISoftDeletable {

	public static translator: ModelAutoMapper<RoleEntity>;


	/**
	 * @override
	 */
	public static get tableName(): string {
		return 'public.account_roles';
	}

	public id: BigInt = undefined;
	public name: string = undefined;
	public deletedAt: Date = undefined;
}

RoleEntity.translator = new ModelAutoMapper(RoleEntity);