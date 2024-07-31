import { Logger } from '../../external/logger'
import { ProdutoController } from '../../operation/controllers/produto-controller'
import { ProdutoUsecase } from '../../core/usecases/produtos'
import { PedidoController } from '../../operation/controllers/pedido-controller'
import { PedidoUsecase } from '../../core/usecases/pedidos'
import { ClienteUsecase } from '../../core/usecases/clientes'
import { ClienteController } from '../../operation/controllers/cliente-controller'
import { AcessoController } from '../../operation/controllers/acesso-controller'
import { AcessoUsecase } from '../../core/usecases/acessos'
import { PagamentoUsecase } from '../../core/usecases/pagamentos'
import { GatewayPagamento } from '../../operation/gateways/gateway'
import { ProdutoRepository } from '../../operation/gateways/produto'
import { PedidoRepository } from '../../operation/gateways/pedido'
import { PagamentoRepository } from '../../operation/gateways/pagamento'
import { ClienteRepository } from '../../operation/gateways/cliente'
import { queryBuilderFactory } from '../../external/datasource/query-builder-factory'

function controllersFactory () {
  const logger = new Logger()
  const queryBuilder = queryBuilderFactory()
  const produtoRepository = new ProdutoRepository(queryBuilder)
  const produtoService = new ProdutoUsecase(produtoRepository)
  const produtoController = new ProdutoController(produtoService)
  const pedidoRepository = new PedidoRepository(queryBuilder)
  const pagamentoRepository = new PagamentoRepository(queryBuilder)
  const pagamentoGateway = new GatewayPagamento(logger)
  const pagamentoService = new PagamentoUsecase(pagamentoRepository, pagamentoGateway)
  const pedidoService = new PedidoUsecase(pagamentoService, pedidoRepository)
  const pedidoController = new PedidoController(pedidoService)
  const clienteRepository = new ClienteRepository(queryBuilder)
  const clienteService = new ClienteUsecase(clienteRepository)
  const clienteController = new ClienteController(clienteService)
  const acessoService = new AcessoUsecase(clienteRepository)
  const acessoController = new AcessoController(acessoService)
  return { produtoController, pedidoController, clienteController, acessoController }
}

export { controllersFactory }
