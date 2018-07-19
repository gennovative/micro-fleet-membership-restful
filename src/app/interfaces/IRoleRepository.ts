import { PagedArray } from '@micro-fleet/common';
import { IRepository, RepositoryPageOptions } from '@micro-fleet/persistence' ;

import { RoleDTO } from '../dto/RoleDTO';

/**
 * Provides methods to work with Device Group.
 */
export interface IRoleRepository 
	extends IRepository<RoleDTO> {
	
	/**
	 * Selects `pageSize` number of records at page `pageIndex`.
	 * INCLUDING soft-deleted records.
	 * @param {number} pageIndex Index of the page.
	 * @param {number} pageSize Number of records in a page.
	 */
	pageAll(pageIndex: number, pageSize: number, opts?: RepositoryPageOptions): Promise<PagedArray<RoleDTO>>;
}