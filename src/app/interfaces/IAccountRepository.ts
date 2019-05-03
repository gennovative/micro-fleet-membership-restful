import { ISoftDelRepository } from '@micro-fleet/persistence'

import { AccountDTO } from '../models/dto/AccountDTO'


/**
 * Provides methods to work with Device Group.
 */
export interface IAccountRepository
    extends ISoftDelRepository<AccountDTO> {

    /**
     * Gets an account by username and password.
     * @param username Account username.
     * @param password Raw unhashed password.
     */
    findByCredentials(username: string, password: string): Promise<AccountDTO>

    /**
     * Checks if refresh token exists.
     */
    checkRefresh(id: bigint, refreshToken: string): Promise<boolean>

    /**
     * Changes password for specified account id.
     * @param password The raw unhashed password.
     */
    changePassword(id: bigint, password: string): Promise<boolean>
}
