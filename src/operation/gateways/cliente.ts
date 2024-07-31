import { CustomError } from '../../common/dtos/custom-error'
import { type Cliente } from '../../core/entities/cliente'
import { ClienteModel } from './models/cliente-model'

export class ClienteRepository {
  constructor (private readonly queryBuilder: any) {}
  async getClienteByCpf (cpf: string): Promise<Cliente> {
    return this.queryBuilder('cliente').where('cpf', cpf).first()
  }

  async getClienteByEmail (email: string): Promise<Cliente> {
    return this.queryBuilder('cliente').where('email', email).first()
  }

  async getClientes (): Promise<Cliente[]> {
    return this.queryBuilder('cliente').select()
  }

  async createCliente (cliente: Cliente): Promise<void> {
    try {
      const response = await this.queryBuilder.insert(new ClienteModel(
        cliente.cpf,
        cliente.nome,
        cliente.email,
        cliente.senha
      )).into('cliente')
      return response
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new CustomError(400, error.sqlMessage)
      }
      throw error
    }
  }
}
