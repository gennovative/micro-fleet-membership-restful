import { Model } from 'objection';
import { EntityBase } from 'back-lib-persistence';
import { ModelAutoMapper } from 'back-lib-common-contracts';

export class AccountEntity
	extends EntityBase
	implements ISoftDeletable {

	public static translator: ModelAutoMapper<AccountEntity>;

	// public static get relationMappings(): any {
	// 	// Lazy reference to avoid circular reference.
	// 	// `relationMappings()` is called only once for each connection.

	// 	const { DeviceGroupEntity } = require('../entity/DeviceGroupEntity');

	// 	return {
	// 		belongtoDeviceGroups: {
	// 			relation: Model.HasOneRelation,
	// 			modelClass: DeviceGroupEntity,
	// 			join: {
	// 				from: 'public.devices.group_id',
	// 				to: 'public.device_groups.id'
	// 			}
	// 		}
	// 	};
	// }


	private static readonly TABLE_NAME = 'public.accounts';

	/**
	 * @override
	 */
	public static get tableName(): string {
		return AccountEntity.TABLE_NAME;
	}

	public username: string = undefined;
	public password: string = undefined;
	public deviceUid: BigSInt = undefined;
	public loginAttempts: number = undefined;
	public lastAttemptAt: Date = undefined;
	public lastLoginAt: Date = undefined;
	public lastLoginFrom: string = undefined;
	public unclockedAt: Date = undefined;
	public status: string = undefined;
	public deletedAt: Date = undefined;
	public createdAt: Date = undefined;
	public updatedAt: Date = undefined;
}

AccountEntity.translator = new ModelAutoMapper(AccountEntity);