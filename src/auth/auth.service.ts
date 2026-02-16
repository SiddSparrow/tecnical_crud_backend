import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, UserRole } from '../usuarios/entities/usuario.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { nome, email, senha } = registerDto;

    // Check if user already exists
    const existingUser = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Create user — role is always USUARIO; admins are created via seed or promotion
    const usuario = this.usuarioRepository.create({
      nome,
      email,
      senha: hashedPassword,
      role: UserRole.USUARIO,
    });

    await this.usuarioRepository.save(usuario);

    // Generate token
    const payload = { sub: usuario.id, email: usuario.email, role: usuario.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    // Find user — explicitly select senha since it has select: false
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.senha')
      .where('usuario.email = :email', { email })
      .getOne();

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Generate token
    const payload = { sub: usuario.id, email: usuario.email, role: usuario.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }

  async validateUser(userId: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id: userId } });
  }
}
