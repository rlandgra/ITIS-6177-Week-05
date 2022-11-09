import {Entity, model, property} from '@loopback/repository';

@model()
export class Agents extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  AGENT_CODE: string;

  @property({
    type: 'string',
    required: true,
  })
  AGENT_NAME: string;

  @property({
    type: 'string',
    required: true,
  })
  WORKING_AREA: string;

  @property({
    type: 'string',
    required: true,
  })
  COMMISSION: string;

  @property({
    type: 'string',
    required: true,
  })
  PHONE_NO: string;

  @property({
    type: 'string',
    required: true,
  })
  COUNTRY: string;


  constructor(data?: Partial<Agents>) {
    super(data);
  }
}

export interface AgentsRelations {
  // describe navigational properties here
}

export type AgentsWithRelations = Agents & AgentsRelations;
