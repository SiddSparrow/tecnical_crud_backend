import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';
import { Produto } from '../produtos/entities/produto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(PedidoItem)
    private readonly pedidoItemRepository: Repository<PedidoItem>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido | null> {
    return await this.dataSource.transaction(async (manager) => {
      // Validate client exists
      const cliente = await manager.findOne(Cliente, {
        where: { id: createPedidoDto.clienteId },
      });

      if (!cliente) {
        throw new NotFoundException(
          `Cliente com ID ${createPedidoDto.clienteId} não encontrado`,
        );
      }

      let total = 0;
      const itens: PedidoItem[] = [];

      // Process each item
      for (const itemDto of createPedidoDto.itens) {
        const produto = await manager.findOne(Produto, {
          where: { id: itemDto.produtoId },
        });

        if (!produto) {
          throw new NotFoundException(
            `Produto com ID ${itemDto.produtoId} não encontrado`,
          );
        }

        // Check stock availability
        if (produto.estoque < itemDto.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto "${produto.descricao}". ` +
              `Disponível: ${produto.estoque}, Solicitado: ${itemDto.quantidade}`,
          );
        }

        // Decrement stock
        produto.estoque -= itemDto.quantidade;
        await manager.save(Produto, produto);

        // Calculate subtotal
        const precoUnitario = Number(produto.valorVenda);
        const subtotal = precoUnitario * itemDto.quantidade;
        total += subtotal;

        // Create item (will be saved with pedido due to cascade)
        const item = manager.create(PedidoItem, {
          produtoId: itemDto.produtoId,
          quantidade: itemDto.quantidade,
          precoUnitario,
          subtotal,
        });

        itens.push(item);
      }

      // Create order
      const pedido = manager.create(Pedido, {
        clienteId: createPedidoDto.clienteId,
        total,
        itens,
      });

      const savedPedido = await manager.save(Pedido, pedido);

      // Return with relations
      return await manager.findOne(Pedido, {
        where: { id: savedPedido.id },
        relations: ['cliente', 'itens', 'itens.produto'],
      });
    });
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResult<Pedido>> {
    const { page = 1, limit = 10 } = paginationQuery;

    const [data, total] = await this.pedidoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['cliente', 'itens', 'itens.produto'],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['cliente', 'itens', 'itens.produto'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return pedido;
  }

  async remove(id: string): Promise<void> {
    const pedido = await this.findOne(id);
    await this.pedidoRepository.remove(pedido);
  }
}
