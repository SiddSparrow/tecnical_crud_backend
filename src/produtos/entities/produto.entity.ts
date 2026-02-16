import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProdutoImagem } from './produto-imagem.entity';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'valor_venda' })
  valorVenda: number;

  @Column({ type: 'integer' })
  estoque: number;

  @OneToMany(() => ProdutoImagem, (imagem) => imagem.produto, {
    cascade: true,
    eager: true,
  })
  imagens: ProdutoImagem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
