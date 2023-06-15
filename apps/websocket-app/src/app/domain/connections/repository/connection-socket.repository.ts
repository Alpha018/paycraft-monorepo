import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  ConnectionSocket,
  ConnectionSocketDocument,
} from '../model/connection-socket.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ConnectionSocketRepository {
  constructor(
    @InjectModel(ConnectionSocket.name)
    private readonly connectionModel: Model<ConnectionSocketDocument>
  ) {}

  createConnection(connection: ConnectionSocket): Promise<ConnectionSocket> {
    const createdConnection = new this.connectionModel(connection);
    return createdConnection.save();
  }

  findConnectionByToken(token: string): Promise<ConnectionSocket> {
    return this.connectionModel
      .findOne({
        serverToken: token,
        disconnectedAt: { $exists: false },
      })
      .exec();
  }

  findConnectionByClientId(clientId: string): Promise<ConnectionSocket> {
    return this.connectionModel
      .findOne({
        connectionId: clientId,
        disconnectedAt: { $exists: false },
      })
      .exec();
  }

  findConnectionByUserId(
    token: string,
    userId: string
  ): Promise<ConnectionSocket> {
    return this.connectionModel
      .findOne({
        connectionId: userId,
        serverToken: token,
        disconnectedAt: { $exists: false },
      })
      .exec();
  }

  closeConnection(token: string) {
    return this.connectionModel.findOneAndUpdate(
      {
        serverToken: token,
        disconnectedAt: { $exists: false },
      },
      {
        disconnectedAt: new Date(),
      },
      {
        new: true,
      }
    );
  }

  closeConnectionById(id: string) {
    return this.connectionModel.findOneAndUpdate(
      {
        _id: id,
        disconnectedAt: { $exists: false },
      },
      {
        disconnectedAt: new Date(),
      },
      {
        new: true,
      }
    );
  }

  getAllActiveConnections(): Promise<ConnectionSocketDocument[]> {
    return this.connectionModel
      .find({
        disconnectedAt: { $exists: false },
      })
      .exec();
  }
}
