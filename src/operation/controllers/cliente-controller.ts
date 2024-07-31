import { type Request, type Response } from 'express'
import { type ClienteUsecase } from '../../core/usecases/clientes'
import { ClienteResponse } from '../../common/dtos/cliente-response'
import { CustomError } from '../../common/dtos/custom-error'

export class ClienteController {
  constructor (private readonly clienteUsecase: ClienteUsecase) { }

  async getClientes (req: Request, res: Response) {
    try {
      const clientes = await this.clienteUsecase.getClientes()
      res.status(200).json(clientes.map(cliente => new ClienteResponse(
        cliente.nome,
        cliente.cpf,
        cliente.email
      )))
    } catch (error: any) {
      CustomError.handleControllerError(error, res)
    }
  }

  async getClienteByCpf (req: Request, res: Response) {
    try {
      const cliente = await this.clienteUsecase.getClienteByCpf(req.params.cpf)
      res.status(200).json(new ClienteResponse(
        cliente.nome,
        cliente.cpf,
        cliente.email
      ))
    } catch (error: any) {
      CustomError.handleControllerError(error, res)
    }
  }
}
