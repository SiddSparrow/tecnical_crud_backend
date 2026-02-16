import { IsNotEmpty, IsUUID, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PedidoItemDto } from './pedido-item.dto';

export class CreatePedidoDto {
  @ApiProperty({ example: 'uuid-do-cliente' })
  @IsNotEmpty()
  @IsUUID()
  clienteId: string;

  @ApiProperty({ type: [PedidoItemDto] })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  itens: PedidoItemDto[];
}
