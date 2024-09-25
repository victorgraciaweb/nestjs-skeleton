import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ExceptionHandlerService {

  handleExceptions(error: any): never {
    if (error.code === 11000) {
      const duplicateEntry = JSON.stringify(error.keyValue);
      throw new BadRequestException(`Entry already exists in the database: ${duplicateEntry}`);
    } else if (error instanceof NotFoundException) {
      throw error;
    } else if (error.response && error.response.status === 409) {
      throw new ConflictException('Conflict occurred with the request');
    }
    throw new InternalServerErrorException('An unexpected error occurred - Check server logs for details');
  }
}