import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import useStyles, { useMarketplaceStyle } from "./style";
import { AboutMarketplaceNFT } from "./About";
import { apiRoute, cvtAddressToStar, formatNumber } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
    APP_NETWORKS_SUPPORT, ChainDefault,
} from "../../constants/network";
import useAuth from "../../hooks/useAuth";
import { HashLoader } from "react-spinners";
import { WrapperAlert } from "../../components/Base/WrapperAlert";
import { pushMessage } from "../../store/actions/message";
import Image from "../../components/Base/Image";
import _ from 'lodash';
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
import erc20ABI from '@abi/Erc20.json';
import marketplaceABI from '@abi/Marketplace.json';
import { utils } from 'ethers'
import OfferNFTModal from "./components/OfferNFTModal";
import DialogTxSubmitted from "@base-components/DialogTxSubmitted";
import CircularProgress from "@base-components/CircularProgress";
import { Backdrop, Box } from "@material-ui/core";
import { useTypedSelector } from "@hooks/useTypedSelector";
import useContract from "@hooks/useContract";
import useContractSigner from "@hooks/useContractSigner";
import { Link } from 'react-router-dom';
import { setProjectInfor as setProjectInforState } from '@store/actions/project-collection';
import { setTokenInfor } from "@store/actions/tokenInfor";
import { setCurrencyTokenAddress } from "@store/actions/currency";

const MARKETPLACE_SMART_CONTRACT = process.env.REACT_APP_MARKETPLACE_SMART_CONTRACT as string;

const MysteryBox = ({ id, project, ...props }: any) => {
    const styles = useStyles();
    const marketplaceStyle = useMarketplaceStyle();
    const dispatch = useDispatch();
    const { library, chainId } = useWeb3React();
    const { connectedAccount, wrongChain, } = useAuth();
    const { appChainID } = useSelector((state: any) => state.appNetwork).data;
    const [infoNFT, setInfoNFT] = useState<ObjectType<any>>({});
    const [addressOwnerNFT, setAddressOwnerNFT] = useState('');
    const [projectInfor, setProjectInfor] = useState<any>(null);
    const projectAddress = projectInfor?.token_address;
    const connectorName = useTypedSelector(state => state.connector).data;
    const { contract: erc721ContractWithSigner } = useContractSigner(erc721ABI, projectAddress, connectedAccount as string);
    const { contract: marketplaceContractWithSigner } = useContractSigner(marketplaceABI, MARKETPLACE_SMART_CONTRACT, connectedAccount as string);
    const [erc721Contract, setErc721Contract] = useState<any>(null);
    const [marketplaceContract, setMarketplaceContract] = useState<any>(null);
    useEffect(() => {
        setInfoNFT({ loading: true });
        axios.get(`/marketplace/collection/${project}`).then(async (res) => {
            const infoProject = res.data.data;
            if (!infoProject) {
                setInfoNFT({});
                return;
            }
            if (infoProject) {
                setProjectInfor(infoProject);
                dispatch(setProjectInforState(project, infoProject));
            }
        })
    }, [project]);

    const getInfoCollection = async () => {
        try {
            getAddresssOwnerNFT();
            if (+projectInfor.use_external_uri === 1) {
                const result = await axios.post(`/marketplace/collection/${projectAddress}/${id}`);
                dispatch(setTokenInfor(id, result))
                setInfoNFT({
                    ...(result.data.data || {}),
                    id: id,
                    project: projectInfor,
                    success: true,
                })
            } else {
                const tokenURI = await erc721Contract.methods.tokenURI(id).call();
                const infoBoxType = (await axios.get(tokenURI)).data || {};
                setInfoNFT({
                    ...infoBoxType,
                    id: id,
                    project: projectInfor,
                    success: true,
                })
            }
        } catch (error: any) {
            console.log('err', error)
            setInfoNFT({ error: true, project: projectInfor, });
        }
    }

    useEffect(() => {
        if (!projectInfor) {
            setErc721Contract(null);
            setMarketplaceContract(null);
            return;
        };
        const networkInfor = getNetworkInfo(projectInfor.network);
        const erc721Contract = getContractInstance(erc721ABI, projectAddress, undefined, networkInfor.id);
        const marketplaceContract = getContractInstance(marketplaceABI, MARKETPLACE_SMART_CONTRACT, undefined, networkInfor.id);
        erc721Contract && setErc721Contract(erc721Contract);
        marketplaceContract && setMarketplaceContract(marketplaceContract);
    }, [projectInfor]);

    useEffect(() => {
        if (projectInfor && erc721Contract) {
            getInfoCollection();
        }
    }, [projectInfor, erc721Contract])

    const getAddresssOwnerNFT = async () => {
        if (!erc721Contract) {
            return;
        }
        const addressOwnerNFT = await erc721Contract.methods.ownerOf(id).call();
        setAddressOwnerNFT(addressOwnerNFT);
    }

    const [addressOwnerOnSale, setAddressOwnerOnSale] = useState('');
    const [nftPrice, setNFTPrice] = useState('0');
    const [addressCurrencyToBuy, setAddressCurrency] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('');
    const getSymbolCurrency = async (currencyAddress: string, allowShowDefaultCurrency = true) => {
        if (new BigNumber(currencyAddress || 0).isZero() && allowShowDefaultCurrency) {
            return ChainDefault.currency as string;
        }
        const networkInfor = getNetworkInfo(projectInfor?.network);
        const erc20Contract = getContractInstance(erc20ABI, currencyAddress, connectorName, networkInfor.id);
        if (!erc20Contract) return;
        const symbol = await erc20Contract.methods.symbol().call();
        return symbol;
    }
    const getTokenOnSale = async () => {
        try {
            const tokenOnSale = await marketplaceContract.methods.tokensOnSale(projectAddress, id).call();
            setAddressOwnerOnSale(tokenOnSale.tokenOwner);
            const price = (+utils.formatEther(tokenOnSale.price) || '') + '';
            setNFTPrice(price)
            setAddressCurrency(tokenOnSale.currency);
            const symbol = await getSymbolCurrency(tokenOnSale.currency);
            setCurrencySymbol(symbol);
        } catch (error) {
            console.log('er', error)
        }
    }
    useEffect(() => {
        if (!MARKETPLACE_SMART_CONTRACT || !marketplaceContract) return;
        getTokenOnSale();
    }, [marketplaceContract])

    const [allowNetwork, setAllowNetwork] = useState<{ ok: boolean, [k: string]: any }>({ ok: false });
    useEffect(() => {
        if (!infoNFT.project?.network) return;
        const networkInfo = getNetworkInfo(infoNFT.project?.network);
        const ok = chainId == networkInfo.id;
        setAllowNetwork({ ok, ...networkInfo });
    }, [infoNFT, chainId]);

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
    const [reloadOfferList, setReloadOfferList] = useState(true);
    const [reloadedBalance, setReloadBalance] = useState(false);
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
        const result = await tx.wait(1);
        if(+result?.status !== 1) {
            dispatch(alertFailure("Request Failed"));
            return;
        }
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
            setTimeout(() => {
                setReloadOfferList(true);
            }, 2000)
            setReloadBalance(true);
        }
        if (action === onRejectOffer.name) {
            setTimeout(() => {
                setReloadOfferList(true);
            }, 2000)
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

    const [tokenSelected, setTokenSeleted] = useState<ObjectType<any>>({});
    useEffect(() => {
        if (infoNFT?.project?.accepted_tokens?.length) {
            setTokenSeleted(infoNFT.project.accepted_tokens[0]);
        }
    }, [infoNFT?.project?.accepted_tokens]);
    const onSelectToken = (token: ObjectType<any>) => {
        setTokenSeleted(token);
    }

    const onListingNFT = (price: number) => {
        handleCallContract(
            onListingNFT.name,
            () => marketplaceContractWithSigner.list(id, projectAddress, utils.parseEther(price + ''), tokenSelected.address)
        )
    }

    const onDelistNFT = () => {
        handleCallContract(
            onDelistNFT.name,
            () => marketplaceContractWithSigner.delist(id, projectAddress)
        )
    }

    const onTransferNFT = (receiverAddress: string) => {
        if (!erc721ContractWithSigner) return;
        handleCallContract(onTransferNFT.name, () => erc721ContractWithSigner.transferFrom(connectedAccount, receiverAddress, id))
    }

    const onOfferNFT = async (offerPrice: number, value: number) => {
        const options: ObjectType<any> = {}
        if (new BigNumber(addressCurrencyToBuy).isZero()) {
            options.value = utils.parseEther(value + '');
        }
        handleCallContract(onOfferNFT.name, () => marketplaceContractWithSigner.offer(id, projectAddress, utils.parseEther(offerPrice + ''), addressCurrencyToBuy, options))
    }
    const onBuyNFT = () => {
        const options: ObjectType<any> = {}
        if (new BigNumber(addressCurrencyToBuy).isZero()) {
            options.value = utils.parseEther(nftPrice + '');
        }
        handleCallContract(onBuyNFT.name, () => marketplaceContractWithSigner.buy(id, projectAddress, utils.parseEther(nftPrice + ''), addressCurrencyToBuy, options))
    }

    const onAcceptOffer = async (item: ObjectType<any>) => {
        handleCallContract(onAcceptOffer.name, () => marketplaceContractWithSigner.takeOffer(id, projectAddress, new BigNumber(item.raw_amount).toFixed(), addressCurrencyToBuy, item.buyer));
    }

    const onRejectOffer = async () => {
        handleCallContract(onRejectOffer.name, () => marketplaceContractWithSigner.cancelOffer(id, projectAddress));
    }

    const onApproveToMarketplace = () => {
        if (!erc721ContractWithSigner) return;
        handleCallContract(onApproveToMarketplace.name, () => erc721ContractWithSigner.setApprovalForAll(MARKETPLACE_SMART_CONTRACT, true))
    }

    const [isApprovedMarketplace, setApprovedMarketplace] = useState(false);
    const checkApproveMarketplace = async () => {
        try {
            if (!erc721ContractWithSigner) return;
            const isApproved = await erc721ContractWithSigner.isApprovedForAll(connectedAccount, MARKETPLACE_SMART_CONTRACT);
            setApprovedMarketplace(isApproved)
        } catch (error) {
            console.log('err', error)
        }
    }
    useEffect(() => {
        if (!library || !connectedAccount || !erc721ContractWithSigner || !allowNetwork.ok) return;
        checkApproveMarketplace();
    }, [projectAddress, library, connectedAccount, erc721ContractWithSigner, allowNetwork]);

    const isOwnerNFT = connectedAccount && connectedAccount === addressOwnerNFT;
    const isOwnerNFTOnSale = connectedAccount && addressOwnerOnSale === connectedAccount;

    const [isApprovedToken, setApprovedToken] = useState({ loading: false, ok: false });
    const { retrieveTokenAllowance } = useTokenAllowance();
    const { approveToken, response: responseApproveToken } = useTokenApprove({ address: addressCurrencyToBuy } as any, connectedAccount, MARKETPLACE_SMART_CONTRACT, false);

    const onApproveToken = () => {
        try {
            setLockingAction({ action: onApproveToken.name, lock: true });
            approveToken();
        } catch (error) {
            console.log('error', error);
        }
    }
    const checkApproveToken = async () => {
        try {
            setApprovedToken({ loading: true, ok: false });
            const allowance = await retrieveTokenAllowance({ address: addressCurrencyToBuy } as any, connectedAccount as string, MARKETPLACE_SMART_CONTRACT);
            setApprovedToken({ loading: false, ok: !new BigNumber(allowance || 0).isZero() });
        } catch (error) {
            console.log('err', error);
        }
    }
    useEffect(() => {
        if (responseApproveToken.txHash) {
            setOpenTxModal(true);
            setTxHash(responseApproveToken.txHash);
        }
    }, [responseApproveToken.txHash]);

    useEffect(() => {
        if (responseApproveToken.txHash && !responseApproveToken.loading) {
            checkApproveToken();
            setLockingAction({ lock: false, action: '' });
            return;
        }
        if (responseApproveToken.error) {
            setLockingAction({ lock: false, action: '' });
        }
    }, [responseApproveToken])


    useEffect(() => {
        if (isOwnerNFT || isOwnerNFTOnSale || !allowNetwork.ok) return;
        if (!addressCurrencyToBuy || !connectedAccount || !infoNFT?.project?.token_address) return;
        if (addressCurrencyToBuy && !new BigNumber(addressCurrencyToBuy).isZero() && connectedAccount) {
            checkApproveToken();
        } else {
            setApprovedToken({ loading: false, ok: true });
        }
    }, [addressCurrencyToBuy, connectedAccount, infoNFT?.project?.token_address, isOwnerNFT, isOwnerNFTOnSale, allowNetwork]);

    const [offerList, setOfferList] = useState<ObjectType<any>[]>([]);
    const currencies = useSelector((state: any) => state.currencies)?.data || {};
    useEffect(() => {
        // update pagination
        if (reloadOfferList && addressCurrencyToBuy && projectInfor) {
            axios.get(`/marketplace/offers/${project}/${id}?event_type=TokenOffered`).then(async (res) => {
                let offers = res.data?.data || [];
                const offerList: ObjectType<any>[] = [];
                await Promise.all(offers.map((item: any) => new Promise(async (res) => {
                    if (item.currency === addressCurrencyToBuy) {
                        if (!currencies[item.currency]) {
                            const symbol = await getSymbolCurrency(item.currency);
                            item.currencySymbol = symbol;
                            dispatch(setCurrencyTokenAddress(item.currency, symbol));
                        } else {
                            item.currencySymbol = currencies[item.currency];
                        }
                        offerList.push(item);
                    }
                    res('');
                })));
                setOfferList(offerList);
                setReloadOfferList(false)
            }).catch(err => {
                console.log('err', err)
                setReloadOfferList(false)
            })
        }
    }, [reloadOfferList, addressCurrencyToBuy, projectInfor]);

    const [lastOffer, setLastOffer] = useState<ObjectType<any> | null>(null);
    useEffect(() => {
        if (offerList.length && connectedAccount) {
            const myLastOffer = offerList.find(item => item.buyer === connectedAccount);
            setLastOffer(myLastOffer as any);
        }
    }, [offerList, connectedAccount])

    const currentOwnerNFT = useMemo(() => {
        if (new BigNumber(addressOwnerNFT).isZero() && new BigNumber(addressOwnerOnSale).isZero()) return '';
        if (!new BigNumber(addressOwnerNFT).isZero()) {
            return cvtAddressToStar(addressOwnerNFT, '.', 4);
        }
        if (!new BigNumber(addressOwnerOnSale).isZero()) {
            return cvtAddressToStar(addressOwnerOnSale, '.', 4);
        }
    }, [addressOwnerNFT, addressOwnerOnSale]);

    return (
        <>
            <div className={styles.content}>
                {/* {
                    !connectedAccount && <WrapperAlert>
                        Please connect to wallet
                    </WrapperAlert>
                } */}
                <DialogTxSubmitted open={openTxModal} onClose={() => setOpenTxModal(false)} transaction={txHash} />
                <TransferNFTModal open={openTransferModal} onClose={() => setOpenTransferModal(false)} onConfirm={onTransferNFT} isLoadingButton={lockingAction.lock} />
                <OfferNFTModal
                    currencySymbol={currencySymbol}
                    open={openOfferModal}
                    onClose={() => setOpenOfferModal(false)}
                    onConfirm={onOfferNFT}
                    isLoadingButton={lockingAction.lock}
                    addressCurrencyToBuy={addressCurrencyToBuy}
                    reloadedBalance={reloadedBalance}
                    setReloadBalance={setReloadBalance}
                    validChain={allowNetwork.ok}
                    isApprovedToken={isApprovedToken}
                    onApproveToken={onApproveToken}
                    lockingAction={lockingAction}
                    checkFnIsLoading={checkFnIsLoading}
                    lastOffer={lastOffer}
                />
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
                    addressCurrencyToBuy={addressCurrencyToBuy}
                    currencySymbol={currencySymbol}
                    validChain={allowNetwork.ok}
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
                                            <Box>
                                                <div className={marketplaceStyle.cardBodyHeader}>
                                                    <h3 className="">
                                                        {infoNFT.title || infoNFT.name || `#${formatNumber(id, 3)}`}
                                                    </h3>
                                                    <div className={clsx(marketplaceStyle.boxesBodyHeader, {
                                                        'grid-2fr': !!currentOwnerNFT
                                                    })}>
                                                        {
                                                            infoNFT.project?.slug && <Link to={`/collection/${infoNFT.project?.slug}`}>
                                                                <div className="box box-icon">

                                                                    {infoNFT.project?.logo && <img src={infoNFT.project?.logo} className="icon rounded" alt="" />}
                                                                    <div className="text">
                                                                        <span className="text-transform-unset font-14px collection text-grey helvetica-font">Collection</span>
                                                                        <span className="text-white-imp bold font-16px firs-neue-font">
                                                                            {infoNFT.project?.name}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        }
                                                        {
                                                            currentOwnerNFT && <div className="box box-icon">
                                                                <img src={'/images/guard.png'} className="icon rounded" alt="" />
                                                                <div className="text">
                                                                    <span className="text-transform-unset font-14px collection text-grey helvetica-font">Owner</span>
                                                                    <span className="text-white-imp bold font-16px firs-neue-font text-transform-unset">
                                                                        {currentOwnerNFT}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="divider"></div>
                                                <div className={marketplaceStyle.cardBodyDetail}>
                                                    <div className="detail-items">
                                                        {
                                                            !(new BigNumber(+addressOwnerOnSale || 0).isZero()) && <div className="item price">
                                                                <label htmlFor="" className="label bold text-white-imp">Listing price</label>
                                                                <div className="text-white firs-neue-font bold">
                                                                    {currencySymbol && <img src={`/images/icons/${currencySymbol.toLowerCase()}.png`} onError={(e: any) => {
                                                                        e.target.style.visibility = 'hidden'
                                                                    }} alt="" />}
                                                                    {nftPrice} {currencySymbol}
                                                                    {/* /Box */}
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className="pd-16px wrapper-contract-info">
                                                            <Box className="item" marginBottom="12px">
                                                                <label htmlFor="" className="label contract">
                                                                    Contract Address
                                                                    <span>
                                                                        {allowNetwork.name}
                                                                    </span>
                                                                </label>
                                                                <div className="address">
                                                                    {infoNFT.project?.token_address &&
                                                                        <a href={`${getExplorerTransactionAddress({ appChainID, address: infoNFT.project?.token_address })}`} rel="noreferrer" target="_blank">
                                                                            {cvtAddressToStar(infoNFT.project?.token_address || '', '.', 16)}
                                                                        </a>}
                                                                </div>
                                                                {/* <div className="network">
                                                                <div className="flex items-center height-fit">
                                                                    {allowNetwork.icon && <img src={allowNetwork.icon} alt="" className="icon" />}
                                                                    {allowNetwork.name && <span className="name"> {allowNetwork.name}: </span>}
                                                                </div>
                                                                <div className="flex items-center height-fit">
                                                                    <span className="address">
                                                                        {cvtAddressToStar(infoNFT.project?.token_address || '', '.', 13)}
                                                                    </span>
                                                                    {
                                                                        infoNFT.project?.token_address && <a href={`${getExplorerTransactionAddress({ appChainID, address: infoNFT.project?.token_address })}`} rel="noreferrer" target="_blank">
                                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M13.8424 3.67302L10.3071 0.155337C10.1543 0.00325498 9.92514 -0.041861 9.72652 0.0409337C9.52755 0.123537 9.39803 0.317727 9.39803 0.533053V2.12986C7.64542 2.24568 6.77025 2.97233 6.61213 3.11711C4.41287 4.94753 4.65609 7.44348 4.73 7.94006C4.73106 7.94717 4.73213 7.95444 4.73336 7.96155L4.80442 8.37017C4.84262 8.58976 5.013 8.76227 5.23188 8.80295C5.26455 8.809 5.29725 8.812 5.3296 8.812C5.51455 8.812 5.68919 8.7157 5.78653 8.55315L5.99953 8.19818C7.16391 6.26169 8.60278 5.9499 9.398 5.94722V7.60391C9.398 7.81975 9.52823 8.01413 9.72792 8.09655C9.9276 8.17879 10.157 8.13261 10.309 7.97982L13.8444 4.42665C14.0519 4.21807 14.051 3.88052 13.8424 3.67302ZM10.4642 6.3125V5.45422C10.4642 5.19252 10.2745 4.96957 10.0161 4.92801C9.40106 4.82905 7.46526 4.70984 5.79348 6.6609C5.90132 5.86462 6.25806 4.79441 7.30412 3.92829C7.31692 3.91763 7.32135 3.91407 7.33308 3.90234C7.3409 3.89507 8.13576 3.18016 9.8777 3.18016H9.931C10.2254 3.18016 10.464 2.94156 10.464 2.64719V1.81522L12.7128 4.05251L10.4642 6.3125Z" fill="#AEAEAE" />
                                                                                <path d="M11.9032 10.3399C11.6089 10.3399 11.3703 10.5785 11.3703 10.8729V12.383H1.06597V4.56594H4.26385C4.55822 4.56594 4.79682 4.32735 4.79682 4.03297C4.79682 3.7386 4.55822 3.5 4.26385 3.5H0.53297C0.238595 3.49997 0 3.73857 0 4.03294V12.916C0 13.2103 0.238595 13.4489 0.53297 13.4489H11.9032C12.1976 13.4489 12.4362 13.2103 12.4362 12.916V10.8729C12.4362 10.5785 12.1976 10.3399 11.9032 10.3399Z" fill="#AEAEAE" />
                                                                            </svg>
                                                                        </a>
                                                                    }
                                                                </div>
                                                            </div> */}
                                                            </Box>
                                                            <Box className="item">
                                                                <label htmlFor="" className="label">Token ID</label>
                                                                <div className="text-white firs-neue-font bold">
                                                                    #{formatNumber(id, 3)}
                                                                </div>
                                                            </Box>
                                                        </div>
                                                        {/* <div className="item">
                                                        <label htmlFor="" className="label text-uppercase">Description</label>
                                                        <div className="text-white firs-neue-font">
                                                            <p>{infoNFT.project?.description}</p>
                                                        </div>
                                                    </div> */}
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
                                                {/* <div className="divider"></div> */}
                                                <div className={marketplaceStyle.actions}>
                                                    {
                                                        connectedAccount && infoNFT.success && allowNetwork.ok && <>
                                                            {

                                                                isOwnerNFT && (!isApprovedMarketplace ?
                                                                    <ButtonBase color="yellow" onClick={onApproveToMarketplace} className="w-full text-transform-unset" isLoading={checkFnIsLoading(onApproveToMarketplace.name)} disabled={lockingAction.lock}>
                                                                        Approve to List
                                                                    </ButtonBase> :
                                                                    <ButtonBase isLoading={checkFnIsLoading(onListingNFT.name)} disabled={lockingAction.lock} color="yellow" className="w-full" onClick={() => setOpenListingModal(true)}>
                                                                        List
                                                                    </ButtonBase>
                                                                )
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
                                                                !isOwnerNFT && !isApprovedToken.ok && !isApprovedToken.loading && addressOwnerOnSale !== connectedAccount &&
                                                                !!+addressOwnerOnSale && !(new BigNumber(+addressOwnerOnSale).isZero()) &&
                                                                <ButtonBase isLoading={checkFnIsLoading(onApproveToken.name)} disabled={lockingAction.lock} color="yellow" className="w-full"
                                                                    onClick={onApproveToken}>
                                                                    Approve
                                                                </ButtonBase>
                                                            } */}
                                                            {
                                                                !isOwnerNFT &&
                                                                // isApprovedToken.ok &&
                                                                addressOwnerOnSale !== connectedAccount && !!+addressOwnerOnSale && !(new BigNumber(+addressOwnerOnSale).isZero()) &&
                                                                <ButtonBase isLoading={checkFnIsLoading(onOfferNFT.name)} disabled={lockingAction.lock} color="yellow" onClick={() => setOpenOfferModal(true)}>
                                                                    Make Offer
                                                                </ButtonBase>
                                                            }
                                                            {
                                                                !isOwnerNFT && !!+addressOwnerOnSale && !(new BigNumber(+addressOwnerOnSale).isZero()) && addressOwnerOnSale !== connectedAccount && (
                                                                    isApprovedToken.ok ?
                                                                        <ButtonBase
                                                                            disabled={lockingAction.lock}
                                                                            isLoading={checkFnIsLoading(onBuyNFT.name)}
                                                                            color="green"
                                                                            onClick={onBuyNFT}
                                                                        >
                                                                            Buy Now
                                                                        </ButtonBase> :
                                                                        !isApprovedToken.ok && !isApprovedToken.loading &&
                                                                        <ButtonBase
                                                                            disabled={lockingAction.lock}
                                                                            isLoading={checkFnIsLoading(onApproveToken.name)}
                                                                            color="green"
                                                                            onClick={onApproveToken}>
                                                                            Approve to Buy
                                                                        </ButtonBase>
                                                                )
                                                            }
                                                            {/* {
                                                                !isOwnerNFT &&
                                                                isApprovedToken.ok &&
                                                                addressOwnerOnSale !== connectedAccount && !!+addressOwnerOnSale && !(new BigNumber(+addressOwnerOnSale).isZero()) &&
                                                                <ButtonBase isLoading={checkFnIsLoading(onBuyNFT.name)} disabled={lockingAction.lock} color="green" className="w-full" onClick={onBuyNFT}>
                                                                    Buy Now
                                                                </ButtonBase>
                                                            } */}
                                                        </>
                                                    }
                                                </div>
                                            </Box>
                                        </div>

                                    </div>
                                    <div className={styles.displayContent}>
                                        <AboutMarketplaceNFT
                                            info={infoNFT}
                                            id={id}
                                            project={project}
                                            projectInfor={projectInfor}
                                            defaultTab={offerList?.length ? 1 : 0}
                                            isOwnerNFTOnSale={isOwnerNFTOnSale}
                                            isOwnerNFT={isOwnerNFT}
                                            onAcceptOffer={onAcceptOffer}
                                            onRejectOffer={onRejectOffer}
                                            checkFnIsLoading={checkFnIsLoading}
                                            lockingAction={lockingAction}
                                            reloadOfferList={reloadOfferList}
                                            setReloadOfferList={setReloadOfferList}
                                            getSymbolCurrency={getSymbolCurrency}
                                            addressCurrencyToBuy={addressCurrencyToBuy}
                                            validChain={allowNetwork.ok}
                                            offerList={offerList}
                                        />
                                    </div>
                                </div>
                            </div>

                        </>
                }
            </div>
        </>
    );
}
export default MysteryBox;
