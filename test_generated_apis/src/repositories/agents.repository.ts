import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MariadbDataSource} from '../datasources';
import {Agents, AgentsRelations} from '../models';

export class AgentsRepository extends DefaultCrudRepository<
  Agents,
  typeof Agents.prototype.AGENT_CODE,
  AgentsRelations
> {
  constructor(
    @inject('datasources.mariadb') dataSource: MariadbDataSource,
  ) {
    super(Agents, dataSource);
  }
}
