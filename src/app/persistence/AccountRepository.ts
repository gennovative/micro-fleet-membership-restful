import { QueryBuilder } from 'objection';
import * as scrypt from 'scrypt';
import { inject, injectable, Guard } from 'back-lib-common-util';
import { RepositoryBase, IDatabaseConnector, Types as PerTypes } from 'back-lib-persistence';

import { AccountDTO } from '../dto/AccountDTO';
import { IAccountRepository } from '../interfaces/IAccountRepository';
import { AccountEntity } from '../entity/AccountEntity';



@injectable()
export class AccountRepository
	extends RepositoryBase<AccountEntity, AccountDTO>
	implements IAccountRepository {
	
	constructor(
		@inject(PerTypes.DB_CONNECTOR) dbConnector: IDatabaseConnector,
		) {
		super(AccountEntity, dbConnector);
	}

	public async findByCredentials(username: string, password: string): Promise<AccountDTO> {
		let queryProm: Promise<AccountDTO> = this._processor.executeQuery((builder: QueryBuilder<AccountDTO>) => {
			return builder
				.where('username', username)
				.limit(1);
		});
		let hashProm = this.hash(password);
		let [account, targetHash] = await Promise.all([queryProm, hashProm]);
		let isMatched = await this.verify(targetHash, account.password);
		return (isMatched ? account : null);
	}


	private async hash(password: string): Promise<string> {
		let params = await scrypt.params(0.1);
		return await scrypt.kdf(password, params);
	}

	private verify(hash: string, password: string): Promise<string> {
		return scrypt.verifyKdf(hash, password);
	}
}