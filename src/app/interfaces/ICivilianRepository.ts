import { IRepository } from 'back-lib-common-contracts' ;

import { CivilianDTO } from '../dto/CivilianDTO';


/**
 * Provides methods to work with Device Group.
 */
export interface ICivilianRepository 
	extends IRepository<CivilianDTO> {
}