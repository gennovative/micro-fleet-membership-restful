import { Model } from 'objection';
import { ModelAutoMapper } from '@micro-fleet/common';
import { EntityBase } from '@micro-fleet/persistence';


export class AccountEntity
	extends EntityBase
	implements ISoftDeletable {

	public static translator: ModelAutoMapper<AccountEntity>;

	public static get relationMappings(): any {
		// Lazy reference to avoid circular reference.
		// `relationMappings()` is called only once for each connection.
		const { RoleEntity } = require('../entity/RoleEntity');

		return {
			belongtoRoles: {
				relation: Model.HasOneRelation,
				modelClass: RoleEntity,
				join: {
					from: 'public.accounts.role_id',
					to: 'public.account_roles.id'
				}
			}
		};
	}


	/**
	 * @override
	 */
	public static get tableName(): string {
		return 'public.accounts';
	}

	public id: BigInt = undefined;
	public username: string = undefined;
	public password: string = undefined;
	public loginAttempts: number = undefined;
	public lastAttemptAt: Date = undefined;
	public lastLoginAt: Date = undefined;
	public lastLoginFrom: string = undefined;
	public unclockedAt: Date = undefined;
	public status: string = undefined;
	public deletedAt: Date = undefined;
	public createdAt: Date = undefined;
	public updatedAt: Date = undefined;
	public roleId: BigInt = undefined;
	public refreshToken: string = undefined;
	public tokenExp: Date = undefined;
	// public civilianId: BigSInt = undefined;
}

AccountEntity.translator = new ModelAutoMapper(AccountEntity);