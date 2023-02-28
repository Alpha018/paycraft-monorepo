import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';

@Controller()
export class HealthController {
  observable = new Observable((subscriber) => {
    const response = {
      status: 'SERVING'
    };
    subscriber.next(response);
    setInterval(() => {
      subscriber.next(response);
    }, 10000);
  });

  @GrpcMethod('Health', 'Check')
  healthCheck(body: { service: string }) {
    return {
      status: 'SERVING'
    }
  }

  @GrpcMethod('Health', 'Watch')
  watch(messages: { service: string }) {
    return this.observable
  }
}
