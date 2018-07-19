import { ModelAutoMapper } from '@micro-fleet/common';
import { EntityBase } from '@micro-fleet/persistence';

export class CivilianEntity
	extends EntityBase
	implements ISoftDeletable {

	public static translator: ModelAutoMapper<CivilianEntity>;


	/**
	 * @override
	 */
	public static get tableName(): string {
		return 'public.civilians';
	}

	public id: BigInt = undefined;
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
	public deletedAt: Date = undefined;
}

CivilianEntity.translator = new ModelAutoMapper(CivilianEntity);