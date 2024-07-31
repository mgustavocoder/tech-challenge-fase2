import { type Produto } from '../entities/produto'
import { type Categoria } from '../entities/categoria'
import { type ProdutoRepository } from '../../operation/gateways/produto'

export class ProdutoUsecase {
  constructor (private readonly produtoRepository: ProdutoRepository) { }

  async getProdutoById (id: string, categoria: Categoria | undefined): Promise<Produto> {
    return await this.produtoRepository.getProdutoById(id, categoria)
  }

  async getProdutos (categoria: Categoria | undefined): Promise<Produto[]> {
    return await this.produtoRepository.getProdutos(categoria)
  }

  async createProduto (produto: Produto): Promise<number> {
    return await this.produtoRepository.createProduto(produto)
  }

  async deleteProduto (id: string): Promise<void> {
    await this.produtoRepository.deleteProduto(id)
  }
}
