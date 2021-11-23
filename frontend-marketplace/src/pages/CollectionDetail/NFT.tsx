import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import useStyles, { useMarketplaceStyle } from "./style";
import { AboutMarketplaceNFT } from "./About";
import { apiRoute, cvtAddressToStar, getApproveToken, getCurrencyByNetwork, getDiffTime, getTimelineOfPool, isImageFile, isVideoFile } from "../../utils";
import { Progress } from "@base-components/Progress";
import { useFetchV1 } from "../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import {
    APP_NETWORKS_SUPPORT,
} from "../../constants/network";
import useKyc from "../../hooks/useKyc";
import useAuth from "../../hooks/useAuth";
import { AlertKYC } from "../../components/Base/AlertKYC";
import { HashLoader } from "react-spinners";
import { WrapperAlert } from "../../components/Base/WrapperAlert";
import { pushMessage } from "../../store/actions/message";
import Image from "../../components/Base/Image";
import CountDownTime, { CountDownTimeType as CountDownTimeTypeV1 } from "@base-components/CountDownTime";

import _ from 'lodash';
import { getUserTier } from "@store/actions/sota-tiers";
import { Link } from "react-router-dom";
import { TIERS } from "@app-constants";
import { getContract } from "@utils/contract";
import PreSaleBoxAbi from '@abi/PreSaleBox.json';
import { useWeb3React } from "@web3-react/core";
import BigNumber from 'bignumber.js';
import { ButtonBase } from "@base-components/Buttons";
import TransferNFTModal from "./components/TransferNFTModal";
import { alertFailure, alertSuccess, alertWarning } from "@store/actions/alert";
import ListingNFTModal from "./components/ListNFTModal";
import useTokenAllowance from "@hooks/useTokenAllowance";
import useTokenApprove from '@hooks/useTokenApprove';
import { getExplorerTransactionAddress, getNetworkInfo } from "@utils/network";
import { ObjectType } from "@app-types";
import axios from "@services/axios";
import { getContractInstance } from "@services/web3";
import erc721ABI from '@abi/Erc721.json';
import marketplaceABI from '@abi/Marketplace.json';
import { utils } from 'ethers'
import OfferNFTModal from "./components/OfferNFTModal";
import DialogTxSubmitted from "@base-components/DialogTxSubmitted";
import CircularProgress from "@base-components/CircularProgress";
import { Backdrop } from "@material-ui/core";
const MARKETPLACE_SMART_CONTRACT = process.env.REACT_APP_MARKETPLACE_SMART_CONTRACT as string;

const MysteryBox = ({ id, projectAddress, ...props }: any) => {
    const styles = useStyles();
    const marketplaceStyle = useMarketplaceStyle();
    const dispatch = useDispatch();
    const { library } = useWeb3React();
    const { connectedAccount, wrongChain } = useAuth();
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const [infoNFT, setInfoNFT] = useState<ObjectType<any>>({});
    const [addressOwnerNFT, setAddressOwnerNFT] = useState('');
    const [marketplaceContract, setMarketplaceContract] = useState<any>(null);
    const [erc721Contract, setErc721Contract] = useState<any>(null);
    useEffect(() => {
        if (!library || !connectedAccount) {
            setMarketplaceContract(null);
            return;
        }
        const contract = getContract(MARKETPLACE_SMART_CONTRACT, marketplaceABI, library, connectedAccount as string);
        setMarketplaceContract(contract);
    }, [library, connectedAccount]);

    useEffect(() => {
        if (!library || !connectedAccount) {
            setErc721Contract(null);
            return;
        }
        const contract = getContract(projectAddress, erc721ABI, library, connectedAccount as string);
        setErc721Contract(contract);
    }, [library, connectedAccount]);

    useEffect(() => {
        if (!appChainID || !erc721Contract) {
            setInfoNFT({});
            return;
        }
        setInfoNFT({ loading: true });
        axios.get(`/marketplace/collection/${projectAddress}`).then(async (res) => {
            const infoProject = res.data.data;
            if (!infoProject) {
                setInfoNFT({});
                return;
            }
            try {
                getAddresssOwnerNFT();
                if (+infoProject.use_external_uri === 1) {
                    const result = await axios.post(`/marketplace/collection/${projectAddress}/${id}`);
                    setInfoNFT({
                        ...(result.data.data || {}),
                        id: id,
                        project: infoProject,
                        success: true,
                    })
                } else {
                    const tokenURI = await erc721Contract.tokenURI(id);
                    const infoBoxType = (await axios.get(tokenURI)).data || {};
                    setInfoNFT({
                        ...infoBoxType,
                        id: id,
                        project: infoProject,
                        success: true,
                    })
                }
            } catch (error: any) {
                console.log('err', error)
                setInfoNFT({ loading: false, error: true, project: infoProject, });
            }
        })
    }, [id, projectAddress, appChainID, erc721Contract])

    const getAddresssOwnerNFT = async () => {
        if (!erc721Contract) {
            return;
        }
        const addressOwnerNFT = await erc721Contract.ownerOf(id);
        setAddressOwnerNFT(addressOwnerNFT);
    }

    const [addressOwnerOnSale, setAddressOwnerOnSale] = useState('');
    const [nftPrice, setNFTPrice] = useState('0');
    const [addressCurrencyToBuy, setAddressCurrency] = useState('');
    const getTokenOnSale = async () => {
        try {
            const tokenOnSale = await marketplaceContract.tokensOnSale(projectAddress, id);
            console.log('tokenOnSale', tokenOnSale)
            setAddressOwnerOnSale(tokenOnSale.tokenOwner);
            setNFTPrice(utils.formatEther(tokenOnSale.price))
            setAddressCurrency(tokenOnSale.currency);
        } catch (error) {
            console.log('er', error)
        }
    }
    useEffect(() => {
        if (!appChainID || !MARKETPLACE_SMART_CONTRACT || !marketplaceContract) return;
        getTokenOnSale();
    }, [id, appChainID, projectAddress, marketplaceContract])

    useEffect(() => {
        dispatch(getUserTier(!wrongChain && connectedAccount ? connectedAccount : ''));
    }, [wrongChain, connectedAccount, dispatch]);

    const [allowNetwork, setAllowNetwork] = useState<{ ok: boolean, [k: string]: any }>({ ok: false });
    useEffect(() => {
        // const networkInfo = APP_NETWORKS_SUPPORT[Number(appChainID)];
        if (!infoNFT.project?.network) return;
        const networkInfo = getNetworkInfo(infoNFT.project?.network)
        // if (!networkInfo || !infoNFT?.network_available) {
        //     return;
        // }
        const ok = String(networkInfo.name).toLowerCase() === (infoNFT.network || "").toLowerCase();
        // if (!ok) {
        //     dispatch(pushMessage(`Please switch to ${(infoNFT.network_available || '').toLocaleUpperCase()} network to do Apply Whitelist, Approve/Buy tokens.`))
        // } else {
        //     dispatch(pushMessage(''));
        // }
        setAllowNetwork(
            {
                ok,
                ...networkInfo,
            }
        );
    }, [infoNFT, appChainID, dispatch]);

    // const tagTypes = ['Character', 'Sales'];
    // const tagCategories = ['Fighting', 'Strategy'];


    const [txHash, setTxHash] = useState('');
    const [openTxModal, setOpenTxModal] = useState(false);

    const [lockingAction, setLockingAction] = useState({
        action: '',
        lock: false,
    });
    const checkFnIsLoading = (fnName: string): boolean => {
        return lockingAction.action === fnName && lockingAction.lock;
    }
    const [reloadOfferList, setReloadOfferList] = useState(1);
    const handleTx = async (tx: any, action?: string) => {
        dispatch(alertWarning("Request is processing!"));
        setTxHash(tx.hash)
        setOpenTxModal(true)
        if (action === onListingNFT.name) {
            setOpenListingModal(false);
        }
        if (action === onTransferNFT.name) {
            setOpenTransferModal(false);
        }
        if (action === onOfferNFT.name) {
            setOpenOfferModal(false);
        }
        await tx.wait(1);
        dispatch(alertSuccess("Request Successful"));
        if ([
            onListingNFT.name,
            onDelistNFT.name,
            onTransferNFT.name,
            onBuyNFT.name,
            onAcceptOffer.name
        ].includes(action as string)) {
            getTokenOnSale();
            getAddresssOwnerNFT();
        }
        if (action === onOfferNFT.name) {
            setReloadOfferList(c => c + 1);
        }
        if (action === onRejectOffer.name) {
            setReloadOfferList(c => c + 1);
        }
        if (action === onApproveToMarketplace.name) {
            checkApproveMarketplace();
        }
        setLockingAction({ action: '', lock: false });
    }

    const handleError = (error: any) => {
        const msgError = error?.data?.message || error?.message;
        dispatch(alertFailure(msgError));
        setLockingAction({ action: '', lock: false });
    }

    const handleCallContract = async (action: string, fnCallContract: Function) => {
        try {
            if (!marketplaceContract) return;
            setLockingAction({ action, lock: true });
            const tx = await fnCallContract();
            handleTx(tx, action);
        } catch (error) {
            handleError(error)
        }
    }
    const [openListingModal, setOpenListingModal] = useState(false);
    const [openOfferModal, setOpenOfferModal] = useState(false);
    const [openTransferModal, setOpenTransferModal] = useState(false);
    useEffect(() => {
        console.log('infoNFT', infoNFT)
    }, [infoNFT])
    const [tokenSelected, setTokenSeleted] = useState<ObjectType<any>>({});
    useEffect(() => {
        if (infoNFT?.project?.accepted_tokens?.length) {
            setTokenSeleted(infoNFT.project.accepted_tokens[0]);
        }
    }, [infoNFT?.project?.accepted_tokens]);
    const onSelectToken = (token: ObjectType<any>) => {
        setTokenSeleted(token);
        console.log('token', token)
    }

    const onListingNFT = (price: number) => {
        handleCallContract(
            onListingNFT.name,
            () => marketplaceContract.list(id, projectAddress, utils.parseEther(price + ''), tokenSelected.address)
        )
    }

    const onDelistNFT = () => {
        handleCallContract(
            onDelistNFT.name,
            () => marketplaceContract.delist(id, projectAddress)
        )
    }

    const onTransferNFT = (receiverAddress: string) => {
        if (!erc721Contract) return;
        handleCallContract(onTransferNFT.name, () => erc721Contract.transferFrom(connectedAccount, receiverAddress, id))
    }

    const onOfferNFT = async (offerPrice: number) => {
        const options = {
            value: utils.parseEther(offerPrice + '')
        }
        handleCallContract(onOfferNFT.name, () => marketplaceContract.offer(id, projectAddress, options.value, addressCurrencyToBuy, options))
    }
    const onBuyNFT = () => {
        const options: ObjectType<any> = {}
        if (new BigNumber(addressCurrencyToBuy).isZero()) {
            options.value = utils.parseEther(nftPrice + '');
        }
        handleCallContract(onBuyNFT.name, () => marketplaceContract.buy(id, projectAddress, utils.parseEther(nftPrice + ''), addressCurrencyToBuy, options))
    }

    const onAcceptOffer = async (item: ObjectType<any>) => {
        console.log(item.raw_amount)
        handleCallContract(onAcceptOffer.name, () => marketplaceContract.takeOffer(id, projectAddress, new BigNumber(item.raw_amount).toFixed(), addressCurrencyToBuy, item.buyer));
    }

    const onRejectOffer = async () => {
        handleCallContract(onRejectOffer.name, () => marketplaceContract.cancelOffer(id, projectAddress));
    }

    const onApproveToMarketplace = () => {
        if (!erc721Contract) return;
        handleCallContract(onApproveToMarketplace.name, () => erc721Contract.setApprovalForAll(MARKETPLACE_SMART_CONTRACT, true))
    }

    const [isApprovedMarketplace, setApprovedMarketplace] = useState(false);
    const checkApproveMarketplace = async () => {
        try {
            if (!erc721Contract) return;
            const isApproved = await erc721Contract.isApprovedForAll(connectedAccount, MARKETPLACE_SMART_CONTRACT);
            setApprovedMarketplace(isApproved)
        } catch (error) {
            console.log('err', error)
        }
    }
    useEffect(() => {
        if (!library || !connectedAccount || !erc721Contract) return;
        checkApproveMarketplace();
    }, [projectAddress, library, connectedAccount, erc721Contract]);

    const isOwnerNFT = connectedAccount && connectedAccount === addressOwnerNFT;
    const isOwnerNFTOnSale = connectedAccount && addressOwnerOnSale === connectedAccount;

    const { retrieveTokenAllowance, tokenAllowanceLoading } = useTokenAllowance();
    const { approveToken, setTokenApproveLoading, tokenApproveLoading, transactionHash } = useTokenApprove({ address: addressCurrencyToBuy } as any, infoNFT?.project?.token_address, connectedAccount, false);
    const onApproveToken = () => {
        try {
            approveToken();
        } catch (error) {
            console.log('error', error);
        }
    }
    const checkApproveToken = async () => {
        try {
            const allowance = await retrieveTokenAllowance({ address: addressCurrencyToBuy } as any, infoNFT.project.token_address, connectedAccount as string);
            console.log(allowance);
            setApprovedToken({ loading: false, ok: !new BigNumber(allowance || 0).isZero() });
        } catch (error) {
            console.log('err', error);
        }
    }
    useEffect(() => {
        if (transactionHash) {
            setOpenTxModal(true);
            setTxHash(transactionHash);
            checkApproveToken();
        }
    }, [transactionHash]);



    const [isApprovedToken, setApprovedToken] = useState({ loading: false, ok: false });
    useEffect(() => {
        if (isOwnerNFT || isOwnerNFTOnSale) return;
        if (!addressCurrencyToBuy || !connectedAccount || !infoNFT?.project?.token_address) return;
        if (addressCurrencyToBuy && !new BigNumber(addressCurrencyToBuy).isZero() && connectedAccount) {
            setApprovedToken({ loading: true, ok: false });
            checkApproveToken();
        }
    }, [addressCurrencyToBuy, connectedAccount, infoNFT?.project?.token_address, isOwnerNFT, isOwnerNFTOnSale]);


    return (
        <>
            <div className={styles.content}>
                {
                    !connectedAccount && <WrapperAlert>
                        Please connect to wallet
                    </WrapperAlert>
                }
                <DialogTxSubmitted open={openTxModal} onClose={() => setOpenTxModal(false)} transaction={txHash} />
                <TransferNFTModal open={openTransferModal} onClose={() => setOpenTransferModal(false)} onConfirm={onTransferNFT} isLoadingButton={lockingAction.lock} />
                <OfferNFTModal open={openOfferModal} onClose={() => setOpenOfferModal(false)} onConfirm={onOfferNFT} isLoadingButton={lockingAction.lock} />
                <ListingNFTModal
                    open={openListingModal}
                    onClose={() => setOpenListingModal(false)}
                    onConfirm={onListingNFT}
                    onApprove={onApproveToMarketplace}
                    isApproved={isApprovedMarketplace}
                    isLoadingButton={lockingAction.lock}
                    listAcceptTokens={infoNFT?.project?.accepted_tokens}
                    onSelectToken={onSelectToken}
                    tokenSelected={tokenSelected}
                />
                {
                    infoNFT.loading ? <Backdrop open={infoNFT.loading} style={{ color: '#fff', zIndex: 1000, }}>
                        <CircularProgress color="inherit" />
                    </Backdrop> :
                        <>
                            <div className={styles.contentCardNft}>
                                <div className={clsx(styles.wrapperCard, styles.wrapperCardNft)}>
                                    <div className={styles.card}>
                                        <div className={clsx(styles.cardImg, marketplaceStyle.cardImg)}>
                                            <Image src={infoNFT.image} />
                                        </div>
                                        <div className={marketplaceStyle.carBodyInfo}>
                                            <div className={marketplaceStyle.cardBodyHeader}>
                                                <h3 className="text-uppercase">
                                                    {infoNFT.title || infoNFT.name}
                                                </h3>
                                                <div className={marketplaceStyle.boxesBodyHeader}>
                                                    <div className="box box-icon" style={{ alignItems: 'center' }}>
                                                        {infoNFT.project?.logo && <img src={infoNFT.project?.logo} className="icon rounded" alt="" />}
                                                        <div className="text">
                                                            <span className="text-uppercase">
                                                                {infoNFT.project?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* <div className="text-uppercase box box-icon">
                                         <img src={infoNFT.token_images} className="icon rounded" alt="" />
                                         <div className="text">
                                             <span className="text-uppercase">
                                                 OWNER
                                             </span>
                                             XYZXYZXYZ
                                         </div>
                                     </div>
                                     <div className="text-uppercase interactions box">
                                         <div className="item">
                                             <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                 <path d="M4.7782 8.74697C4.83696 8.8076 4.91696 8.84128 5.00072 8.84128C5.08447 8.84128 5.16447 8.8076 5.22323 8.74697L9.22096 4.6543C10.8881 2.94794 9.70349 0 7.33252 0C5.90868 0 5.25531 1.05716 5.00072 1.25462C4.74487 1.05632 4.09566 0 2.66891 0C0.30544 0 -0.893797 2.94036 0.780885 4.6543L4.7782 8.74697Z" fill="#7D7D7D" />
                                             </svg>
                                             <span>{200}</span>
                                         </div>
                                         <div className="item">
                                             <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                 <path d="M7 0.827148C4.32515 0.827148 1.89946 2.29058 0.109543 4.66759C-0.0365143 4.86233 -0.0365143 5.1344 0.109543 5.32914C1.89946 7.70901 4.32515 9.17245 7 9.17245C9.67485 9.17245 12.1005 7.70901 13.8905 5.332C14.0365 5.13726 14.0365 4.8652 13.8905 4.67045C12.1005 2.29058 9.67485 0.827148 7 0.827148ZM7.19188 7.93812C5.41628 8.04981 3.94998 6.58638 4.06168 4.80792C4.15332 3.34162 5.34182 2.15312 6.80812 2.06147C8.58372 1.94978 10.05 3.41322 9.93832 5.19168C9.84382 6.65511 8.65531 7.84361 7.19188 7.93812ZM7.1031 6.58065C6.14657 6.64079 5.35614 5.85323 5.41915 4.8967C5.46783 4.10627 6.10934 3.46763 6.89977 3.41608C7.8563 3.35594 8.64672 4.1435 8.58372 5.10003C8.53217 5.89332 7.89066 6.53196 7.1031 6.58065Z" fill="#7D7D7D" />
                                             </svg>
                                             <span>{4000}</span>
                                         </div>
                                     </div> */}
                                                </div>
                                            </div>
                                            <div className="divider"></div>
                                            <div className={marketplaceStyle.cardBodyDetail}>
                                                <div className="detail-items">
                                                    {/* <div className="item">
                                         <label htmlFor="" className="label text-uppercase">PRICE</label>
                                         <div className={marketplaceStyle.currency}>
                                             <img className="icon" src={`/images/icons/${(infoNFT.network_available || '').toLowerCase()}.png`} alt="" />
                                             <span className="text-uppercase">{infoNFT.token_conversion_rate} {getCurrencyByNetwork(infoNFT.network_available)}</span>
                                         </div>
                                     </div> */}
                                                    <div className="item">
                                                        <label htmlFor="" className="label text-uppercase">CONTRACT ADDRESS</label>
                                                        <div className="network">
                                                            {allowNetwork.icon && <img src={allowNetwork.icon} alt="" className="icon" />}
                                                            {allowNetwork.name && <span className="name"> {allowNetwork.name}: </span>}
                                                            <span className="address">{cvtAddressToStar(infoNFT.project?.token_address || '', '.', 10)}</span>
                                                            {
                                                                infoNFT.project?.token_address && <a href={`${getExplorerTransactionAddress({ appChainID, address: infoNFT.project?.token_address })}`} rel="noreferrer" target="_blank">
                                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M13.8424 3.67302L10.3071 0.155337C10.1543 0.00325498 9.92514 -0.041861 9.72652 0.0409337C9.52755 0.123537 9.39803 0.317727 9.39803 0.533053V2.12986C7.64542 2.24568 6.77025 2.97233 6.61213 3.11711C4.41287 4.94753 4.65609 7.44348 4.73 7.94006C4.73106 7.94717 4.73213 7.95444 4.73336 7.96155L4.80442 8.37017C4.84262 8.58976 5.013 8.76227 5.23188 8.80295C5.26455 8.809 5.29725 8.812 5.3296 8.812C5.51455 8.812 5.68919 8.7157 5.78653 8.55315L5.99953 8.19818C7.16391 6.26169 8.60278 5.9499 9.398 5.94722V7.60391C9.398 7.81975 9.52823 8.01413 9.72792 8.09655C9.9276 8.17879 10.157 8.13261 10.309 7.97982L13.8444 4.42665C14.0519 4.21807 14.051 3.88052 13.8424 3.67302ZM10.4642 6.3125V5.45422C10.4642 5.19252 10.2745 4.96957 10.0161 4.92801C9.40106 4.82905 7.46526 4.70984 5.79348 6.6609C5.90132 5.86462 6.25806 4.79441 7.30412 3.92829C7.31692 3.91763 7.32135 3.91407 7.33308 3.90234C7.3409 3.89507 8.13576 3.18016 9.8777 3.18016H9.931C10.2254 3.18016 10.464 2.94156 10.464 2.64719V1.81522L12.7128 4.05251L10.4642 6.3125Z" fill="#AEAEAE" />
                                                                        <path d="M11.9032 10.3399C11.6089 10.3399 11.3703 10.5785 11.3703 10.8729V12.383H1.06597V4.56594H4.26385C4.55822 4.56594 4.79682 4.32735 4.79682 4.03297C4.79682 3.7386 4.55822 3.5 4.26385 3.5H0.53297C0.238595 3.49997 0 3.73857 0 4.03294V12.916C0 13.2103 0.238595 13.4489 0.53297 13.4489H11.9032C12.1976 13.4489 12.4362 13.2103 12.4362 12.916V10.8729C12.4362 10.5785 12.1976 10.3399 11.9032 10.3399Z" fill="#AEAEAE" />
                                                                    </svg>
                                                                </a>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        !(new BigNumber(+addressOwnerOnSale || 0).isZero()) && <div className="item">
                                                            <label htmlFor="" className="label text-uppercase">Price</label>
                                                            <div className="text-white firs-neue-font">
                                                                {nftPrice}
                                                            </div>
                                                        </div>
                                                    }

                                                    <div className="item">
                                                        <label htmlFor="" className="label text-uppercase">TOKEN ID</label>
                                                        <div className="text-white firs-neue-font">
                                                            #{id}
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <label htmlFor="" className="label text-uppercase">Description</label>
                                                        <div className="text-white firs-neue-font">
                                                            <p>{infoNFT.project?.description}</p>
                                                        </div>
                                                    </div>
                                                    {/* <div className="item">
                                         <label className="label text-uppercase">TYPE</label>
                                         <div className="tags">
                                             {tagTypes.map(t => <span key={t}>{t}</span>)}
                                         </div>
                                     </div> */}
                                                    {/* <div className="item">
                                         <label className="label text-uppercase">Category</label>
                                         <div className="tags">
                                             {tagTypes.map(t => <span key={t}>{t}</span>)}
                                         </div>
                                     </div> */}
                                                </div>
                                            </div>
                                            <div className="divider"></div>
                                            <div className={marketplaceStyle.actions}>
                                                {
                                                    connectedAccount && infoNFT.success && <>
                                                        {
                                                            isOwnerNFT && <ButtonBase isLoading={checkFnIsLoading(onListingNFT.name)} disabled={lockingAction.lock} color="yellow" className="w-full" onClick={() => setOpenListingModal(true)}>
                                                                List
                                                            </ButtonBase>
                                                        }
                                                        {
                                                            isOwnerNFTOnSale && <ButtonBase isLoading={checkFnIsLoading(onDelistNFT.name)} disabled={lockingAction.lock} color="yellow" className="w-full" onClick={onDelistNFT}>
                                                                Delist
                                                            </ButtonBase>
                                                        }
                                                        {
                                                            isOwnerNFT && <ButtonBase isLoading={checkFnIsLoading(onTransferNFT.name)} disabled={lockingAction.lock} color="green" className="w-full" onClick={() => setOpenTransferModal(true)}>
                                                                Transfer
                                                            </ButtonBase>
                                                        }
                                                        {/* {
                                                            !isOwnerNFT && !isApprovedToken.ok && !isApprovedToken.loading && addressOwnerOnSale !== connectedAccount && !!+addressOwnerOnSale && !(new BigNumber(+addressOwnerOnSale).isZero()) &&
                                                            <ButtonBase isLoading={checkFnIsLoading(onOfferNFT.name)} disabled={lockingAction.lock} color="yellow" className="w-full"
                                                                onClick={onApproveToken}>
                                                                Approve
                                                            </ButtonBase>
                                                        } */}
                                                        {
                                                            !isOwnerNFT &&
                                                            //  isApprovedToken.ok && 
                                                            addressOwnerOnSale !== connectedAccount && !!+addressOwnerOnSale && !(new BigNumber(+addressOwnerOnSale).isZero()) &&
                                                            <ButtonBase isLoading={checkFnIsLoading(onOfferNFT.name)} disabled={lockingAction.lock} color="yellow" className="w-full" onClick={() => setOpenOfferModal(true)}>
                                                                Offer
                                                            </ButtonBase>
                                                        }
                                                        {
                                                            !isOwnerNFT && 
                                                            // isApprovedToken.ok && 
                                                            addressOwnerOnSale !== connectedAccount && !!+addressOwnerOnSale && !(new BigNumber(+addressOwnerOnSale).isZero()) &&
                                                            <ButtonBase isLoading={checkFnIsLoading(onBuyNFT.name)} disabled={lockingAction.lock} color="yellow" className="w-full" onClick={onBuyNFT}>
                                                                Buy
                                                            </ButtonBase>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.displayContent}>
                                <AboutMarketplaceNFT
                                    info={infoNFT}
                                    id={id}
                                    projectAddress={projectAddress}
                                    defaultTab={1}
                                    isOwnerNFTOnSale={isOwnerNFTOnSale}
                                    isOwnerNFT={isOwnerNFT}
                                    onAcceptOffer={onAcceptOffer}
                                    onRejectOffer={onRejectOffer}
                                    reloadOfferList={reloadOfferList}
                                />
                            </div>
                        </>
                }
            </div>
        </>
    );
}
export default MysteryBox;
