import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Customer not found');
    }

    const existentProducts = await this.productsRepository.findAllById(
      products,
    );

    if (!existentProducts.length) {
      throw new AppError('Products not found');
    }

    const existentProductsIds = existentProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existentProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}`,
      );
    }

    /*const findProductsWithNoQuantityAvailable = products.filter(
      product =>
        existentProducts.find(
          existentProduct => existentProduct.id === product.id,
        )!.quantity <= product.quantity,
    );*/

    const findProductWithNoQuantityAvailable = products.find(product =>
      existentProducts.find(
        existentProduct => existentProduct.id === product.id,
      ),
    );

    if (findProductWithNoQuantityAvailable) {
      throw new AppError(
        `Cannot get ${findProductWithNoQuantityAvailable.quantity} amounts of ${findProductWithNoQuantityAvailable.id}`,
      );
    }

    const formattedProducts = products.map(product => {
      const productWithPrice = existentProducts.find(
        existentProduct => existentProduct.id === product.id,
      );
      return {
        product_id: product.id,
        quantity: product.quantity,
        price: productWithPrice!.price,
      };
    });

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: formattedProducts,
    });

    const { order_products } = order;

    const updatedProducts = order_products.map(product => {
      const verifiedProduct = existentProducts.find(
        existentProduct => existentProduct.id === product.id,
      );
      return {
        id: product.product_id,
        quantity: verifiedProduct!.quantity - product.quantity,
      };
    });

    await this.productsRepository.updateQuantity(updatedProducts);

    return order;
  }
}

export default CreateOrderService;
