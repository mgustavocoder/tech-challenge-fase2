import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { type Cliente } from '../entities/cliente'
import { CustomError } from '../../common/dtos/custom-error'
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from '../../common/config/constants'
import { type ClienteRepository } from '../../operation/gateways/cliente'

export class AcessoUsecase {
  constructor (private readonly clienteRepository: ClienteRepository) { }

  async signIn (email: string, senha: string): Promise<string> {
    const cliente = await this.clienteRepository.getClienteByEmail(email)
    if (cliente == null) {
      throw new CustomError(401, 'Acesso negado')
    }
    const match = await bcrypt.compare(senha, cliente.senha)
    if (!match) {
      throw new CustomError(401, 'Acesso negado')
    }
    return jwt.sign({
      nome: cliente.nome,
      email: cliente.email,
      cpf: cliente.cpf
    }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN })
  }

  async signUp (cliente: Cliente): Promise<string> {
    try {
      const saltRounds = 10
      const salt = await bcrypt.genSalt(saltRounds)
      const hashSenha = await bcrypt.hash(cliente.senha, salt)
      cliente.senha = hashSenha
      await this.clienteRepository.createCliente(cliente)
      const token = jwt.sign({
        nome: cliente.nome,
        email: cliente.email,
        cpf: cliente.cpf
      }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN })
      return token
    } catch (error) {
      throw new CustomError(400, 'Erro ao cadastrar cliente')
    }
  }
}
