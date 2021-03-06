'use strict';

const Redis = use('Redis');
const Const = use('App/Common/Const');
const HelperUtils = use('App/Common/HelperUtils');
const RedisUtils = use('App/Common/RedisUtils');
const RedisWinnerUtils = use('App/Common/RedisWinnerUtils');

const WinnerListService = use('App/Services/WinnerListUserService');
const CaptchaService = use('App/Services/ReCaptchaService');
const ReservedListService = use('App/Services/ReservedListService');
const PoolService = use('App/Services/PoolService');
const WhitelistModel = use('App/Models/WhitelistUser');
const WinnerListModel = use('App/Models/WinnerListUser');
const CampaignModel = use('App/Models/Campaign');

class WinnerListUserController {
  async getWinnerListPublic({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    try {
      // total & data
      if (await RedisWinnerUtils.checkExistRedisPoolWinners(campaign_id)) {
        const data = JSON.parse(await RedisWinnerUtils.getRedisPoolWinners(campaign_id))
        return HelperUtils.responseSuccess(data);
      }

      let campaign = null;
      // Try get Campaign detail from Redis Cache
      if (await RedisUtils.checkExistRedisPoolDetail(campaign_id)) {
        let cachedPoolDetail = await RedisUtils.getRedisPoolDetail(campaign_id);
        if (cachedPoolDetail) {
          campaign = JSON.parse(cachedPoolDetail);
        }
      } else {
        campaign = await CampaignModel.query().where('id', campaign_id).first();
      }
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }

      if (campaign && (campaign.public_winner_status === Const.PUBLIC_WINNER_STATUS.PRIVATE)) {
        return HelperUtils.responseSuccess({data: [], total: 0});
      }

      // Hardcode for Oly community
      if (campaign_id === 41 || campaign_id === '41') {
        return HelperUtils.responseSuccess({data: [], total: 500});
      }

      // If claim time > return 0
      // if (campaign && campaign.campaignClaimConfig && campaign.campaignClaimConfig.length > 0) {
      //   const firstClaimTime = Number(campaign.campaignClaimConfig[0].start_time) * 1000
      //     let now = new Date()
      //     if (!isNaN(firstClaimTime) && now.getTime() > firstClaimTime && firstClaimTime > 0) {
      //       return HelperUtils.responseSuccess({data: [], total: 0});
      //     }
      // }

      const winnerListService = new WinnerListService();
      const data = await winnerListService.countTotalWinner({'campaign_id': campaign_id})
      await RedisWinnerUtils.setRedisPoolWinners(campaign_id, data)
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async search({request}) {
    const campaign_id = request.params.campaignId;
    const wallet = request.input('wallet_address') || '';
    const captcha_token = request.input('captcha_token') || '';
    if (!wallet || wallet === '') {
      return HelperUtils.responseNotFound('Wallet not found');
    }
    if (!captcha_token || captcha_token === '') {
      return HelperUtils.responseNotFound('Token not found');
    }

    try {
      let campaign = null;
      // Try get Campaign detail from Redis Cache
      if (await RedisUtils.checkExistRedisPoolDetail(campaign_id)) {
        let cachedPoolDetail = await RedisUtils.getRedisPoolDetail(campaign_id);
        if (cachedPoolDetail) {
          campaign = JSON.parse(cachedPoolDetail);
        }
      } else {
        campaign = await CampaignModel.query().where('id', campaign_id).first();
      }
      if (!campaign) {
        return HelperUtils.responseNotFound('Campaign not found');
      }

      if (campaign && (campaign.public_winner_status === Const.PUBLIC_WINNER_STATUS.PRIVATE)) {
        return HelperUtils.responseNotFound('Searching is not available');
      }

      // If claim time > return 0
      // if (campaign && campaign.campaignClaimConfig && campaign.campaignClaimConfig.length > 0) {
      //   const firstClaimTime = Number(campaign.campaignClaimConfig[0].start_time) * 1000
      //     let now = new Date()
      //     if (!isNaN(firstClaimTime) && now.getTime() > firstClaimTime && firstClaimTime > 0) {
      //       return HelperUtils.responseNotFound('');
      //     }
      // }

      // check recaptcha
      const captchaService = new CaptchaService()
      const verifiedData = await captchaService.VerifySearch(captcha_token)
      if (!verifiedData.status) {
        return HelperUtils.responseBadRequest(`Captcha verification failed: ${verifiedData.message}`);
      }

      const winnerListService = new WinnerListService();
      // get winner list
      const result = await winnerListService.findOneByFilters({
        'campaign_id': campaign_id,
        'wallet_address': wallet,
      })

      if (!result) {
        return HelperUtils.responseSuccess(false);
      }

      return HelperUtils.responseSuccess(true);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getWinnerListAdmin({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const page = request.input('page');
    const pageSize = request.input('limit') ? request.input('limit') : 10;
    console.log(`[getWinnerListAdmin] - start getWinnerList with campaign_id ${campaign_id} and page ${page} and pageSize ${pageSize}`);
    try {
      let campaign = null;
      // Try get Campaign detail from Redis Cache
      if (await RedisUtils.checkExistRedisPoolDetail(campaign_id)) {
        let cachedPoolDetail = await RedisUtils.getRedisPoolDetail(campaign_id);
        console.log('[getWinnerListAdmin] - Exist cache data Public Pool Detail: ', cachedPoolDetail);
        if (cachedPoolDetail) {
          campaign = JSON.parse(cachedPoolDetail);
        }
      } else {
        campaign = await CampaignModel.query().where('id', campaign_id).first();
        console.log('[getWinnerListAdmin] - Don\'t exist cache data Public Pool Detail. Getting from DB. ');
        console.log(JSON.stringify(campaign));
      }
      if (!campaign) {
        return HelperUtils.responseNotFound('Pool not found');
      }

      // if not existed winners on redis then get from db
      // create params to query to db
      const filterParams = {
        'campaign_id': campaign_id,
        'page': page,
        'pageSize': pageSize,
        'search_term': request.input('search_term') || '',
      };
      const winnerListService = new WinnerListService();
      // get winner list
      const winners = await winnerListService.findWinnerListAdmin(filterParams);

      return HelperUtils.responseSuccess(winners);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Winner List Failed !');
    }
  }

  async getWinnerAndReserveList({request}) {
    // get request params
    const campaign_id = request.params.campaignId;
    const page = request.input('page') || 1;
    const limit = request.input('limit') || 10;

    try {
      const winners = await WinnerListModel.query()
        .select('wallet_address', 'email', 'campaign_id')
        .where('campaign_id', campaign_id)
        .unionAll((query) => {
          query.select('wallet_address', 'email', 'campaign_id').from('reserved_list')
            .where('campaign_id', campaign_id)
        })
        .fetch();
      console.log('Mix Winners + Reserves User: ', JSON.stringify(winners));
      const paginationData = HelperUtils.paginationArray(winners, page, limit);

      return HelperUtils.responseSuccess(paginationData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('Get Winner List Failed !');
    }
  }

  async addWinnerUser({request}) {
    try {
      const inputParams = request.only(['wallet_address', 'email', 'campaign_id']);
      const params = {
        wallet_address: inputParams.wallet_address,
        email: inputParams.email,
        campaign_id: inputParams.campaign_id,
      };
      const winnerListService = new WinnerListService();
      const user = await winnerListService.buildQueryBuilder({
        wallet_address: inputParams.wallet_address,
        campaign_id: inputParams.campaign_id,
      }).first();
      console.log('user', user);

      if (user) {
        return HelperUtils.responseBadRequest('User Exist !');
      }
      const res = await winnerListService.addWinnerListUser(params);
      return HelperUtils.responseSuccess(res);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async deleteWinner({request, params}) {
    try {
      console.log('[deleteWinner] - Delete Winner with params: ', params, request.params);
      const {campaignId, walletAddress} = params;
      const winnerService = new WinnerListService();
      const existRecord = await winnerService.buildQueryBuilder({
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
      return HelperUtils.responseErrorInternal();
    }
  }

  async addParticipantsToWinner({request, params}) {
    try {
      console.log('[addParticipantsToWinner] - Add participants to Winner with params: ', params, request.params);
      const {campaignId} = params;
      const winners = request.input('winners') || [];
      console.log('[addParticipantsToWinner] - campaignId: ', campaignId, params, request.all());

      const resExist = await WhitelistModel.query()
        .whereIn('wallet_address', winners)
        .where('campaign_id', campaignId)
        .fetch();
      console.log('resExist', resExist);

      const data = await resExist.rows.map(async item => {
        try {
          const isExist = await WinnerListModel.query()
            .where('wallet_address', item.wallet_address)
            .where('campaign_id', item.campaign_id)
            .first();
          if (isExist) {
            return item;
          }

          console.log('[addParticipantsToWinner] - User Not Exist in Winner:', item);
          const walletAddress = await HelperUtils.checkSumAddress(item.wallet_address);
          let model = new WinnerListModel;
          model.email = item.email;
          model.wallet_address = item.wallet_address;
          model.campaign_id = item.campaign_id;
          model.lottery_ticket = 1;
          model.level = (await HelperUtils.getUserTierSmartWithCached(walletAddress))[0];
          await model.save();

          return model;
        } catch (e) {
          throw e;
        }
      });

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async checkExistWinner({request, params}) {
    try {
      console.log('[checkExistWinner] - Params: ', params);
      const inputParams = request.only(['wallet_address']);
      const campaign_id = params.campaignId;
      const wallet_address = inputParams.wallet_address;

      const poolService = new PoolService;
      const poolExist = await poolService.getPoolWithFreeBuySettingById(campaign_id);
      if (!poolExist || (poolExist.public_winner_status === Const.PUBLIC_WINNER_STATUS.PRIVATE)) {
        return HelperUtils.responseNotFound('User not exist in Winner User List');
      }

      const winnerService = new WinnerListService();
      const now = new Date().getTime();

      let existRecord = await winnerService.buildQueryBuilder({
        wallet_address,
        campaign_id,
      }).first();

      if (existRecord) {
        existRecord.email = ''
        if (poolExist.token_type === Const.TOKEN_TYPE.ERC721 &&
          poolExist.freeBuyTimeSetting && poolExist.freeBuyTimeSetting.start_buy_time &&
          now >= Number(poolExist.freeBuyTimeSetting.start_buy_time) * 1000) {
          existRecord.lottery_ticket++
        }

        return HelperUtils.responseSuccess(existRecord, 'User exist in Winner User List');
      }

      const reservedService = new ReservedListService();
      existRecord = await reservedService.buildQueryBuilder({
        wallet_address,
        campaign_id,
      }).first();

      if (existRecord) {
        existRecord.email = ''
        return HelperUtils.responseSuccess(existRecord, 'User exist in Winner User List');
      }

      return HelperUtils.responseNotFound('User not exist in Winner User List');
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async checkPickedWinner({request, params}) {
    try {
      const campaign_id = params.campaignId;
      const winnerService = new WinnerListService();

      // Check Public Winner Status
      const poolService = new PoolService;
      const poolExist = await poolService.getPoolById(campaign_id);
      if (!poolExist || (poolExist.public_winner_status === Const.PUBLIC_WINNER_STATUS.PRIVATE)) {
        return HelperUtils.responseSuccess(false, 'The campaign has not yet chosen a winner');
      }

      // TODO: Add to Cache
      let existRecord = await winnerService.buildQueryBuilder({ campaign_id }).first();
      if (existRecord) {
        return HelperUtils.responseSuccess(true, 'Success');
      }
      return HelperUtils.responseSuccess(false, 'winners not found');
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

}

module.exports = WinnerListUserController
