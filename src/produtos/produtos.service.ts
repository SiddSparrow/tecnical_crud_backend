import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutoImagem } from './entities/produto-imagem.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    @InjectRepository(ProdutoImagem)
    private readonly produtoImagemRepository: Repository<ProdutoImagem>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const produto = this.produtoRepository.create(createProdutoDto);
    return this.produtoRepository.save(produto);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResult<Produto>> {
    const { page = 1, limit = 10 } = paginationQuery;

    const [data, total] = await this.produtoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['imagens'],
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['imagens'],
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async update(
    id: string,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    const produto = await this.findOne(id);
    Object.assign(produto, updateProdutoDto);
    return this.produtoRepository.save(produto);
  }

  async remove(id: string): Promise<void> {
    const produto = await this.findOne(id);

    // Delete image files from disk
    if (produto.imagens && produto.imagens.length > 0) {
      for (const imagem of produto.imagens) {
        const filePath = path.join(process.cwd(), imagem.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await this.produtoRepository.remove(produto);
  }

  async addImages(
    id: string,
    files: Express.Multer.File[],
  ): Promise<Produto> {
    const produto = await this.findOne(id);

    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhuma imagem foi enviada');
    }

    const imagens = files.map((file) => {
      const imagemPath = `/uploads/produtos/${file.filename}`;
      return this.produtoImagemRepository.create({
        produtoId: produto.id,
        filename: file.filename,
        path: imagemPath,
      });
    });

    await this.produtoImagemRepository.save(imagens);

    return this.findOne(id);
  }

  async removeImage(produtoId: string, imagemId: string): Promise<Produto> {
    const produto = await this.findOne(produtoId);

    const imagem = await this.produtoImagemRepository.findOne({
      where: { id: imagemId, produtoId },
    });

    if (!imagem) {
      throw new NotFoundException('Imagem não encontrada');
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), imagem.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.produtoImagemRepository.remove(imagem);

    return this.findOne(produtoId);
  }
}
