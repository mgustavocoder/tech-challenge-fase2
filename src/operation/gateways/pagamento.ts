import { CustomError } from '../../common/dtos/custom-error'
import { type Pagamento } from '../../core/entities/pagamento'
import { type StatusPagamento } from '../../core/entities/status-pagamento'
import { PagamentoModel } from './models/pagamento-model'

export class PagamentoRepository {
  constructor (private readonly queryBuilder: any) {}
  async createPagamento (pagamento: Pagamento): Promise<any> {
    try {
      const response = await this.queryBuilder.insert(new PagamentoModel(
        pagamento.valor,
        pagamento.statusPagamento
      )).into('pagamento')
      return response[0]
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new CustomError(400, error.sqlMessage)
      }
      throw error
    }
  }

  async updatePagamento (id: number, status: StatusPagamento): Promise<void> {
    await this.queryBuilder('pagamento')
      .where('id', id)
      .update({ status })
  }
}
