import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { Produto } from './entities/produto.entity';
import { ProdutoImagem } from './entities/produto-imagem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, ProdutoImagem])],
  controllers: [ProdutosController],
  providers: [ProdutosService],
  exports: [ProdutosService],
})
export class ProdutosModule {}
