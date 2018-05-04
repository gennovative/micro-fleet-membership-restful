import { QueryBuilder } from 'objection';
import * as scrypt from 'scrypt';
import { inject, injectable, Guard } from 'back-lib-common-util';
import * as cc from 'back-lib-common-contracts';
import { RepositoryBase, IDatabaseConnector, Types as PerTypes } from 'back-lib-persistence';

// import { CivilianDTO, IRoleRepository } from 'back-lib-membership-contracts';
// import { CivilianEntity } from '../entity/CivilianEntity';
import { isMaster } from 'cluster';
import { RoleEntity } from '../entity/RoleEntity';
import { RoleDTO } from '../dto/RoleDTO';
import { IRoleRepository } from '../interfaces/IRoleRepository';



@injectable()
export class RoleRepository
	extends RepositoryBase<RoleEntity, RoleDTO>
	implements IRoleRepository {

	constructor(
		@inject(PerTypes.DB_CONNECTOR) dbConnector: IDatabaseConnector,
	) {
		super(RoleEntity, dbConnector);
	}

	/**
	 * @override
	 */
	public async page(pageIndex: number, pageSize: number, opts: cc.RepositoryPageOptions = {}): Promise<cc.PagedArray<RoleDTO>> {
		opts.includeDeleted = true;
		return super.page(pageIndex, pageSize, opts);
	}
}