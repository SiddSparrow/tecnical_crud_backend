import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';

@ApiTags('pedidos')
@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USUARIO)
  @ApiOperation({ summary: 'Criar novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Estoque insuficiente' })
  @ApiResponse({ status: 404, description: 'Cliente ou produto não encontrado' })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USUARIO)
  @ApiOperation({ summary: 'Listar todos os pedidos' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.pedidosService.findAll(paginationQuery);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USUARIO)
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pedidosService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deletar pedido (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Pedido deletado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pedidosService.remove(id);
  }
}
