import { type Pagamento } from './pagamento'
import { StatusPedido } from '../entities/status-pedido'
import { type Item } from '../entities/item'

export class Pedido {
  constructor (
    public id: number | undefined,
    public pontoVendaId: number,
    public clienteCpf: string | undefined,
    public itens: Item[],
    public pagamento: Pagamento,
    public status: StatusPedido = StatusPedido.AGUARDANDO_PAGAMENTO
  ) {}
}
