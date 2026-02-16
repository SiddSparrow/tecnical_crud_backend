import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../usuarios/entities/usuario.entity';

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

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USUARIO })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
