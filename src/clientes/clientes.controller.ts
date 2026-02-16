import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { ClientesService } from './clientes.service';
import { CnpjService } from '../cnpj/cnpj.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';

@ApiTags('clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClientesController {
  constructor(
    private readonly clientesService: ClientesService,
    private readonly cnpjService: CnpjService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.clientesService.findAll(paginationQuery);
  }

  @Get('consulta-cnpj/:cnpj')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Consultar dados de CNPJ na API externa' })
  @ApiResponse({ status: 200, description: 'Dados do CNPJ' })
  @ApiResponse({ status: 400, description: 'CNPJ inválido ou não encontrado' })
  consultarCnpj(@Param('cnpj') cnpj: string) {
    return this.cnpjService.lookup(cnpj);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deletar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente deletado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientesService.remove(id);
  }
}
