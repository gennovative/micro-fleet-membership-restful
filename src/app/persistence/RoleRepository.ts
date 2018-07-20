import { inject, injectable, PagedArray } from '@micro-fleet/common';
import { RepositoryBase, IDatabaseConnector, RepositoryPageOptions,
	Types as PerTypes } from '@micro-fleet/persistence';

import { RoleEntity } from '../models/entity/RoleEntity';
import { RoleDTO } from '../models/dto/RoleDTO';
import { IRoleRepository } from '../interfaces/IRoleRepository';


@injectable()
export class RoleRepository
	extends RepositoryBase<RoleEntity, RoleDTO>
	implements IRoleRepository {

	constructor(
		@inject(PerTypes.DB_CONNECTOR) dbConnector: IDatabaseConnector,
	) {
		super(RoleEntity, RoleDTO, dbConnector);
	}


	public async pageAll(pageIndex: number, pageSize: number, opts: RepositoryPageOptions = {}): Promise<PagedArray<RoleDTO>> {
		opts.excludeDeleted = false;
		return super.page(pageIndex, pageSize, opts);
	}
}