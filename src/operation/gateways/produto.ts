import { CustomError } from '../../common/dtos/custom-error'
import { type Categoria } from '../../core/entities/categoria'
import { type Produto } from '../../core/entities/produto'

export class ProdutoRepository {
  constructor (private readonly queryBuilder: any) {}

  async getProdutoById (id: string, categoria: Categoria | undefined): Promise<Produto> {
    if (categoria) {
      return this.queryBuilder.select('*').from('produtos').where('id', id).andWhere('categoria', categoria)
    }
    return this.queryBuilder.select('*').from('produtos').where('id', id)
  }

  async getProdutos (categoria: Categoria | undefined): Promise<Produto[]> {
    if (categoria) {
      return this.queryBuilder.select('*').from('produtos').where('categoria', categoria)
    }
    return this.queryBuilder.select('*').from('produtos')
  }

  async createProduto (produto: Produto): Promise<number> {
    try {
      const response = await this.queryBuilder.insert(produto).into('produtos')
      return response[0]
    } catch (error: any) {
      if (error?.code === 'ER_DUP_ENTRY') {
        throw new CustomError(400, 'Produto já cadastrado.')
      }
      throw error
    }
  }

  async deleteProduto (id: string): Promise<void> {
    this.queryBuilder.delete().from('produtos').where('id', id)
  }
}
