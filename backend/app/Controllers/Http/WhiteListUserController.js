'use strict'

const WhitelistService = use('App/Services/WhitelistUserService')
const TierService = use('App/Services/TierService');
const CampaignService = use('App/Services/CampaignService');
const HelperUtils = use('App/Common/HelperUtils');
const Redis = use('Redis');
const PickRandomWinnerJobWithWeightRate = use('App/Jobs/PickRandomWinnerJobWithWeightRate');
const PickRandomWinnerNormalRule = use('App/Jobs/PickRandomWinnerNormalRule');
const PickRandomWinnerJobWithLuckyDove = use('App/Jobs/PickRandomWinnerJobWithLuckyDove');
const PickWinnerWithGameFITicket = use('App/Jobs/PickWinnerWithGameFITicket');
const PickWinnerBaseOnSnapshot = use('App/Jobs/PickWinnerBaseOnSnapshot');
const Const = use('App/Common/Const');

class WhiteListUserController {
  async getWhiteList({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const page = request.input('page');
    const pageSize = request.input('limit') ? request.input('limit') : 10;
    console.log(`start getWhiteList with campaign_id ${campaign_id} and page ${page} and pageSize ${pageSize}`);
    try {
      // get from redis cached
      // let redisKey = 'whitelist_' + campaign_id;
      // if (page) {
      //   redisKey = redisKey.concat('_', page, '_', pageSize);
      // }
      // if (await Redis.exists(redisKey)) {
      //   console.log(`existed key ${redisKey} on redis`);
      //   const cachedWL = await Redis.get(redisKey);
      //   return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      // }
      // if not existed whitelist on redis then get from db
      const filterParams = {
        'campaign_id': campaign_id,
        'page': page,
        'pageSize': pageSize
      };
      const whitelistService = new WhitelistService();
      // get winner list
      const whitelist = await whitelistService.findWhitelistUser(filterParams);
      // save to redis
      // await Redis.set(redisKey, JSON.stringify(whitelist));
      return HelperUtils.responseSuccess(whitelist);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Whitelist Failed !');
    }
  }

  async getParticipants({ request }) {
    // get request params
    const campaign_id = request.params.campaignId;
    const page = request.input('page');
    const pageSize = request.input('limit') ? request.input('limit') : 10;
    const whiteListPending = request.input('whitelist_pending') ? request.input('whitelist_pending') === 'true' : false;
    console.log(`start getWhiteList with campaign_id ${campaign_id} and page ${page} and pageSize ${pageSize}`);
    try {
      // get from redis cached
      // let redisKey = 'whitelist_' + campaign_id;
      // if (page) {
      //   redisKey = redisKey.concat('_', page, '_', pageSize);
      // }
      // if (await Redis.exists(redisKey)) {
      //   console.log(`existed key ${redisKey} on redis`);
      //   const cachedWL = await Redis.get(redisKey);
      //   return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      // }
      // if not existed whitelist on redis then get from db
      const filterParams = {
        'campaign_id': campaign_id,
        'page': page,
        'pageSize': pageSize,
        'whitelist_pending': whiteListPending,
        'search_term': request.input('search_term') || '',
      };
      const whitelistService = new WhitelistService();
      // get winner list
      const whitelist = await whitelistService.findWhitelistUser(filterParams);
      // save to redis
      // await Redis.set(redisKey, JSON.stringify(whitelist));
      return HelperUtils.responseSuccess(whitelist);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Whitelist Failed !');
    }
  }

  async deleteWhiteList({request, params}) {
    try {
      console.log('[deleteWhiteList] - Delete WhiteList with params: ', params, request.params);

      const {campaignId, walletAddress} = params;
      const whitelistService = new WhitelistService();
      const existRecord = await whitelistService.buildQueryBuilder({
        campaign_id: campaignId,
        wallet_address: walletAddress,
      }).first();
      if (existRecord) {
        await existRecord.delete();
      }
      console.log('existRecord', existRecord);
      return HelperUtils.responseSuccess(existRecord);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Delete white list fail !');
    }
  }

  async getRandomWinners({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const rule = request.params.number;
    console.log(`Pick random winner with campaign ${campaign_id} and total ticket ${rule}`);
    try {
      // get tier setting from db
      const tierService = new TierService();
      const oldTiers = await tierService.findAllByFilter({'campaign_id': campaign_id});
      if (oldTiers === undefined || oldTiers.length == 0) {
        console.log(`Do not found tiers with campaign ${campaign_id}`);
        return HelperUtils.responseBadRequest('Do not found tiers with campaign request');
      }
      const newTiers = oldTiers.toJSON();
      // filter tier
      let tierData = [];
      for (let i = 0; i < newTiers.length; i++) {
        const item = newTiers[i];
        if (item.ticket_allow) {
          const tierObj = {
            level: item.level,
            ticket_allow: item.ticket_allow,
            max_buy: item.max_buy,
          };
          tierData.push(tierObj);
        }
      }
      // create data to pick winner
      const randomData = {
        campaign_id : campaign_id,
        tiers : tierData
      }

      // dispatch to job to pick random user
      switch (rule) {
        case Const.PICK_WINNER_RULE.RULE_NORMAL:
          PickRandomWinnerNormalRule.handle(randomData)
          break;
        case Const.PICK_WINNER_RULE.RULE_WITH_WEIGHT_RATE:
          PickRandomWinnerJobWithWeightRate.handle(randomData)
          break;
        case Const.PICK_WINNER_RULE.RULE_LUCKY_DOVE:
          PickRandomWinnerJobWithLuckyDove.handle(randomData)
          break;
        case Const.PICK_WINNER_RULE.RULE_GAMEFI_TICKET:
          PickWinnerWithGameFITicket.handle(randomData)
          break;
        case Const.PICK_WINNER_RULE.RULE_BASE_ON_SNAPSHOT:
          PickWinnerBaseOnSnapshot.handle(randomData)
          break;
      }
      (new CampaignService).updatePickWinnerRule(campaign_id, rule);
      return HelperUtils.responseSuccess(null, "Pickup random winner successful !")
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Random Winners Failed !');
    }
  }

  async addWhitelistUser({request}) {
    try {
      const inputParams = request.only(['wallet_address', 'email', 'campaign_id']);
      const params = {
        wallet_address: inputParams.wallet_address,
        email: inputParams.email,
        campaign_id: inputParams.campaign_id,
      };
      const whitelistService = new WhitelistService();
      const user = await whitelistService.buildQueryBuilder({
        wallet_address: inputParams.wallet_address,
        campaign_id: inputParams.campaign_id,
      }).first();
      console.log('[addWhitelistUser] - user: ', user);

      if (user) {
        return HelperUtils.responseBadRequest('User Exist !');
      }
      const res = await whitelistService.addWhitelistUser(params);
      return HelperUtils.responseSuccess(res);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Add whitelist fail !');
    }
  }

}

module.exports = WhiteListUserController
