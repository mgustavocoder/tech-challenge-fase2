import { type ClienteRepository } from '../../operation/gateways/cliente'
import { type Cliente } from '../entities/cliente'

export class ClienteUsecase {
  constructor (private readonly clienteRepository: ClienteRepository) { }

  async getClienteByCpf (cpf: string): Promise<Cliente> {
    return await this.clienteRepository.getClienteByCpf(cpf)
  }

  async getClientes (): Promise<Cliente[]> {
    return await this.clienteRepository.getClientes()
  }
}
