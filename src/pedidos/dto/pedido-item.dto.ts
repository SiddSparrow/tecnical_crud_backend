import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PedidoItemDto {
  @ApiProperty({ example: 'uuid-do-produto' })
  @IsNotEmpty()
  @IsUUID()
  produtoId: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade: number;
}
