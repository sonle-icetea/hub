import React, {useEffect, useState} from "react";
import {debounce} from 'lodash';
import BigNumber from "bignumber.js";
import {useWeb3React} from '@web3-react/core';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useHistory, withRouter} from "react-router-dom";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Hidden,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withWidth
} from "@material-ui/core";

import Pagination from '@material-ui/lab/Pagination';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from '../../../services/axios';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';
import {getAccessPoolText} from "../../../utils/campaign";
import {NULL_AMOUNT, POOL_IS_PRIVATE, POOL_STATUS, POOL_STATUS_JOINED, POOL_STATUS_TEXT} from "../../../constants";
import useWalletSignature from '../../../hooks/useWalletSignature';
import { alertFailure, alertSuccess } from '../../../store/actions/alert';
import ModalWhitelistCancel from "./ModalWhitelistCancel";
import useStyles from './style';
import {unixTimeNow} from "../../../utils/convertDate";
import {fillClaimInfo} from "../../../utils/claim";
import {getAppNetWork} from "../../../utils/network";
import {getIconCurrencyUsdt} from "../../../utils/usdt";
import ClaimStatusTextCell from "./ClaimStatusTextCell";
import ClaimButtonCell from "./ClaimButtonCell";

const listStatuses = [
  { value: '', babel: 'All Statuses', color: ''},
  { value: POOL_STATUS_JOINED.APPLIED_WHITELIST, babel: 'Applied Whitelist', color: '#9E63FF'},
  { value: POOL_STATUS_JOINED.WIN_WHITELIST, babel: 'Win Whitelist', color: '#FF9330'},
  { value: POOL_STATUS_JOINED.NOT_WIN_WHITELIST, babel: 'Not Win Whitelist', color: '#7E7E7E'},
  { value: POOL_STATUS_JOINED.SWAPPING, babel: 'Swapping', color: '#72F34B'},
  { value: POOL_STATUS_JOINED.CLAIMABLE, babel: 'Claimable', color: '#FFD058'},
  { value: POOL_STATUS_JOINED.COMPLETED, babel: 'Completed', color: '#7E7E7E'},
  { value: POOL_STATUS_JOINED.CANCELED_WHITELIST, babel: 'Canceled Whitelist', color: '#D01F36'},
];

const listTypes = [
  { value: 1000, babel: 'All types'},
  { value: POOL_IS_PRIVATE.PUBLIC, babel: 'Public'},
  { value: POOL_IS_PRIVATE.PRIVATE, babel: 'Private'},
  { value: POOL_IS_PRIVATE.SEED, babel: 'Seed'},
];

const MyPools = (props: any) => {
  const styles = useStyles();
  const { notEth } = props;

  const history = useHistory();
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { signature, signMessage } = useWalletSignature();

  // For Detech Claim
  const { connectedAccount, wrongChain } = useAuth();
  const { data: appChain } = useSelector((state: any) => state.appNetwork);
  const appChainID = appChain.appChainID;
  const { data: connector } = useSelector((state: any) => state.connector);
  const appNetwork = getAppNetWork(appChainID);

  const {data: userTier = 0} = useSelector((state: any) => state.userTier);
  const [input, setInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pools, setPools] = useState([]);
  const [poolCancel, setPoolCancel] = useState({});
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [currentTimeGetPool, setCurrentTimeGetPool] = useState(new Date().getTime());
  const [loadingClaimInfo, setLoadingClaimInfo] = useState(false);
  const now = unixTimeNow();

  const [filterStatus, setFilterStatus] = React.useState<{ status: string | number; babel: string }>({
    status: '',
    babel: '',
  });

  const [filterType, setFilterType] = useState<{ type: string | number; babel: string }>({
    type: 1000,
    babel: '',
  });

  const handleChangeStatus = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof filterStatus;
    const value = event.target.value as keyof typeof filterStatus;
    setFilterStatus({
      ...filterStatus,
      [name]: value,
    });
  };

  const handleChangeType = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as keyof typeof filterType;
    const value = event.target.value as keyof typeof filterType;
    setFilterType({
      ...filterType,
      [name]: value,
    });
  };

  const getPoolsPrefixUri = () => {
    let uri = '/pools';
    return `${uri}/user/${connectedAccount}/joined-pools`;
  }

  const { data: poolsList, loading: loadingGetPool } = useFetch<any>(
    `${getPoolsPrefixUri()}?page=${currentPage}&limit=10&title=${input}&type=${filterType.type}&status=${filterStatus.status}&current_time=${currentTimeGetPool}`
  );

  const handleInputChange = debounce((e: any) => {
    Promise.resolve().then(() => {
      setInput(e.target.value);
      setCurrentPage(1);
    });
  }, 1000);

  useEffect(() => {
    const manipulatePoolsData = async (pools: any) => {
      let listData = pools.data;
      // Setting Pages:
      setTotalPage(pools.lastPage);
      setCurrentPage(Number(pools.page));
      setLoadingClaimInfo(true);

      if (listData && listData.length > 0) {
        listData = await fillClaimInfo({
          listData,
          connectedAccount,
          connector,
          appChainID,
          appNetwork,
          wrongChain
        });
      }

      setPools(listData);
      setLoadingClaimInfo(false);
    };

    poolsList && poolsList.data && manipulatePoolsData(poolsList);
  }, [poolsList, appChain, connector]);

  const poolStatus = (pool: any) => {
    switch(pool.joined_status) {
      case POOL_STATUS_JOINED.CANCELED_WHITELIST:
        return <div className="status_pool canceled-whitelist"><span>Canceled Whitelist</span></div>
      case POOL_STATUS_JOINED.APPLIED_WHITELIST:
        return <div className="status_pool applied-whitelist"><span>Applied Whitelist</span></div>
      case POOL_STATUS_JOINED.WIN_WHITELIST:
        return <div className="status_pool win-whitelist"><span>Win Whitelist</span></div>
      case POOL_STATUS_JOINED.NOT_WIN_WHITELIST:
        return <div className="status_pool not-win-whitelist"><span>Not Win Whitelist</span></div>
      case POOL_STATUS_JOINED.SWAPPING:
        return <div className="status_pool swapping"><span>Swapping</span></div>
      case POOL_STATUS_JOINED.CLAIMABLE:
        return <ClaimStatusTextCell
          poolDetails={pool}
        />
        // // if (pool?.campaign_status == POOL_STATUS_TEXT[POOL_STATUS.FILLED]) {
        // if (pool?.userClaimInfo?.is_filled_claim) {
        //   return <div className="status_pool filled"><span>Filled</span></div>
        // }
        // if (pool?.userClaimInfo?.is_claimed_all_token) {
        //   return <div className="status_pool claimable"><span>Completed</span></div>
        // }
        // return <div className="status_pool claimable"><span>Claimable</span></div>
      case POOL_STATUS_JOINED.COMPLETED:
        return <div className="status_pool completed"><span>Completed</span></div>
      default:
        return <div className="status_pool none"><span>-</span></div>
    }
  };

  const allocationAmount = (pool: any) => {
    if (!pool) return null;

    // Get Currency Info
    const { currencyIcon, currencyName } = getIconCurrencyUsdt({
      purchasableCurrency: pool?.purchasableCurrency || pool?.accept_currency,
      networkAvailable: pool?.networkAvailable || pool?.network_available,
    });
    if (pool.allowcation_amount === NULL_AMOUNT) return '-';
    let allowcationAmount = pool.allowcation_amount;
    if (new BigNumber(allowcationAmount).lte(0)) return '-';

    const allowcationAmountText = `${new BigNumber(allowcationAmount || 0).toFixed()} ${currencyName?.toUpperCase()}`;

    return allowcationAmountText;
  };

  const preOrderAmount = (pool: any) => {
    if (!pool) return '-';
    if (pool.allowcation_pre_order_amount === NULL_AMOUNT) return '-';

    // Get Currency Info
    const { currencyIcon, currencyName } = getIconCurrencyUsdt({
      purchasableCurrency: pool?.purchasableCurrency || pool?.accept_currency,
      networkAvailable: pool?.networkAvailable || pool?.network_available,
    });

    let allowcationAmount = pool.allowcation_pre_order_amount;
    if (new BigNumber(allowcationAmount).lte(0)) return '-';

    const allowcationAmountText = `${new BigNumber(allowcationAmount || 0).toFixed()} ${currencyName?.toUpperCase()}`;

    return allowcationAmountText;
  };

  const onShowModalCancel = async (pool: any) => {
    setPoolCancel(pool);
    if(!signature) {
      await signMessage();
    } else {
      setOpenModalCancel(true);
    }
  };
  useEffect(() => {
    if(signature && connectedAccount) {
      setOpenModalCancel(true);
    }
  },[signature, connectedAccount]);

  const onCloseModalCancel = () => {
    setPoolCancel({});
    setOpenModalCancel(false);
  };

  const onCancelPool = async (pool: any) => {
    if (signature) {
      const config = {
        headers: {
          msgSignature: process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE
        }
      }
      const response = await axios.post(`/user/unjoin-campaign`, {
        signature,
        campaign_id: pool?.id,
        wallet_address: account,
      }, config as any) as any;

      if (response.data) {
        if (response.data.status === 200) {
          getPoolsPrefixUri();
          setPoolCancel({});
          setOpenModalCancel(false);
          setCurrentTimeGetPool(new Date().getTime());
          dispatch(alertSuccess("You have successfully cancelled your whitelist application."));
        }

        if (response.data.status !== 200) {
          dispatch(alertFailure(response.data.message));
        }
      }
    }
  };

  const actionButton = (pool: any) => {
    if (pool.joined_status === POOL_STATUS_JOINED.NOT_WIN_WHITELIST
      || pool.joined_status === POOL_STATUS_JOINED.CANCELED_WHITELIST
      || pool.joined_status === POOL_STATUS_JOINED.SWAPPING
      || pool.joined_status === POOL_STATUS_JOINED.COMPLETED
    ) return null;

    /*if (pool.joined_status === POOL_STATUS_JOINED.APPLIED_WHITELIST) {
      return (
        <Button
          // disabled={notEth}
          className={`${styles.btnAction} btnCancelWhitelist`}
          onClick={() => onShowModalCancel(pool)}
        >
          Cancel Whitelist
        </Button>
      );
    }*/

    if (pool.joined_status === POOL_STATUS_JOINED.WIN_WHITELIST) {
      if (
        userTier < pool.pre_order_min_tier  // Not enough tier to PreOrder
        || !pool.campaign_hash              // Not deploy yet
        || !pool.start_pre_order_time       // Not set PreOrder Time in Admin
        || now < parseInt(pool.start_pre_order_time)  // Not reached to PreOrder Time yet
      ) return null;

      if (pool.preOrderUsers && pool.preOrderUsers.length > 0) {
        const amountPreOrdered = pool.preOrderUsers[0]?.pivot?.amount || 0;
        if (pool.allowcation_amount !== NULL_AMOUNT && new BigNumber(amountPreOrdered).gte(new BigNumber(pool.allowcation_amount))) {
          return null;
        }
      }
      return (
        <Button
          // disabled={notEth}
          className={`${styles.btnAction} btnPreOrder`}
          onClick={() => history.push(`/buy-token/${pool.id}`)}
        >
          Pre-Order
        </Button>
      );
    }

    if (pool.joined_status === POOL_STATUS_JOINED.CLAIMABLE) {

      return <ClaimButtonCell
        poolDetails={pool}
        // notEth={notEth}
      />

      // const userClaimInfo = pool?.userClaimInfo || {};
      // if (!userClaimInfo?.show_claim_button) {
      //   return null;
      // }
      //
      // return (
      //   <Button
      //     disabled={notEth}
      //     onClick={() => history.push(`/buy-token/${pool.id}`)}
      //     className={`${styles.btnAction} btnClaimToken`}>
      //     Claim Token
      //     {pool?.show_claim_button}
      //   </Button>
      // );
    }

    return <></>;
  };

  return (
    <div className={styles.pageMyPools}>
      <h2 className={styles.title}>My Pools</h2>
      <div className={styles.des}>
        Here are all pools that you have participated in. Note:
      </div>
      <ul className={styles.listDes}>
        {/*
                <li>You can cancel the whitelist during the whitelisting time of the pool. </li>
        */}
        <li>Pre-order function for Phoenix members. </li>
      </ul>
      <div className={styles.headTable}>
        <div  className={styles.leftFillter}>
          <FormControl className={styles.formControlSelect}>
            <Select
              className={styles.selectBox}
              native
              IconComponent={ExpandMoreIcon}
              value={filterStatus.status}
              onChange={handleChangeStatus}
              inputProps={{
                name: 'status',
              }}
            >
              {
                listStatuses?.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>{item.babel}</option>
                  )
                })
              }
            </Select>
          </FormControl>
          <FormControl className={styles.formControlSelect}>
            <Select
              className={`${styles.selectBox} ${styles.selectBoxType}`}
              native
              IconComponent={ExpandMoreIcon}
              value={filterType.type}
              onChange={handleChangeType}
              inputProps={{
                name: 'type',
                id: 'list-types',
              }}
            >
              {
                listTypes?.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>{item.babel}</option>
                  )
                })
              }
            </Select>
          </FormControl>
        </div>

        <div className={styles.groupSearch}>
          <input
            type="text"
            placeholder="Search pool name"
            onChange={handleInputChange}
          />
          <Button>
            <img src="/images/icons/search.svg" alt="" />
          </Button>
        </div>
      </div>

      <Hidden smDown>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableCellHead}>Pool Name</TableCell>
                <TableCell className={styles.tableCellHead}>Type</TableCell>
                <TableCell className={styles.tableCellHead}>Status</TableCell>
                <TableCell className={styles.tableCellHead}>Allocation</TableCell>
                <TableCell className={styles.tableCellHead}>Pre-order</TableCell>
                <TableCell  className={styles.tableCellHead} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pools.map((row: any, index: number) => (
                <TableRow key={index} className={styles.tableRow}>
                  <TableCell className={styles.tableCellBody} component="th" scope="row">
                    <Link to={`/buy-token/${row?.id}`} className={styles.toDetailPool}>
                      <img className={styles.iconToken} src={row.token_images} alt="" />
                      <span className={styles.nameToken}>{row.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell className={styles.tableCellBody}>
                    {getAccessPoolText(row)}
                  </TableCell>
                  <TableCell className={styles.tableCellBody}>
                    {poolStatus(row)}
                  </TableCell>
                  <TableCell className={styles.tableCellBody}>
                    {allocationAmount(row)}
                  </TableCell>
                  <TableCell className={styles.tableCellBody}>
                    {preOrderAmount(row)}
                  </TableCell>
                  <TableCell className={styles.tableCellBody} align="center">{actionButton(row)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Hidden>

      <Hidden mdUp>
        <div className={styles.datasMobile}>
          {pools.map((row: any, index: number) => (
            <div key={index} className={styles.boxDataMobile}>
              <div className={styles.titleBoxMobile}>
                <Link to={`/buy-token/${row?.id}`} className={styles.toDetailPool}>
                  <img className={styles.iconTokenMobile} src={row.token_images} alt="" />
                  <span className={styles.nameTokenMobile}>{row.title}</span>
                </Link>
              </div>
              <ul className={styles.infoMobile}>
                <li>
                  <div className={styles.nameMobile}>Type</div>
                  <div>
                    {getAccessPoolText(row)}
                  </div>
                </li>
                <li>
                  <div className={styles.nameMobile}>Status</div>
                  <div className={styles.valueMobile}>
                    {poolStatus(row)}
                  </div>
                </li>
                <li>
                  <div className={styles.nameMobile}>Allocation</div>
                  <div>{allocationAmount(row)}</div>
                </li>
                <li>
                  <div className={styles.nameMobile}>Pre-order</div>
                  <div className={styles.valueMobile}>{preOrderAmount(row)}</div>
                </li>
                {
                  actionButton(row) !== null &&
                  <li>
                    <div className={styles.nameMobile}>Action</div>
                    <div className={styles.valueMobile}>{actionButton(row)}</div>
                  </li>
                }
              </ul>
            </div>
          ))}
        </div>
      </Hidden>

      <div className={styles.pagination}>
        {
          totalPage > 1 && <Pagination
            count={totalPage}
            color="primary"
            style={{ marginTop: 30 }} className={styles.pagination}
            onChange={(e: any, value: any) => {
              if (!loadingGetPool) {
                setCurrentPage(value)
              }
            }}
            page={currentPage}
          />
        }
      </div>

      <ModalWhitelistCancel
        poolCancel={poolCancel}
        openModalCancel={openModalCancel}
        onCloseModalCancel={() => onCloseModalCancel()}
        onCancelPool={(pool: any) => onCancelPool(pool)}
      />

      <Backdrop open={loadingGetPool || loadingClaimInfo} className={styles.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default withWidth()(withRouter(MyPools));
