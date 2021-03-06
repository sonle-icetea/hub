import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import MuiLink from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Pagination from '@material-ui/lab/Pagination';
import {
    TableCell,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRowBody,
    TableRowHead
} from '@base-components/Table';
import { cvtAddressToStar, formatHumanReadableTime } from "@utils/index";
import { numberWithCommas } from "@utils/formatNumber";
import { useAboutStyles } from "../style";
import clsx from 'clsx';
import { TimelineType } from "../types";
import ModalSeriesContent from "./ModalSeriesContent";
import { BulletListIcon, GridIcon } from '@base-components/Icon'
import { ObjectType } from "@app-types";
import { utils } from "ethers";
import { getSymbolCurrency } from "@utils/getAccountBalance";
import { getNetworkInfo } from "@utils/network";
import { Tab, AntTabs, a11yProps, AppBar, TabPanel } from './TabPanel'

const shareIcon = "/images/icons/share.svg";
const telegramIcon = "/images/icons/telegram-1.svg";
const twitterIcon = "/images/icons/twitter-1.svg";
const mediumIcon = "/images/icons/medium-1.svg";

type Props = {
    [k: string]: any
}

export const AboutAuctionBox = ({
    info = {},
    token,
    timelines = {} as { [k: number]: TimelineType },
    ownedBox = 0,
    collections = [],
    loadingCollection,
    handleRefreshCollection,
    boxTypeSelected = {},
    contractAuctionPool,
    ...props }: Props) => {
    const classes = useAboutStyles();
    const [tabCurrent, setTab] = React.useState(props.defaultTab || 0);
    const theme = useTheme();
    const matchSM = useMediaQuery(theme.breakpoints.down("sm"));
    const matchXS = useMediaQuery(theme.breakpoints.down("xs"));

    const handleChange = (event: any, newValue: any) => {
        setTab(newValue);
    };

    const getRules = (rule = "") => {
        if (typeof rule !== "string") return [];
        return rule.split("\n").filter((r) => r.trim());
    };

    const [currentSerie, setCurrentSerie] = useState<{ [k: string]: any }>({});

    const [openModalSerieContent, setOpenModalSerieContent] = useState(false);

    const onSelectSerie = (serie: { [k: string]: any }) => {
        setCurrentSerie(serie);
        setOpenModalSerieContent(true);
    }

    const onCloseModalSerie = useCallback(() => {
        setOpenModalSerieContent(false);
    }, []);

    const seriesContentConfig = (info.seriesContentConfig || []);
    const firstSerie = seriesContentConfig[0];
    const isShowRateSerie = firstSerie && +firstSerie.rate > 0;
    const isShowAmountSerie = firstSerie && +firstSerie.amount > 0;
    const listIndex = useMemo(() => {
        if (boxTypeSelected?.description) {
            return {
                ruleIntroduce: 0,
                boxInformation: 1,
                seriesContent: 2,
                bidHistory: 3,
            }
        }
        return {
            ruleIntroduce: 0,
            seriesContent: 1,
            bidHistory: 2,

        }
    }, [boxTypeSelected?.description])

    const showTypes = { table: 'table', grid: 'grid' };
    const [showTypeSerieContent, setShowTypeSerieContent] = useState<typeof showTypes[keyof typeof showTypes]>(showTypes.table);
    const onSelectShowSerieContent = (type: typeof showTypes[keyof typeof showTypes]) => {
        setShowTypeSerieContent(type);
    }

    const [filterBidHistory, setFilterBidHistory] = useState({ from: 0, limit: 10 })
    const [bidHistores, setBidHistories] = useState<ObjectType<any>[]>([]);
    const [cachedSymbolCurrency, setCachedSymbolCurrency] = useState<ObjectType<string>>({});

    useEffect(() => {
        if (!contractAuctionPool) return;
        const getListBidHistories = async () => {
            try {
                const result = await contractAuctionPool.methods.bidHistory(filterBidHistory.from, filterBidHistory.limit).call();
                console.log('result', result)
                const leng = result[0].length;
                const arr: ObjectType<any>[] = [];
                const keys = ['address', 'currency', 'amount', 'created_at'];
                for (let i = leng - 1; i >= 0; i--) {
                    const obj: ObjectType<any> = {};
                    for (const prop in result) {
                        obj[keys[prop as unknown as number]] = result[prop][i];
                        if (+prop === 1) {
                            if (!cachedSymbolCurrency[obj.currency]) {
                                const networkInfo = getNetworkInfo(info.network_available);
                                try {
                                    const symbol = await getSymbolCurrency(obj.currency, { appChainId: networkInfo.id });
                                    obj.symbol = symbol;
                                    setCachedSymbolCurrency(s => ({ ...s, [obj.currency]: symbol }));
                                    console.log('symbol', symbol);
                                } catch (error) {
                                }
                            } else {
                                obj.symbol = cachedSymbolCurrency[obj.currency];
                            }
                            console.log(result[prop][i])
                            console.log('prop', 1)
                        }
                    }
                    arr.push(obj);
                }
                setBidHistories(arr);
                console.log('result', arr)
            } catch (error) {
                console.log('re', error);
            }
        }
        getListBidHistories();
    }, [contractAuctionPool, filterBidHistory])

    return (
        <div className={classes.root}>
            <AppBar className={classes.appbar} position="static">
                <AntTabs
                    centered={matchXS ? undefined : matchSM ? true : false}
                    value={tabCurrent}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    variant={matchXS ? "scrollable" : matchSM ? "fullWidth" : "standard"}
                    scrollButtons={matchXS ? "auto" : undefined}
                >
                    <Tab
                        className={clsx(classes.tabName, { active: tabCurrent === listIndex.ruleIntroduce })}
                        label="Rule Introduction"
                        {...a11yProps(0)}
                    />
                    {
                        boxTypeSelected?.description && <Tab
                            className={clsx(classes.tabName, { active: tabCurrent === listIndex.boxInformation })}
                            label="Box Information"
                            {...a11yProps(1)}
                        />
                    }
                    <Tab
                        className={clsx(classes.tabName, { active: tabCurrent === listIndex.seriesContent })}
                        label="Series Content"
                        {...a11yProps(2)}
                    />
                    <Tab
                        className={clsx(classes.tabName, { active: tabCurrent === listIndex.bidHistory })}
                        label={"Bid History"}
                        {...a11yProps(listIndex.bidHistory)}
                    />
                </AntTabs>
            </AppBar>
            <TabPanel value={tabCurrent} index={listIndex.ruleIntroduce}>
                <ul className={classes.tabPaneContent}>
                    {getRules(info.rule).map((rule, idx) => (
                        <li key={idx}>
                            {idx + 1}. {rule}
                        </li>
                    ))}
                </ul>
                <div className={classes.ruleFooter}>
                    <div className="item-group">
                        <label className="text-white" htmlFor="">Website</label>
                        <div>
                            <a href="" className="gf-link text-white">
                                gamefi.org
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8424 3.67302L10.3071 0.155337C10.1543 0.00325498 9.92514 -0.041861 9.72652 0.0409337C9.52755 0.123537 9.39803 0.317727 9.39803 0.533053V2.12986C7.64542 2.24568 6.77025 2.97233 6.61213 3.11711C4.41287 4.94753 4.65609 7.44348 4.73 7.94006C4.73106 7.94717 4.73213 7.95444 4.73336 7.96155L4.80442 8.37017C4.84262 8.58976 5.013 8.76227 5.23188 8.80295C5.26455 8.809 5.29725 8.812 5.3296 8.812C5.51455 8.812 5.68919 8.7157 5.78653 8.55315L5.99953 8.19818C7.16391 6.26169 8.60278 5.9499 9.398 5.94722V7.60391C9.398 7.81975 9.52823 8.01413 9.72792 8.09655C9.9276 8.17879 10.157 8.13261 10.309 7.97982L13.8444 4.42665C14.0519 4.21807 14.051 3.88052 13.8424 3.67302ZM10.4642 6.3125V5.45422C10.4642 5.19252 10.2745 4.96957 10.0161 4.92801C9.40106 4.82905 7.46526 4.70984 5.79348 6.6609C5.90132 5.86462 6.25806 4.79441 7.30412 3.92829C7.31692 3.91763 7.32135 3.91407 7.33308 3.90234C7.3409 3.89507 8.13576 3.18016 9.8777 3.18016H9.931C10.2254 3.18016 10.464 2.94156 10.464 2.64719V1.81522L12.7128 4.05251L10.4642 6.3125Z" fill="#6CDB00" />
                                    <path d="M11.9032 10.3399C11.6089 10.3399 11.3703 10.5785 11.3703 10.8729V12.383H1.06597V4.56594H4.26385C4.55822 4.56594 4.79682 4.32735 4.79682 4.03297C4.79682 3.7386 4.55822 3.5 4.26385 3.5H0.53297C0.238595 3.49997 0 3.73857 0 4.03294V12.916C0 13.2103 0.238595 13.4489 0.53297 13.4489H11.9032C12.1976 13.4489 12.4362 13.2103 12.4362 12.916V10.8729C12.4362 10.5785 12.1976 10.3399 11.9032 10.3399Z" fill="#6CDB00" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="item-group">
                        <label className="text-white" htmlFor="">Social</label>
                        <div>
                            <a href="">
                                <img src="/images/icons/telegram-1.svg" alt="" />
                            </a>
                            <a href=""><img src="/images/icons/twitter-1.svg" alt="" /></a>
                            <a href=""><img src="/images/icons/medium-1.svg" alt="" /></a>
                        </div>
                    </div>
                    <a href="" className="full-research text-green-imp">
                        Full Research
                        <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="path-1-inside-1_1201_9307" fill="white">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.1147 0.200811C0.859705 -0.0669364 0.446277 -0.0669373 0.191283 0.200811C-0.0637118 0.468558 -0.0637113 0.902662 0.191283 1.17041L3.42281 4.56355L0.191246 7.95672C-0.0637486 8.22447 -0.0637486 8.65857 0.191246 8.92632C0.446241 9.19407 0.859668 9.19407 1.11466 8.92632L4.78775 5.06953C4.79473 5.06281 4.8016 5.0559 4.80837 5.0488C4.94373 4.90666 5.00724 4.71764 4.99888 4.53152C4.99168 4.36674 4.92816 4.20416 4.80833 4.07833C4.80187 4.07156 4.79532 4.06495 4.78867 4.05852L1.1147 0.200811ZM5.1147 0.200811C4.85971 -0.0669364 4.44628 -0.0669373 4.19128 0.200811C3.93629 0.468558 3.93629 0.902662 4.19128 1.17041L7.42281 4.56355L4.19125 7.95672C3.93625 8.22447 3.93625 8.65857 4.19125 8.92632C4.44624 9.19407 4.85967 9.19407 5.11466 8.92632L8.78775 5.06953C8.79473 5.06281 8.8016 5.0559 8.80837 5.0488C8.94373 4.90666 9.00724 4.71764 8.99888 4.53152C8.99168 4.36674 8.92816 4.20416 8.80833 4.07833C8.80187 4.07156 8.79532 4.06495 8.78867 4.05852L5.1147 0.200811Z" />
                            </mask>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.1147 0.200811C0.859705 -0.0669364 0.446277 -0.0669373 0.191283 0.200811C-0.0637118 0.468558 -0.0637113 0.902662 0.191283 1.17041L3.42281 4.56355L0.191246 7.95672C-0.0637486 8.22447 -0.0637486 8.65857 0.191246 8.92632C0.446241 9.19407 0.859668 9.19407 1.11466 8.92632L4.78775 5.06953C4.79473 5.06281 4.8016 5.0559 4.80837 5.0488C4.94373 4.90666 5.00724 4.71764 4.99888 4.53152C4.99168 4.36674 4.92816 4.20416 4.80833 4.07833C4.80187 4.07156 4.79532 4.06495 4.78867 4.05852L1.1147 0.200811ZM5.1147 0.200811C4.85971 -0.0669364 4.44628 -0.0669373 4.19128 0.200811C3.93629 0.468558 3.93629 0.902662 4.19128 1.17041L7.42281 4.56355L4.19125 7.95672C3.93625 8.22447 3.93625 8.65857 4.19125 8.92632C4.44624 9.19407 4.85967 9.19407 5.11466 8.92632L8.78775 5.06953C8.79473 5.06281 8.8016 5.0559 8.80837 5.0488C8.94373 4.90666 9.00724 4.71764 8.99888 4.53152C8.99168 4.36674 8.92816 4.20416 8.80833 4.07833C8.80187 4.07156 8.79532 4.06495 8.78867 4.05852L5.1147 0.200811Z" fill="#6CDB00" />
                            <path d="M0.191283 0.200811L1.09646 1.06288L1.09646 1.06287L0.191283 0.200811ZM1.1147 0.200811L2.01988 -0.661254L2.01988 -0.661254L1.1147 0.200811ZM0.191283 1.17041L-0.713894 2.03247L0.191283 1.17041ZM3.42281 4.56355L4.32799 5.42561L5.14899 4.56355L4.32799 3.70148L3.42281 4.56355ZM0.191246 7.95672L1.09642 8.81879L0.191246 7.95672ZM0.191246 8.92632L-0.713933 9.78838L-0.71393 9.78839L0.191246 8.92632ZM1.11466 8.92632L2.01984 9.78838H2.01984L1.11466 8.92632ZM4.78775 5.06953L3.92051 4.16932L3.90113 4.18799L3.88258 4.20747L4.78775 5.06953ZM4.80837 5.0488L3.90319 4.18673L3.90316 4.18676L4.80837 5.0488ZM4.99888 4.53152L3.75007 4.58608L3.75014 4.58758L4.99888 4.53152ZM4.80833 4.07833L3.90314 4.94039L3.90315 4.9404L4.80833 4.07833ZM4.78867 4.05852L3.88349 4.92058L3.90119 4.93916L3.91963 4.957L4.78867 4.05852ZM4.19128 0.200811L5.09646 1.06288L5.09646 1.06287L4.19128 0.200811ZM5.1147 0.200811L6.01988 -0.661254V-0.661254L5.1147 0.200811ZM4.19128 1.17041L3.28611 2.03247L4.19128 1.17041ZM7.42281 4.56355L8.32798 5.42561L9.14899 4.56355L8.32798 3.70148L7.42281 4.56355ZM4.19125 7.95672L3.28607 7.09466L3.28607 7.09466L4.19125 7.95672ZM4.19125 8.92632L3.28607 9.78838L3.28607 9.78839L4.19125 8.92632ZM5.11466 8.92632L4.20949 8.06425L4.20948 8.06426L5.11466 8.92632ZM8.78775 5.06953L7.92051 4.16932L7.90113 4.18799L7.88258 4.20747L8.78775 5.06953ZM8.80837 5.0488L7.90319 4.18674L7.90316 4.18676L8.80837 5.0488ZM8.99888 4.53152L7.75007 4.58608L7.75014 4.58758L8.99888 4.53152ZM8.80833 4.07833L9.71351 3.21627L9.71345 3.21621L8.80833 4.07833ZM8.78867 4.05852L7.88349 4.92058L7.9012 4.93918L7.91966 4.95703L8.78867 4.05852ZM1.09646 1.06287C0.858842 1.31238 0.447138 1.31237 0.209523 1.06287L2.01988 -0.661254C1.27227 -1.44625 0.0337131 -1.44625 -0.713895 -0.661252L1.09646 1.06287ZM1.09646 0.308344C1.30123 0.523354 1.30123 0.847864 1.09646 1.06288L-0.713893 -0.661254C-1.42865 0.0892511 -1.42865 1.28197 -0.713894 2.03247L1.09646 0.308344ZM4.32799 3.70148L1.09646 0.308344L-0.713894 2.03247L2.51763 5.42561L4.32799 3.70148ZM1.09642 8.81879L4.32799 5.42561L2.51763 3.70148L-0.713931 7.09466L1.09642 8.81879ZM1.09642 8.06426C1.30119 8.27927 1.30119 8.60378 1.09642 8.81879L-0.713931 7.09466C-1.42869 7.84516 -1.42869 9.03788 -0.713933 9.78838L1.09642 8.06426ZM0.209486 8.06425C0.447101 7.81476 0.858803 7.81475 1.09642 8.06425L-0.71393 9.78839C0.033678 10.5734 1.27224 10.5734 2.01984 9.78838L0.209486 8.06425ZM3.88258 4.20747L0.209485 8.06425L2.01984 9.78838L5.69293 5.9316L3.88258 4.20747ZM3.90316 4.18676C3.90877 4.18087 3.91456 4.17505 3.92051 4.16932L5.655 5.96975C5.67491 5.95057 5.69443 5.93093 5.71357 5.91084L3.90316 4.18676ZM3.75014 4.58758C3.74429 4.45721 3.78802 4.30766 3.90319 4.18673L5.71354 5.91086C6.09945 5.50566 6.27019 4.97807 6.24762 4.47545L3.75014 4.58758ZM3.90315 4.9404C3.80132 4.83347 3.7552 4.70331 3.75007 4.58608L6.24769 4.47695C6.22817 4.03016 6.05501 3.57485 5.7135 3.21627L3.90315 4.9404ZM3.91963 4.957C3.91398 4.95153 3.90848 4.94599 3.90314 4.94039L5.71351 3.21628C5.69527 3.19712 5.67666 3.17837 5.65771 3.16004L3.91963 4.957ZM0.209523 1.06287L3.88349 4.92058L5.69385 3.19646L2.01988 -0.661254L0.209523 1.06287ZM5.09646 1.06287C4.85884 1.31238 4.44714 1.31237 4.20952 1.06287L6.01988 -0.661254C5.27227 -1.44625 4.03371 -1.44625 3.2861 -0.661252L5.09646 1.06287ZM5.09646 0.308344C5.30123 0.523353 5.30123 0.847864 5.09646 1.06288L3.28611 -0.661255C2.57135 0.0892513 2.57135 1.28197 3.28611 2.03247L5.09646 0.308344ZM8.32798 3.70148L5.09646 0.308344L3.28611 2.03247L6.51763 5.42561L8.32798 3.70148ZM5.09642 8.81879L8.32798 5.42561L6.51763 3.70148L3.28607 7.09466L5.09642 8.81879ZM5.09642 8.06426C5.30119 8.27927 5.30119 8.60378 5.09642 8.81879L3.28607 7.09466C2.57131 7.84516 2.57131 9.03788 3.28607 9.78838L5.09642 8.06426ZM4.20948 8.06426C4.4471 7.81475 4.8588 7.81475 5.09642 8.06425L3.28607 9.78839C4.03368 10.5734 5.27224 10.5734 6.01984 9.78838L4.20948 8.06426ZM7.88258 4.20747L4.20949 8.06425L6.01984 9.78838L9.69293 5.9316L7.88258 4.20747ZM7.90316 4.18676C7.90877 4.18087 7.91456 4.17505 7.92051 4.16932L9.655 5.96975C9.67491 5.95057 9.69443 5.93093 9.71357 5.91084L7.90316 4.18676ZM7.75014 4.58758C7.74429 4.45721 7.78802 4.30766 7.90319 4.18674L9.71354 5.91086C10.0994 5.50566 10.2702 4.97808 10.2476 4.47545L7.75014 4.58758ZM7.90315 4.94039C7.80132 4.83347 7.7552 4.70331 7.75007 4.58608L10.2477 4.47695C10.2282 4.03016 10.055 3.57486 9.71351 3.21627L7.90315 4.94039ZM7.91966 4.95703C7.91397 4.95152 7.90848 4.94599 7.90321 4.94045L9.71345 3.21621C9.69527 3.19712 9.67668 3.17838 9.65768 3.16001L7.91966 4.95703ZM4.20952 1.06287L7.88349 4.92058L9.69385 3.19646L6.01988 -0.661254L4.20952 1.06287Z" fill="#6CDB00" mask="url(#path-1-inside-1_1201_9307)" />
                        </svg>
                    </a>
                </div>
            </TabPanel>
            {
                boxTypeSelected.description && <TabPanel value={tabCurrent} index={listIndex.boxInformation}>
                    <p style={{ fontSize: '14px', fontFamily: 'Firs Neue', color: '#d1d1d1' }}>
                        {boxTypeSelected.description}
                    </p>
                </TabPanel>
            }

            <TabPanel value={tabCurrent} index={listIndex.seriesContent}>
                <ModalSeriesContent
                    open={openModalSerieContent}
                    current={currentSerie}
                    seriesContent={info.seriesContentConfig || []}
                    onClose={onCloseModalSerie}
                    isShowRateSerie={isShowRateSerie}
                    isShowAmountSerie={isShowAmountSerie} />
                <Box display={"flex"} gridGap={20} alignItems={"center"}>
                    <span className="text-white font-firs-neue font-14px">View</span>
                    <BulletListIcon color={showTypeSerieContent === showTypes.table ? "#6CDB00" : "#6C6D71"} className="pointer" onClick={() => onSelectShowSerieContent(showTypes.table)} />
                    <GridIcon color={showTypeSerieContent === showTypes.grid ? "#6CDB00" : "#6C6D71"} className="pointer" onClick={() => onSelectShowSerieContent(showTypes.grid)} />
                </Box>
                {
                    showTypeSerieContent === showTypes.table &&
                    <TableContainer style={{ background: '#171717', marginTop: '32px' }}>
                        <Table>
                            <TableHead>
                                <TableRowHead>
                                    <TableCell width="80px" style={{ paddingLeft: '28px' }}>No</TableCell>
                                    <TableCell width="300px" style={{ padding: '7px' }} align="left">Name</TableCell>
                                    {isShowRateSerie && <TableCell align="left" style={{ padding: '7px' }}>Rare</TableCell>}
                                    {isShowAmountSerie && <TableCell align="left" style={{ padding: '7px' }}>Amount</TableCell>}
                                    {seriesContentConfig?.[0]?.description && <TableCell align="left" style={{ padding: '7px' }}>Description</TableCell>}
                                    <TableCell align="left" style={{ padding: '7px' }}>

                                    </TableCell>
                                </TableRowHead>
                            </TableHead>
                            <TableBody>
                                {seriesContentConfig.map((row: any, idx: number) => (
                                    <TableRowBody key={idx}>
                                        <TableCell width="80px" component="th" scope="row" style={{ paddingLeft: '28px' }}> {idx + 1} </TableCell>
                                        <TableCell align="left" style={{ padding: '7px', cursor: 'pointer' }} className="text-uppercase" onClick={() => onSelectSerie(row)}>
                                            <Box display="flex" alignItems="center" gridGap="20px" >
                                                <Box style={{ background: "#000", placeContent: 'center', borderRadius: '2px', cursor: 'pointer' }} display="grid">
                                                    <img src={row.icon} width='30' height="30" alt="" style={{ objectFit: 'contain' }} />
                                                </Box>
                                                <span className="text-weight-600">{row.name}</span>

                                            </Box>
                                        </TableCell>
                                        {isShowRateSerie && <TableCell align="left" style={{ padding: '7px' }}>{row.rate}%</TableCell>}
                                        {isShowAmountSerie && <TableCell align="left" style={{ padding: '7px' }}>{numberWithCommas(row.amount)}</TableCell>}
                                        {
                                            seriesContentConfig?.[0]?.description && <TableCell align="left" style={{ padding: '7px' }}>
                                                <div className={classes.tableCellDesc} style={{
                                                    wordWrap: 'break-word',
                                                    wordBreak: 'break-all',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}>
                                                    {row.description}
                                                </div>
                                                <MuiLink
                                                    className="text-green-imp pointer"
                                                    style={{
                                                        fontFamily: 'Poppins',
                                                        fontSize: '13px',
                                                        fontStyle: 'normal',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Read more
                                                </MuiLink>
                                            </TableCell>
                                        }
                                        <TableCell></TableCell>
                                    </TableRowBody>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
                {
                    showTypeSerieContent === showTypes.grid && <Box className={classes.serieGridView} marginTop={'32px'}>
                        {
                            [1, 2, 3, 4].map((d) => <div className="item" key={d}>
                                <div className="image">
                                    <img src="/images/mystery-boxes/robot1.jpg" alt="" />
                                    <div className="rarity">
                                        <div>
                                            <label htmlFor="">Rarity</label>
                                            <span className="green">27%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="info">
                                    <h4>Lorem ipsum dolor</h4>
                                    <h5>5,000 Units</h5>
                                </div>
                                <div className="desc">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy ...
                                </div>
                            </div>)
                        }
                    </Box>
                }
            </TabPanel>
            <TabPanel value={tabCurrent} index={listIndex.bidHistory}>
                <TableContainer style={{ background: '#171717', marginTop: '32px' }}>
                    <Table>
                        <TableHead>
                            <TableRowHead>
                                <TableCell width="80px" style={{ paddingLeft: '28px' }}>Address</TableCell>
                                <TableCell width="300px" style={{ padding: '7px' }} align="left">Price</TableCell>
                                <TableCell width="300px" style={{ padding: '7px' }} align="left">Date</TableCell>
                            </TableRowHead>
                        </TableHead>
                        <TableBody>
                            {bidHistores.map((row: any, idx: number) => (
                                <TableRowBody key={idx}>
                                    <TableCell>{cvtAddressToStar(row.address)}</TableCell>
                                    <TableCell>{row.symbol && <img src={`/images/icons/${row.symbol.toLowerCase()}.png`} width="24px" height="24px" />} {utils.formatEther(row.amount)} {row.symbol} </TableCell>
                                    <TableCell>
                                        {formatHumanReadableTime(+row.created_at * 1000, Date.now())}
                                    </TableCell>
                                </TableRowBody>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
        </div>
    );
}
