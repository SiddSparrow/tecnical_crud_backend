import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Produto } from './produto.entity';

@Entity('produto_imagens')
export class ProdutoImagem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'produto_id' })
  produtoId: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 500 })
  path: string;

  @ManyToOne(() => Produto, (produto) => produto.imagens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
