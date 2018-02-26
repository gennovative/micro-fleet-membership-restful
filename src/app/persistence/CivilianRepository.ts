import { QueryBuilder } from 'objection';
import * as scrypt from 'scrypt';
import { inject, injectable, Guard } from 'back-lib-common-util';
import { RepositoryBase, IDatabaseConnector, Types as PerTypes } from 'back-lib-persistence';

import { CivilianDTO } from '../dto/CivilianDTO';
import { ICivilianRepository } from '../interfaces/ICivilianRepository';
import { CivilianEntity } from '../entity/CivilianEntity';
import { isMaster } from 'cluster';



@injectable()
export class CivilianRepository
	extends RepositoryBase<CivilianEntity, CivilianDTO>
	implements ICivilianRepository {
	
	constructor(
		@inject(PerTypes.DB_CONNECTOR) dbConnector: IDatabaseConnector,
		) {
		super(CivilianEntity, dbConnector);
	}

}