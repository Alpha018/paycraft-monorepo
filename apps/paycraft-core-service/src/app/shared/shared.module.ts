import { Module } from '@nestjs/common';
import { FirebaseService } from './service/firebase.service';
import { ContentfulService } from './service/contentful.service';
import { TransbankService } from './service/transbank.service';


@Module({
  imports: [],
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
