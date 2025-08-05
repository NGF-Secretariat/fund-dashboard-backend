import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { AuditService } from '../services/audit.service';
import { User } from '../../users/user.entity';

// Extend Express Request to include user
interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const method = request.method;
    const url = request.url;
    const body = request.body;

    // Only intercept POST, PUT, PATCH requests
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (response) => {
        try {
          // Extract entity type from URL
          const entityType = this.extractEntityType(url);
          
          if (entityType && response?.data?.id) {
            const action = method === 'POST' ? 'CREATE' : 'UPDATE';
            const description = this.generateDescription(method, entityType, body, response);
            
            // Handle cases where user might not be authenticated (for backward compatibility)
            const userId = user?.id || null;
            const userEmail = user?.email || 'anonymous';
            
            if (action === 'CREATE') {
              await this.auditService.logCreate(
                entityType,
                response.data.id,
                description,
                user
              );
            } else if (action === 'UPDATE') {
              // For updates, we'll log a generic update since we don't have old values here
              await this.auditService.logUpdate(
                entityType,
                response.data.id,
                'multiple_fields',
                'previous_values',
                'updated_values',
                description,
                user
              );
            } else if (method === 'DELETE') {
              // Log delete action
              await this.auditService.logDelete(
                entityType,
                response.data?.id || body.id, // or however you get the deleted ID
                this.generateDescription(method, entityType, body, response),
                user
              );
            }
          }
        } catch (error) {
          // Don't throw error for audit logging failures
          console.error('Audit interceptor error:', error);
        }
      })
    );
  }

  private extractEntityType(url: string): string | null {
    // Extract entity type from URL patterns like /transactions, /accounts, etc.
    const match = url.match(/^\/([^\/]+)/);
    return match ? match[1] : null;
  }

  private generateDescription(method: string, entityType: string, body: any, response: any): string {
    const action = method === 'POST' ? 'Created' : 'Updated';
    if (entityType === 'transactions' || entityType === 'transaction') {
      // Try to extract details from response first, then body
      const data = response?.data || body;
      const type = data?.type || body?.type;
      const amount = data?.amount || body?.amount;
      const account = data?.account?.name || body?.accountName || data?.accountName;
      const desc = data?.description || body?.description;
      let base = `${action}`;
      if (type) base += ` ${type}`;
      base += ' transaction';
      if (amount) base += ` of ${amount}`;
      if (account) base += ` for account ${account}`;
      if (desc) base += ` ("${desc}")`;
      return base;
    }
    switch (entityType) {
      case 'accounts':
        return `${action} account "${body.name || response.data.name}"`;
      case 'users':
        return `${action} user "${body.email || response.data.email}"`;
      case 'banks':
        return `${action} bank "${body.name || response.data.name}"`;
      case 'currencies':
        return `${action} currency "${body.code || response.data.code}"`;
      case 'categories':
        return `${action} category "${body.name || response.data.name}"`;
      default:
        return `${action} ${entityType} with ID ${response.data.id}`;
    }
  }
} 