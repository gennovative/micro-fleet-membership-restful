import { QueryBuilder } from 'objection';
import * as scrypt from 'scrypt';
const moment = require('moment');
import { inject, injectable, Guard } from 'back-lib-common-util';
import { RepositoryBase, IDatabaseConnector, Types as PerTypes } from 'back-lib-persistence';
import { AccountDTO, IAccountRepository } from 'back-lib-membership-contracts';

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
		let queryProm: Promise<AccountEntity> = this._processor.executeQuery((builder: QueryBuilder<any>) => {
			let query = builder
				.select('accounts.*', 'account_roles.name as role')
				.leftOuterJoin('account_roles', 'accounts.role_id', 'account_roles.id')
				.where('username', model.username)
				.limit(1);
			// console.log(query.toSQL());
			return query;
		});
		let account = await queryProm;
		if (!account[0]) {
			const passBuffer = await this.hash(model.password);
			const password = passBuffer.toString('base64');
			model = AccountDTO.translator.merge(model, {
				password
			}) as AccountDTO;
			return await super.create(model, opts);
		}
		return null;
	}

	public async findByCredentials(username: string, password: string): Promise<AccountDTO> {
		let queryProm: Promise<AccountEntity> = this._processor.executeQuery((builder: QueryBuilder<any>) => {
			let query = builder
				.select('accounts.*', 'account_roles.name as role')
				.leftOuterJoin('account_roles', 'accounts.role_id', 'account_roles.id')
				.where('username', username)
				.limit(1);
			// console.log(query.toSQL());
			return query;
		});
		const account = await queryProm;
		if (account[0]) {
			const passBuffer = Buffer.from(account[0].password, 'base64');
			const isMatched = await this.verify(passBuffer, password);
			let accoutnDto = this._processor.toDTO(account[0], false);
			accoutnDto.role = account[0]['role'];
			return (isMatched ? accoutnDto : null);
		}
		return null;
	}

	public async checkRefresh(id, refreshToken): Promise<Boolean> {
		let queryProm: Promise<AccountEntity> = this._processor.executeQuery((builder: QueryBuilder<any>) => {
			let query = builder.where({
				refresh_token: refreshToken,
				id: id
			}).limit(1);
			return query;
		});
		const account = await queryProm;
		let now = moment().format();
		let isValidDate = true;
		return (account && account[0] ? true : false);
	}

	private async hash(password: string): Promise<Buffer> {
		let params = await scrypt.params(0.1);
		return await scrypt.kdf(password, params);
	}

	private verify(kdf: Buffer, key: string): Promise<boolean> {
		return scrypt.verifyKdf(kdf, key);
	}

	public async changePassword(model, opts?): Promise<Partial<AccountDTO> & Partial<AccountDTO>[]> {
		const passBuffer = await this.hash(model.password);
		const password = passBuffer.toString('base64');
		let id = model.id,
			username = model.username,
			status = model.status,
			roleId = model.roleId;
		return this.patch({ id, username, password, status, roleId });
	}
}