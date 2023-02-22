import { Module } from '@nestjs/common';
import { RestConfigModule } from '../config/rest-config.module';
import { HttpModule } from '@nestjs/axios';
import { BigcommerceProvider } from './provider/bigcommerce.provider';
import { BigcommerceService } from './service/bigcommerce.service';


@Module({
  imports: [
    RestConfigModule,
    HttpModule
  ],
  providers: [
    BigcommerceProvider,
    BigcommerceService
  ],
  exports: [
    BigcommerceService
  ]
})
export class SharedModule {}
