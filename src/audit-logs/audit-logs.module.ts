import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-logs.entity';
import { User } from 'src/users/user.entity';

@Module({
  providers: [AuditLogsService],
  controllers: [AuditLogsController],
  imports: [TypeOrmModule.forFeature([AuditLog, User])],
})
export class AuditLogsModule {}
