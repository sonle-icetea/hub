const _ = require('lodash');

const Const = use('App/Common/Const');
const ErrorFactory = use('App/Common/ErrorFactory');

class Common {
  constructor() {
    //
  }

  toSnakeCase(obj) {
    return _.transform(obj, (result, val, key) => {
      const newVal = _.isObject(val) ? this.toSnakeCase(val) : val;
      result[_.snakeCase(key)] = newVal;
    });
  }

  toCamelCase(obj) {
    let camel;
    try {
      obj = obj.toJSON();
    } catch (err) {
      if (!(err instanceof TypeError)) {
        throw err;
      }
    } finally {
      camel = _.transform(obj, (result, val, key) => {
        const newVal = _.isObject(val) ? this.toCamelCase(val) : val;
        result[_.camelCase(key)] = newVal;
      });
    }
    return camel;
  }

  saveParseJSON(jsonStr) {
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return jsonStr;
    }
  }

  buildPaginationMetaData(pageNum, metaData) {
    return {
      pagination: {
        page: pageNum,
        page_count: metaData.lastPage,
        item_count: metaData.total
      }
    };
  }

  buildResponseWithPagination(pageNum, result, modified = null) {
    if (modified) {
      return {
        data: result.data,
        meta: {
          pagination: {
            page: result.page,
            page_count: result.lastPage,
            item_count: result.total
          }
        }
      };
    }
    return {
      data: result.toJSON().data,
      meta: {
        pagination: {
          page: result.pages.page,
          page_count: result.pages.lastPage,
          item_count: result.pages.total
        }
      }
    };
  }

  checkTxTableValid(txTable) {
    if (_.find(Const.TX_TABLE, e => e == txTable) === undefined) {
      this.throwUnknownTxTableErr(txTable);
    }
  }

  throwUnknownTxTableErr(txTable) {
    throw ErrorFactory.internal(`Unknown txTable: ${txTable}`);
  }

  SnapshotGroupBy(objectArray, property) {
    return objectArray.reduce((result, item) => {
      if (!Array.isArray(result)) {
        result = []
      }
      const key = item[property]
      let existed = false
      for (let index = 0; index < result.length; index++) {
        if (result[index].id === key) {
          result[index].top.push(item)
          existed = true
          break;
        }
      }

      if (!existed) {
        result.push({name: '', id: item.campaign_id, snapshot_at: item.snapshot_at, top: [item]})
      }
      return result
    }, {})
  }
}

module.exports = new Common();
