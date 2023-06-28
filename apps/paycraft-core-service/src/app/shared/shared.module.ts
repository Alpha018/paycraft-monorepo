import { Module } from '@nestjs/common';
import { FirebaseService } from './service/firebase.service';
import { ContentfulService } from './service/contentful.service';
import { TransbankService } from './service/transbank.service';
import { AblyService } from './service/ably.service';


@Module({
  imports: [],
  providers: [
    FirebaseService,
    ContentfulService,
    TransbankService,
    AblyService
  ],
  exports: [
    FirebaseService,
    ContentfulService,
    TransbankService,
    AblyService
  ]
})
export class SharedModule {}
