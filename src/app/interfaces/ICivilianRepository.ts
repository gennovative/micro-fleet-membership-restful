import { ISoftDelRepository } from '@micro-fleet/persistence'

import { CivilianDTO } from '../models/dto/CivilianDTO'


/**
 * Provides methods to work with Device Group.
 */
export interface ICivilianRepository
    extends ISoftDelRepository<CivilianDTO> {
}
