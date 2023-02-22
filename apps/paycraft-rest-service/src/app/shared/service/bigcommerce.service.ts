import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RestServiceConfig } from '../../config/rest-service.config';
import { BigcommerceProvider } from '../provider/bigcommerce.provider';
import { createWinstonContext } from 'utils';

@Injectable()
export class BigcommerceService {

  constructor(
    private readonly configService: RestServiceConfig,
    private readonly bigCommerceProvider: BigcommerceProvider,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}


  async getOrder(orderId: number) {
    const meta = createWinstonContext(
      this.constructor.name,
      this.getOrder.name
    );

    const { data: order } = await this.bigCommerceProvider.getOrder(orderId);

    if (order.status !== 'Completed') {
      this.logger.error('Error in order status, not complete', {
        ...meta,
        orderId,
      })
      throw new BadRequestException('Order not completed')
    }

    const [customer, productsOrder] = await Promise.all([
      this.bigCommerceProvider.getCustomer(order.customer_id),
      this.bigCommerceProvider.getProductsOrder(orderId)
    ]);

    return {
      rawData: order,
      userName: customer.data.form_fields[0].value,
      planId: +productsOrder.data[0].sku
    }
  }
}
