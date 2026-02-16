import { IsNotEmpty, IsString, IsNumber, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProdutoDto {
  @ApiProperty({ example: 'Notebook Dell Inspiron 15' })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({ example: 2999.99 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valorVenda: number;

  @ApiProperty({ example: 50 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estoque: number;
}
