import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ExceptionHandlerService {
  handleExceptions(error: any): never {
    console.error(error);

    if (error.code === '23505') {
      const detail = error.detail || 'Duplicate entry';
      throw new BadRequestException(`Duplicate entry error: ${detail}`);
    } 
    
    if (error instanceof NotFoundException) {
      const resource = error.message || 'Resource';
      throw new NotFoundException(`${resource} not found`);
    } 
    
    if (error.response && error.response.status === 409) {
      throw new ConflictException('Conflict occurred with the request');
    }
    
    throw new InternalServerErrorException('An unexpected error occurred - Check server logs for details');
  }
}