import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private profile: Model<ProfileDocument>,
  ) {}

  async upsert(data): Promise<any> {
    return this.profile.updateOne(
      { login: data.username },
      {
        $set: {
          ...data,
        },
        $inc: {
          stages: 1,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async getEnrichedOne(username, stages = 6): Promise<ProfileDocument> {
    return this.profile.findOne(
      {
        login: username,
        stages,
      },
      { _id: 0 },
    );
  }
}
