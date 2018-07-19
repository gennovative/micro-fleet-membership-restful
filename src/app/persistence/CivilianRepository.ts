import { inject, injectable } from '@micro-fleet/common';
import { RepositoryBase, IDatabaseConnector, Types as PerTypes } from '@micro-fleet/persistence';

import { CivilianEntity } from '../entity/CivilianEntity';
import { CivilianDTO } from '../dto/CivilianDTO';
import { ICivilianRepository } from '../interfaces/ICivilianRepository';


@injectable()
export class CivilianRepository
	extends RepositoryBase<CivilianEntity, CivilianDTO>
	implements ICivilianRepository {

	constructor(
		@inject(PerTypes.DB_CONNECTOR) dbConnector: IDatabaseConnector,
	) {
		super(CivilianEntity, CivilianDTO, dbConnector);
	}

}