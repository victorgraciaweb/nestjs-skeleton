import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ExceptionHandlerService } from 'src/common/services/exception-handler.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly exceptionHandlerService: ExceptionHandlerService
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.exceptionHandlerService.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string): Promise<Product> {
    try {
      let product: Product;
  
      if (isUUID(term)) {
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where('UPPER(title) = :title OR slug = :slug', {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          }).getOne();
      }
  
      if (!product) {
        throw new NotFoundException(`Product with term "${term}" not found`);
      }
  
      return product;
  
    } catch (error) {
      this.exceptionHandlerService.handleExceptions(error);
    }
  }  

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
