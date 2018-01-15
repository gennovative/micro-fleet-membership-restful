import { QueryBuilder } from 'objection';
import * as scrypt from 'scrypt';
import { inject, injectable, Guard } from 'back-lib-common-util';
import { RepositoryBase, IDatabaseConnector, Types as PerTypes } from 'back-lib-persistence';

import { AccountDTO } from '../dto/AccountDTO';
import { IAccountRepository } from '../interfaces/IAccountRepository';
import { AccountEntity } from '../entity/AccountEntity';
import { isMaster } from 'cluster';



@injectable()
export class AccountRepository
	extends RepositoryBase<AccountEntity, AccountDTO>
	implements IAccountRepository {
	
	constructor(
		@inject(PerTypes.DB_CONNECTOR) dbConnector: IDatabaseConnector,
		) {
		super(AccountEntity, dbConnector);
	}

	/**
	 * @override
	 */
	public async create(model: AccountDTO, opts?): Promise<AccountDTO & AccountDTO[]> {
		let passBuffer = await this.hash(model.password);
		let password = passBuffer.toString('base64');
		console.log(password);
		model = AccountDTO.translator.merge(model, {
			password
		}) as AccountDTO;
		return await super.create(model, opts);
	}

	public async findByCredentials(username: string, password: string): Promise<AccountDTO> {
		let queryProm: Promise<AccountDTO> = this._processor.executeQuery((builder: QueryBuilder<AccountDTO>) => {
			return builder
				.where('username', username)
				.limit(1);
		});
		let [account] = await Promise.all([queryProm]);
		let isMatched = await this.verify(account.password, password);
		console.log('isMatched: ', isMatched);
		return (isMatched ? account : null);
	}


	private async hash(password: string): Promise<Buffer> {
		let params = await scrypt.params(0.1);
		return await scrypt.kdf(password, params);
	}

	private verify(hash: string, password: string): Promise<boolean> {
		return scrypt.verifyKdf(hash, password);
	}
}