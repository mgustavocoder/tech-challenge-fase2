import { type GatewayPagamento } from '../../operation/gateways/gateway'
import { type PagamentoRepository } from '../../operation/gateways/pagamento'
import { Pagamento } from '../entities/pagamento'
import { StatusPagamento } from '../entities/status-pagamento'

export class PagamentoUsecase {
  constructor (
    private readonly pagamentoRepository: PagamentoRepository,
    private readonly pagamentoGateway: GatewayPagamento
  ) { }

  async createPagamento (valor: number): Promise<Pagamento> {
    const pagamento = new Pagamento(undefined, valor, StatusPagamento.AGUARDANDO_PAGAMENTO)
    const idPagamento = await this.pagamentoRepository.createPagamento(pagamento)
    pagamento.id = idPagamento
    pagamento.codigoCopiaCola = this.pagamentoGateway.getCodigoCopiaCola(idPagamento)
    return pagamento
  }

  async aprovarPagamento (id: number): Promise<void> {
    await this.pagamentoRepository.updatePagamento(id, StatusPagamento.PAGO)
  }
}
