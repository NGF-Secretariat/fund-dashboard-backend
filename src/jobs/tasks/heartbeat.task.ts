import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class HeartbeatTask {
    private readonly logger = new Logger(HeartbeatTask.name);

    @Cron(CronExpression.EVERY_10_MINUTES)
    handleCron() {
        this.logger.debug('Heartbeat: Cron job running every 10 minutes');
       
    }

    
}
