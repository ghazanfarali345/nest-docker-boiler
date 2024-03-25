import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.MONGO_URL);

    return 'Hello World! blah 1';
  }
}
