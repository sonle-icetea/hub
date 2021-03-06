'use strict'

const Task = use('Task')
const StakingEventService = use('App/Services/StakingEventService');

class FetchStakingEvents extends Task {
  isRunning = false;

  static get schedule () {
    console.log('[FetchStakingEvents] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      // return '*/15 * * * * *';
      return '*/15 * * * * *';
    } else {
      return '*/15 * * * * *';
    }
  }

  async handle () {
    if (this.isRunning) {
      console.log('stop FetchStakingEvents')
      return
    }
    try {
      this.isRunning = true

      console.log('Task FetchStakingEvents handle');
      await (new StakingEventService).runAll();
    }
    catch (e) {
      console.log('error', e)
    }
    finally {
      this.isRunning = false
    }
  }
}

module.exports = FetchStakingEvents;
