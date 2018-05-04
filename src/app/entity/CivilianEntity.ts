import { Model } from 'objection';
import { EntityBase } from 'back-lib-persistence';
import { ModelAutoMapper } from 'back-lib-common-contracts';

export class CivilianEntity
	extends EntityBase
	implements ISoftDeletable {

	public static translator: ModelAutoMapper<CivilianEntity>;

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


	private static readonly TABLE_NAME = 'public.civilians';

	/**
	 * @override
	 */
	public static get tableName(): string {
		return CivilianEntity.TABLE_NAME;
	}

	public fullname: string = undefined;
	public birthday: Date = undefined;
	public gender: string = undefined;
	public cellphone: string = undefined;
	public homephone: string = undefined;
	public address: string = undefined;
	public addressLat: number = undefined;
	public addressLong: number = undefined;
	public maritalStatus: string = undefined;
	public cityId: string = undefined;
}

CivilianEntity.translator = new ModelAutoMapper(CivilianEntity);