import { Module } from '@nestjs/common';
import { CoreConfigModule } from '../config/core-config.module';
import { FirebaseService } from './service/firebase.service';
import { ContentfulService } from './service/contentful.service';


@Module({
  imports: [
    CoreConfigModule,
  ],
  providers: [
    FirebaseService,
    ContentfulService
  ],
  exports: [
    FirebaseService,
    ContentfulService
  ]
})
export class SharedModule {}
