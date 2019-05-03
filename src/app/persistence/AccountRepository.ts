import { QueryBuilder } from 'objection'
import * as scrypt from 'scrypt'
import { inject, injectable } from '@micro-fleet/common'
import { SoftDelRepositoryBase, IDatabaseConnector, RepositoryCreateOptions,
    Types as PerTypes } from '@micro-fleet/persistence'

import { AccountEntity } from '../models/entity/AccountEntity'
import { AccountDTO } from '../models/dto/AccountDTO'
import { IAccountRepository } from '../interfaces/IAccountRepository'


@injectable()
export class AccountRepository
    extends SoftDelRepositoryBase<AccountEntity, AccountDTO>
    implements IAccountRepository {

    constructor(
        @inject(PerTypes.DB_CONNECTOR) dbConnector: IDatabaseConnector,
    ) {
        super(AccountEntity, AccountDTO, dbConnector)
    }

    /**
     * @override
     */
    public async create(model: AccountDTO, opts?: RepositoryCreateOptions): Promise<AccountDTO | AccountDTO[]> {
        const queryProm: Promise<AccountEntity> = this._processor.executeQuery((builder: QueryBuilder<any>) => {
            const query = builder
                .select('accounts.*', 'account_roles.name as role')
                .leftOuterJoin('account_roles', 'accounts.role_id', 'account_roles.id')
                .where('username', model.username)
                .limit(1)
            // console.log(query.toSQL())
            return query
        })
        const account = await queryProm
        if (!account[0]) {
            const passBuffer = await this._hash(model.password)
            const password = passBuffer.toString('base64')
            model = AccountDTO.translator.merge(model, {
                password,
            }) as AccountDTO
            return await super.create(model, opts)
        }
        return null
    }

    public async findByCredentials(username: string, password: string): Promise<AccountDTO> {
        const queryProm: Promise<AccountEntity> = this._processor.executeQuery((builder: QueryBuilder<any>) => {
            const query = builder
                .select('accounts.*', 'account_roles.name as role')
                .leftOuterJoin('account_roles', 'accounts.role_id', 'account_roles.id')
                .where('username', username)
                .limit(1)
            // console.log(query.toSQL())
            return query
        })
        const account = await queryProm
        if (account[0]) {
            const passBuffer = Buffer.from(account[0].password, 'base64')
            const isMatched = await this._verify(passBuffer, password)
            const accoutnDto = this._processor.toDTO(account[0], false) as AccountDTO
            accoutnDto['role'] = account[0]['role']
            return (isMatched ? accoutnDto : null)
        }
        return null
    }

    public async checkRefresh(id: bigint, refreshToken: string): Promise<boolean> {
        const queryProm: Promise<AccountEntity> = this._processor.executeQuery((builder: QueryBuilder<any>) => {
            const query = builder.where({
                refresh_token: refreshToken,
                id: id,
            }).limit(1)
            return query
        })
        const account = await queryProm
        return (account && account[0])
    }

    private async _hash(password: string): Promise<Buffer> {
        const params = await scrypt.params(0.1)
        return await scrypt.kdf(password, params)
    }

    private _verify(kdf: Buffer, key: string): Promise<boolean> {
        return scrypt.verifyKdf(kdf, key)
    }

    public async changePassword(id: bigint, password: string): Promise<boolean> {
        const passBuffer = await this._hash(password)
        const passStr = passBuffer.toString('base64')
        const props = await this.patch({ id, password: passStr }) as Partial<AccountDTO>
        return !!props
    }
}
