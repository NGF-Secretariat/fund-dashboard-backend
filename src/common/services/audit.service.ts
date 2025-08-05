import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../audit-logs/audit-logs.entity';
import { User } from '../../users/user.entity';

export interface AuditLogData {
  entityType: string;
  entityId: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  createdBy?: User;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(data: AuditLogData): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        fieldChanged: data.fieldChanged,
        oldValue: data.oldValue,
        newValue: data.newValue,
        description: data.description,
        createdBy: data.createdBy,
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      // Don't throw error for audit logging failures
      console.error('Failed to log audit:', error);
    }
  }

  async logCreate(entityType: string, entityId: number, description: string, user?: User): Promise<void> {
    await this.log({
      entityType,
      entityId,
      action: 'CREATE',
      description,
      createdBy: user,
    });
  }

  async logUpdate(
    entityType: string, 
    entityId: number, 
    fieldChanged: string, 
    oldValue: string, 
    newValue: string, 
    description: string, 
    user?: User
  ): Promise<void> {
    await this.log({
      entityType,
      entityId,
      action: 'UPDATE',
      fieldChanged,
      oldValue,
      newValue,
      description,
      createdBy: user,
    });
  }

  async logDelete(entityType: string, entityId: number, description: string, user?: User): Promise<void> {
    await this.log({
      entityType,
      entityId,
      action: 'DELETE',
      description,
      createdBy: user,
    });
  }
} 