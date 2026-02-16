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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('produtos')
@Controller('produtos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }

  @Get()
  @Roles('ADMIN', 'USUARIO')
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.produtosService.findAll(paginationQuery);
  }

  @Get(':id')
  @Roles('ADMIN', 'USUARIO')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.produtosService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    return this.produtosService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Deletar produto' })
  @ApiResponse({ status: 200, description: 'Produto deletado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.produtosService.remove(id);
  }

  @Post(':id/imagens')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Upload de imagens do produto' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Imagens adicionadas com sucesso' })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/produtos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(
            new BadRequestException(
              'Apenas arquivos de imagem são permitidos (jpg, jpeg, png, gif, webp)',
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.produtosService.addImages(id, files);
  }

  @Delete(':id/imagens/:imagemId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Deletar imagem do produto' })
  @ApiResponse({ status: 200, description: 'Imagem deletada com sucesso' })
  removeImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imagemId', ParseUUIDPipe) imagemId: string,
  ) {
    return this.produtosService.removeImage(id, imagemId);
  }
}
