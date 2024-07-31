import { type Request, type Response } from 'express'
import { type PedidoUsecase } from '../../core/usecases/pedidos'
import { StatusPedido } from '../../core/entities/status-pedido'
import { CustomError } from '../../common/dtos/custom-error'
import { AcessoController } from './acesso-controller'
import { PedidoResponse } from '../../common/dtos/pedido-response'

export class PedidoController {
  constructor (private readonly pedidoUsecase: PedidoUsecase) {}

  async getPedidos (req: Request, res: Response) {
    try {
      const pedidos = await this.pedidoUsecase.getPedidos()
      res.status(200).json(pedidos)
    } catch (error: any) {
      CustomError.handleControllerError(error, res)
    }
  }

  async getPedidoById (req: Request, res: Response) {
    try {
      const pedido = await this.pedidoUsecase.getPedidoById(req.params.id)
      res.status(200).json(pedido)
    } catch (error: any) {
      CustomError.handleControllerError(error, res)
    }
  }

  async createPedido (req: Request, res: Response) {
    try {
      const cliente = await AcessoController.authenticate(req, { optional: true })
      const { ponto_de_venda_id, itens } = req.body
      const pedido = await this.pedidoUsecase.createPedido(ponto_de_venda_id, cliente?.cpf ?? '', itens)
      res.status(200).json(new PedidoResponse(
        pedido.id,
        pedido.status,
        pedido.pagamento.valor,
        pedido.pagamento.codigoCopiaCola))
    } catch (error: any) {
      CustomError.handleControllerError(error, res)
    }
  }

  async updatePedido (req: Request, res: Response) {
    try {
      const { status } = req.body
      const id = parseInt(req.params.id)
      if (!Object.values(StatusPedido).some((value) => value === status)) {
        throw new CustomError(400, 'Status Inválido.')
      }
      await this.pedidoUsecase.updatePedido(id, status)
      res.status(200).json({ message: 'Pedido atualizado com sucesso.' })
    } catch (error: any) {
      CustomError.handleControllerError(error, res)
    }
  }

  async aprovarPedido (req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      await this.pedidoUsecase.aprovarPedido(id)
      res.status(200).json({ message: 'Pedido aprovado com sucesso.' })
    } catch (error: any) {
      CustomError.handleControllerError(error, res)
    }
  }
}
