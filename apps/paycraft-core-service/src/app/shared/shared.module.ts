import { Module } from '@nestjs/common';
import { CoreConfigModule } from '../config/core-config.module';
import { FirebaseService } from './service/firebase.service';
import { ContentfulService } from './service/contentful.service';
import { TransbankService } from './service/transbank.service';


@Module({
  imports: [
    CoreConfigModule,
  ],
  providers: [
    FirebaseService,
    ContentfulService,
    TransbankService
  ],
  exports: [
    FirebaseService,
    ContentfulService,
    TransbankService
  ]
})
export class SharedModule {}
