import { inject, injectable } from '@micro-fleet/common';
import { SoftDelRepositoryBase, IDatabaseConnector, Types as PerTypes } from '@micro-fleet/persistence';

import { CivilianEntity } from '../models/entity/CivilianEntity';
import { CivilianDTO } from '../models/dto/CivilianDTO';
import { ICivilianRepository } from '../interfaces/ICivilianRepository';


@injectable()
export class CivilianRepository
	extends SoftDelRepositoryBase<CivilianEntity, CivilianDTO>
	implements ICivilianRepository {

	constructor(
		@inject(PerTypes.DB_CONNECTOR) dbConnector: IDatabaseConnector,
	) {
		super(CivilianEntity, CivilianDTO, dbConnector);
	}

}