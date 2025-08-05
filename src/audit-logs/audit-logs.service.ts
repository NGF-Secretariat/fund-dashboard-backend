import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-logs.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async findAll(options?: { startDate?: string; endDate?: string; limit?: number; page?: number }) {
    const query = this.auditLogsRepository.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.createdBy', 'createdBy')
      .orderBy('auditLog.createdAt', 'DESC');

      if (options?.startDate) {
        const start = new Date(options.startDate);
        start.setUTCHours(0, 0, 0, 0);
        query.andWhere('auditLog.createdAt >= :startDate', { startDate: start.toISOString() });
      }
      
      if (options?.endDate) {
        const end = new Date(options.endDate);
        end.setUTCHours(23, 59, 59, 999);
        query.andWhere('auditLog.createdAt <= :endDate', { endDate: end.toISOString() });
      }
      
    let limit = options?.limit || 50;
    let page = options?.page || 1;
    query.take(limit);
    query.skip((page - 1) * limit);

    const [auditLogs, total] = await query.getManyAndCount();

    return {
      success: true,
      data: auditLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const auditLog = await this.auditLogsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!auditLog) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }

    return {
      success: true,
      data: auditLog,
    };
  }

  async findByEntity(entityType: string, entityId: number, options?: { startDate?: string; endDate?: string; limit?: number; page?: number }) {
    const query = this.auditLogsRepository.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.createdBy', 'createdBy')
      .where('auditLog.entityType = :entityType', { entityType })
      .andWhere('auditLog.entityId = :entityId', { entityId })
      .orderBy('auditLog.createdAt', 'DESC');

    if (options?.startDate) {
      query.andWhere('auditLog.createdAt >= :startDate', { startDate: options.startDate });
    }
    if (options?.endDate) {
      query.andWhere('auditLog.createdAt <= :endDate', { endDate: options.endDate });
    }
    let limit = options?.limit || 50;
    let page = options?.page || 1;
    query.take(limit);
    query.skip((page - 1) * limit);

    const [auditLogs, total] = await query.getManyAndCount();

    return {
      success: true,
      data: auditLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(userId: number, options?: { startDate?: string; endDate?: string; limit?: number; page?: number }) {
    const query = this.auditLogsRepository.createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.createdBy', 'createdBy')
      .where('createdBy.id = :userId', { userId })
      .orderBy('auditLog.createdAt', 'DESC');

    if (options?.startDate) {
      query.andWhere('auditLog.createdAt >= :startDate', { startDate: options.startDate });
    }
    if (options?.endDate) {
      query.andWhere('auditLog.createdAt <= :endDate', { endDate: options.endDate });
    }
    let limit = options?.limit || 50;
    let page = options?.page || 1;
    query.take(limit);
    query.skip((page - 1) * limit);

    const [auditLogs, total] = await query.getManyAndCount();

    return {
      success: true,
      data: auditLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
