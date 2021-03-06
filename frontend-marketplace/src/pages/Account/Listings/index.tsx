import React, { useEffect, useState } from 'react'
// import { AppBar, TabPanel } from '@base-components/Tabs';
// import CardMarketplace from '@base-components/CardMarketplace';
// import axios from '@services/axios';
// import { ObjectType } from '@app-types';
// import erc721ABI from '@abi/Erc721.json';
// import { getContractInstance } from '@services/web3';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '@hooks/useAuth';
import BoxCard, { getElmStr, useStyles as useCardStyles } from '../components/BoxCard';
import { Link } from 'react-router-dom';
import { setAssetsCollection, setListingsCollection } from '@store/actions/inventory';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router-dom'
import { Backdrop, Box, Button } from '@material-ui/core';
import CircularProgress from '@base-components/CircularProgress';
import { useTabStyles } from '../style';
// import { SearchBox } from '@base-components/SearchBox';
// import { getNetworkInfo } from '@utils/network';
// import { useTypedSelector } from '@hooks/useTypedSelector';
// import { setProjectInfor } from '@store/actions/project-collection';
// import { setTokenInfor } from '@store/actions/tokenInfor';
// import { getSymbolCurrency } from '@utils/getAccountBalance';
// import { setCurrencyTokenAddress } from '@store/actions/currency';
import NotfoundItem from '../components/NotfoundItem';
const Listings = () => {
    const styles = useTabStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { connectedAccount, wrongChain /*isAuth*/ } = useAuth();
    // const offerListAccount = useSelector((state: any) => state.offerListAccount)?.data || {};

    const onRedirectDetail = (item: any) => {
        history.push(`/collection/${item.slug}/${item.token_id}`)
    }

    const renderBoxItem = (item: any, key: any) => {
        return (
            <BoxCard key={key} item={item} onClick={() => onRedirectDetail(item)} />
        )
    }
    
    const listingsAccount = useSelector((state: any) => state.listingsAccount);
    useEffect(() => {
        if (listingsAccount.loading || listingsAccount.data == null) return;
        const collections = listingsAccount?.data?.[connectedAccount as string];
        const wrapBoxElem = document.querySelector(`#listings`);
        if (!wrapBoxElem) return;
        if (collections?.length) {
            ReactDOM.render(<>
                {collections.map((c: any) => renderBoxItem(c, c.key))}
            </>, wrapBoxElem)
        } else {
            ReactDOM.render(<NotfoundItem />, wrapBoxElem)
        }
    }, [listingsAccount, connectedAccount])

    useEffect(() => {
        if (connectedAccount) {
            dispatch(setListingsCollection(connectedAccount));
        }
    }, [connectedAccount])

    // const [loadingAsset, setLoadingAsset] = useState(false);
    // const connectorName = useTypedSelector(state => state.connector).data;
    // const projectInfors = useSelector((state: any) => state.projectInfors)?.data || {};
    // const currencies = useSelector((state: any) => state.currencies)?.data || {};
    // const tokenInfors = useSelector((state: any) => state.tokenInfors)?.data || {};
    // useEffect(() => {
    //     if (!connectedAccount) return;
    //     const wrapBoxElem = document.querySelector(`#listings`);
    //     setLoadingAsset(true);
    //     axios.get(`/marketplace/listings/${connectedAccount}`).then(async (res) => {
    //         const arr = res.data.data || [];
    //         if (arr.length) {
    //             if (!wrapBoxElem) return;
    //             const collections: ObjectType<any>[] = [];
    //             for (let i = 0, leng = arr.length; i < leng; i++) {
    //                 setLoadingAsset(false);
    //                 const item = arr[i];
    //                 const networkInfo = getNetworkInfo(item.network);
    //                 item.currencySymbol = currencies[item.currency];
    //                 if (!item.currencySymbol) {
    //                     item.currencySymbol = await getSymbolCurrency(item.currency, { appChainId: networkInfo?.id, connectorName });
    //                     dispatch(setCurrencyTokenAddress(item.currency, item.currencySymbol));
    //                 }
    //                 const projectAddress = item.token_address;
    //                 let project = projectInfors[item.slug];
    //                 if (!project) {
    //                     try {
    //                         const response = await axios.get(`/marketplace/collection/${item.slug}`);
    //                         project = response.data.data || {};
    //                         dispatch(setProjectInfor(item.slug, project));
    //                     } catch (error) {

    //                     }
    //                 }
    //                 item.project = project;
    //                 const useExternalUri = !!+project?.use_external_uri;
    //                 let tokenInfor = tokenInfors[item.token_id];
    //                 if (!tokenInfor) {
    //                     tokenInfor = {};
    //                     try {
    //                         if (useExternalUri) {
    //                             const result = await axios.post(`/marketplace/collection/${projectAddress}/${item.token_id}`);
    //                             tokenInfor = result.data.data || {};
    //                         } else {
    //                             const erc721Contract = getContractInstance(erc721ABI, projectAddress, connectorName, networkInfo.id);
    //                             if (erc721Contract) {
    //                                 const tokenURI = await erc721Contract.methods.tokenURI(item.token_id).call();
    //                                 tokenInfor = (await axios.get(tokenURI)).data || {};
    //                             }
    //                         }
    //                     } catch (error) {
    //                         item.image = '';
    //                         console.log('err', error)
    //                     }
    //                     dispatch(setTokenInfor(item.token_id, tokenInfor))
    //                 }
    //                 item.value = +item.value || item.value;
    //                 Object.assign(item, tokenInfor);
    //                 collections.push(item);
    //                 ReactDOM.render(<>
    //                     {collections.map((c: any, id) => renderBoxItem(c, Math.floor(Math.random() + 10000) + (+c.id + id || 1)))}
    //                 </>, wrapBoxElem)
    //             }
    //         } else {
    //             setLoadingAsset(false);
    //             if (wrapBoxElem) {
    //                 ReactDOM.render(<div className="wrapper-not-found">
    //                     <img src="/images/icons/item-not-found.svg" alt="" />
    //                     <h4>No item found</h4>
    //                 </div>, wrapBoxElem)
    //             }
    //         }
    //     })
    // }, [connectedAccount]);

    return (
        <div>

            <h3 className={styles.heading}>Listings</h3>
            {/* <p className="text-grey font-12px firs-neue-font mb-20px">Only NFTs selected by GameFi will be shown.</p> */}
            {/* <Box display="flex" flexWrap="wrap" gridGap="20px" justifyContent="space-between">
                <Box>
                    <SearchBox placeholder="Search" />
                </Box>
            </Box> */}

            <div className="divider"></div>
            {
                listingsAccount.loading && <Backdrop open={listingsAccount.loading} style={{ color: '#fff', zIndex: 1000, }}>
                    <CircularProgress />
                </Backdrop>
            }
            <Box className={styles.cards} id="listings">
            </Box>
        </div>
    )
}

export default Listings
