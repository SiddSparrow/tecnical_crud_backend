import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pedido } from './pedido.entity';
import { Produto } from '../../produtos/entities/produto.entity';

@Entity('pedido_itens')
export class PedidoItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'pedido_id' })
  pedidoId: string;

  @Column({ type: 'uuid', name: 'produto_id' })
  produtoId: string;

  @ManyToOne(() => Pedido, (pedido) => pedido.itens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Produto, { eager: true })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column({ type: 'integer' })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'preco_unitario' })
  precoUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
