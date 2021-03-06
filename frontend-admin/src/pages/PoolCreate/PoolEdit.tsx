import React, {useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import {adminRoute} from "../../utils";
import PoolForm from "./PoolForm";
import {getPoolDetail} from "../../request/pool";
import moment from "moment";
import {DATETIME_FORMAT} from "../../constants";
import BackButton from "../../components/Base/ButtonLink/BackButton";
import {useDispatch, useSelector} from "react-redux";
import {get} from 'lodash';
import {getPoolBlockchainInfo} from "../../utils/blockchain";
import {alertFailure} from "../../store/actions/alert";
import ButtonLink from '../../components/Base/ButtonLink';
import useStyles from './style';

const PoolEdit: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const isEdit = true;
  const { match } = props;
  const dispatch = useDispatch();
  const styles = useStyles();
  const { data: loginUser } = useSelector((state: any) => state.user);
  const [poolDetail, setPoolDetail] = useState({});

  // @ts-ignore
  const id = match.params?.id;

  const getPoolInfoInBlockchain = async (data: any) => {
    if (!get(poolDetail, 'is_deploy')) {
      return;
    }
    try {
      const response = await getPoolBlockchainInfo(loginUser, data);
    } catch (e) {
      console.log('ERROR: ', e);
    }
  };

  useEffect(() => {
    getPoolDetail(id)
      .then(async (res) => {
        if (res.status !== 200) {
          dispatch(alertFailure('Server Error: ' + (res.message || 'Load pool fail !!!')));
          return false;
        }
        const data = res.data;
        const newData = {
          ...data,
          start_time: data?.start_time ? moment.unix(data?.start_time).format(DATETIME_FORMAT) : null,
          finish_time: data?.finish_time ? moment.unix(data?.finish_time).format(DATETIME_FORMAT) : null,
          release_time: data?.release_time ? moment.unix(data?.release_time).format(DATETIME_FORMAT) : null,
          start_join_pool_time: data?.start_join_pool_time ? moment.unix(data?.start_join_pool_time).format(DATETIME_FORMAT) : null,
          end_join_pool_time: data?.start_join_pool_time ? moment.unix(data?.end_join_pool_time).format(DATETIME_FORMAT) : null,
          start_pre_order_time: data?.start_pre_order_time ? moment.unix(data?.start_pre_order_time).format(DATETIME_FORMAT) : null,
          pre_order_min_tier: data?.pre_order_min_tier
        };

        setPoolDetail(newData);

        return res.data;
      })
      .catch((e) => {
        console.log('Error: ', e);
        dispatch(alertFailure('Pool load fail !!!'));
      });
  }, [id]);

  return (
    <DefaultLayout>
    <div className={styles.listButton}>
      <BackButton to={adminRoute('/campaigns')}/>
      <ButtonLink
        text='Clone Pool'
        to={{
          pathname: adminRoute('/campaigns/add'),
          state: {
            poolDetail: {...poolDetail, is_deploy: 0}
          }
        }}
        spacing={6}
      />
    </div>
      <PoolForm
        isEdit={isEdit}
        poolDetail={poolDetail}
      />
    </DefaultLayout>
  )
}

export default withRouter(PoolEdit);
