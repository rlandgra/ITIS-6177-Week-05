import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Agents} from '../models';
import {AgentsRepository} from '../repositories';

export class AgentController {
  constructor(
    @repository(AgentsRepository)
    public agentsRepository : AgentsRepository,
  ) {}

  @post('/agentsauto')
  @response(200, {
    description: 'Agents model instance',
    content: {'application/json': {schema: getModelSchemaRef(Agents)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agents, {
            title: 'NewAgents',
            
          }),
        },
      },
    })
    agents: Agents,
  ): Promise<Agents> {
    return this.agentsRepository.create(agents);
  }

  @get('/agentsauto/count')
  @response(200, {
    description: 'Agents model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Agents) where?: Where<Agents>,
  ): Promise<Count> {
    return this.agentsRepository.count(where);
  }

  @get('/agentsauto')
  @response(200, {
    description: 'Array of Agents model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Agents, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Agents) filter?: Filter<Agents>,
  ): Promise<Agents[]> {
    return this.agentsRepository.find(filter);
  }

  @patch('/agentsauto')
  @response(200, {
    description: 'Agents PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agents, {partial: true}),
        },
      },
    })
    agents: Agents,
    @param.where(Agents) where?: Where<Agents>,
  ): Promise<Count> {
    return this.agentsRepository.updateAll(agents, where);
  }

  @get('/agentsauto/{id}')
  @response(200, {
    description: 'Agents model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Agents, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Agents, {exclude: 'where'}) filter?: FilterExcludingWhere<Agents>
  ): Promise<Agents> {
    return this.agentsRepository.findById(id, filter);
  }

  @patch('/agentsauto/{id}')
  @response(204, {
    description: 'Agents PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agents, {partial: true}),
        },
      },
    })
    agents: Agents,
  ): Promise<void> {
    await this.agentsRepository.updateById(id, agents);
  }

  @put('/agentsauto/{id}')
  @response(204, {
    description: 'Agents PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() agents: Agents,
  ): Promise<void> {
    await this.agentsRepository.replaceById(id, agents);
  }

  @del('/agentsauto/{id}')
  @response(204, {
    description: 'Agents DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.agentsRepository.deleteById(id);
  }
}
