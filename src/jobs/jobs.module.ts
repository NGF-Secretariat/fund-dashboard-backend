import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CRON_JOBS } from './index';

@Module({
    imports: [
        ScheduleModule.forRoot(),
    ],
    providers: [
        ...CRON_JOBS,
    ],
})
export class JobsModule { }
