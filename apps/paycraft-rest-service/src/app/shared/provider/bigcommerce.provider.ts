import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RestServiceConfig } from '../../config/rest-service.config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Product } from '../domain/product';
import { AxiosResponse } from 'axios';
import { Order } from '../domain/order';
import {Customer} from "../domain/customer";
import {productOrder} from "../domain/product-order";

@Injectable()
export class BigcommerceProvider {

  baseUrl = 'https://api.bigcommerce.com/stores'
  headers = {
    'X-Auth-Token': this.configService.bigCommerceConfig.accessToken,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  constructor(
    private readonly configService: RestServiceConfig,
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  getOrder(orderId: number): Promise<AxiosResponse<Order>> {
    return lastValueFrom(
      this.httpService.get<Order>(
        `${this.baseUrl}/${this.configService.bigCommerceConfig.storeId}/v2/orders/${orderId}`,
        {
          headers: {
            ...this.headers
          }
        }
      )
    )
  }

  getCustomer(customerId: number): Promise<AxiosResponse<Customer>> {
    return lastValueFrom(
      this.httpService.get<Customer>(
        `${this.baseUrl}/${this.configService.bigCommerceConfig.storeId}/v2/customers/${customerId}`,
        {
          headers: {
            ...this.headers
          }
        }
      )
    )
  }

  getProduct(productId: number): Promise<AxiosResponse<Product>> {
    return lastValueFrom(
      this.httpService.get<Product>(
        `${this.baseUrl}/${this.configService.bigCommerceConfig.storeId}/v3/catalog/products/${productId}`,
        {
          headers: {
            ...this.headers
          }
        }
      )
    )
  }

  getProductsOrder(orderId: number): Promise<AxiosResponse<productOrder[]>> {
    return lastValueFrom(
      this.httpService.get<productOrder[]>(
        `${this.baseUrl}/${this.configService.bigCommerceConfig.storeId}/v2/orders/${orderId}/products`,
        {
          headers: {
            ...this.headers
          }
        }
      )
    )
  }
}
