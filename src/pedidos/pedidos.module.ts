import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoItem])],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
