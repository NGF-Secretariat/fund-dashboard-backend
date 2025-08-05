import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}


  @Get('grouped-accounts')
  async getAllAccountsGrouped() {
    console.log('controller hit');
    
    return this.dashboardService.getAllAccountsGrouped();
  }

  @Get('grouped-accounts/:category')
  async getAccountsGroupedByCategory(@Param('category') category: 'project' | 'secretariat') {
    return this.dashboardService.getAccountsGroupedByCategory(category);
  }
}
