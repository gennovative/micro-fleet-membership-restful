import { IRepository } from 'back-lib-common-contracts' ;

import { AccountDTO } from 'back-lib-membership-contracts';


/**
 * Provides methods to work with Device Group.
 */
export interface IAccountRepository 
	extends IRepository<AccountDTO> {

	/**
	 * Gets an account by username and password.
	 * @param username Account username.
	 * @param password Raw unhashed password.
	 */
	findByCredentials(username: string, password: string): Promise<AccountDTO>;
}