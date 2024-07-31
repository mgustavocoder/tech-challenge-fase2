import { Pagamento } from '../entities/pagamento'
import { Pedido } from '../entities/pedido'
import { type Item } from '../entities/item'
import { StatusPedido } from '../entities/status-pedido'
import { type PagamentoUsecase } from './pagamentos'
import { type PedidoRepository } from '../../operation/gateways/pedido'

export class PedidoUsecase {
  constructor (
    private readonly pagamentoUsecase: PagamentoUsecase,
    private readonly pedidosRepository: PedidoRepository
  ) { }

  async getPedidos (): Promise<Pedido[]> {
    return await this.pedidosRepository.getPedidos()
  }

  async getPedidoById (id: string): Promise<Pedido> {
    return await this.pedidosRepository.getPedidoById(id)
  }

  async createPedido (pontoVendaId: number, cpf: string | undefined, itens: Item[]): Promise<Pedido> {
    const valor = Pagamento.calcularValor(itens)
    const pagamento = await this.pagamentoUsecase.createPagamento(valor)
    const pedido = new Pedido(undefined, pontoVendaId, cpf, itens, pagamento)
    const pedidoId = await this.pedidosRepository.createPedido(pedido)
    pedido.id = pedidoId
    return pedido
  }

  async updatePedido (id: number, status: string): Promise<void> {
    await this.pedidosRepository.updatePedido(id, status)
  }

  async aprovarPedido (pagamentoId: number): Promise<void> {
    await this.pedidosRepository.updatePedidoWherePagamentoId(pagamentoId, StatusPedido.PAGAMENTO_APROVADO)
    await this.pagamentoUsecase.aprovarPagamento(pagamentoId)
  }
}
