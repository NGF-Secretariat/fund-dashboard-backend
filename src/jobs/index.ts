import { HeartbeatTask } from './tasks/heartbeat.task';

/**
 * Global Cron Job Index
 * Add any new cron jobs to this array to start them automatically.
 */
export const CRON_JOBS = [
    HeartbeatTask,
    // Add more cron jobs here
];
