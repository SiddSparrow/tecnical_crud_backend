import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', minimum: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha: string;
}
