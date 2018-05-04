import { IRepository } from 'back-lib-common-contracts';

import { RoleDTO } from '../dto/RoleDTO';


/**
 * Provides methods to work with Device Group.
 */
export interface IRoleRepository
	extends IRepository<RoleDTO> {
}