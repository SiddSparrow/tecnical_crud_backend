import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCnpj } from '../../common/validators/is-cnpj.validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Empresa Exemplo LTDA' })
  @IsNotEmpty()
  @IsString()
  razaoSocial: string;

  @ApiProperty({ example: '11.222.333/0001-81' })
  @IsNotEmpty()
  @IsString()
  @IsCnpj()
  cnpj: string;

  @ApiProperty({ example: 'contato@empresa.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
