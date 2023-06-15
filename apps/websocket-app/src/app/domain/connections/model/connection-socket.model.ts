import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface UserList {
  uid: string;
  userName: string;
}

export enum Topics {
  COMMAND_EXECUTED = 'put_execution',
  USERS_INFORMATION = 'put_information',
  SEND_COMMANDS = 'get_commands',
}

export type ConnectionSocketDocument = ConnectionSocket & Document;

@Schema({ timestamps: true })
export class ConnectionSocket {
  @Prop({ index: true })
  serverToken: string;

  @Prop({ index: true })
  connectionId: string;

  @Prop()
  disconnectedAt?: Date;
}

export const ConnectionSocketSchema =
  SchemaFactory.createForClass(ConnectionSocket);
