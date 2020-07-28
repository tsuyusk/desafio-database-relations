import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const nameExists = await this.productsRepository.findByName(name)

    if(nameExists){
      throw new AppError('This name is already being used by another product.')
    }

    const product = await this.productsRepository.create({
      name,
      price,
      quantity
    })

    return product;
  }
}

export default CreateProductService;
