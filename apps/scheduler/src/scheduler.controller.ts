import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

class ScheduleUserDto {
  username: string;
}

@Controller()
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('/schedule')
  async scheduleUserProfile(
    @Res() res,
    @Body() scheduleUserPayload: ScheduleUserDto,
  ): Promise<any> {
    const { username } = scheduleUserPayload;
    try {
      await this.schedulerService.schedule(username);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        status: 'error',
        error: {
          message: e.message,
        },
      });
    }

    res.status(HttpStatus.CREATED).send({
      status: 'ok',
      error: {},
    });
  }

  @EventPattern('schedule')
  async handleUserCreated(
    @Payload() { username }: ScheduleUserDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.schedulerService.createTasks(username);
      channel.ack(originalMsg);
    } catch (e) {
      console.error(`failed to create tasks for ${username}`);
    }
  }
}
