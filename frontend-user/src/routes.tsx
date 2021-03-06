import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Switch, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core';
import useProviderConnect from './components/Base/HeaderDefaultLayout/hooks/useProviderConnect';
import { settingAppNetwork, NetworkUpdateType } from './store/actions/appNetwork';
import { AppContext } from './AppContext';

import { clearAlert } from './store/actions/alert'
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/Base/ErrorBoundary';

import BuyToken from './pages/BuyToken';
import Dashboard from './pages/Dashboard';
import AppContainer from "./AppContainer";
import AccountV2 from "./pages/AccountV2";
import Pools from "./pages/Pools";

//@ts-ignore
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css';
import { adminRoute, publicRoute } from "./utils";
import Ticket from './pages/Ticket';
import Home from './pages/Home';
import TicketSale from './pages/TicketSale';
import StakingPools from './pages/StakingPools';
import MaintainPage from './pages/MaintainPage';
import MysteryBoxes from './pages/MysteryBoxes';

/**
 * Main App routes.
 */
const Routes: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
    const dispatch = useDispatch();
    const alert = useSelector((state: any) => state.alert);
    const alertTypeIsPush = useSelector((state: any) => state.alertTypeIsPush);
    const { history } = props;

    useEffect(() => {
        history.listen((location) => {
            const { gtag } = window as any;
            if (gtag && location) {
                gtag('event', 'page_view', {
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: location.pathname,
                    send_to: process.env.REACT_APP_GTAG_ID
                })
            }
        })
    }, [history])
    const { deactivate } = useWeb3React();
    const [binanceAvailable, setBinanceAvailable] = useState(false);
    const [openConnectWallet, setOpenConnectWallet] = useState<boolean>(false);
    const [currentConnectedWallet, setCurrentConnectedWallet] = useState<any>(undefined);

    const logout = () => {
        deactivate();
        dispatch(settingAppNetwork(NetworkUpdateType.Wallet, undefined));
        setCurrentConnectedWallet(undefined);
        handleConnectorDisconnect();
    }

    const {
        handleProviderChosen,
        connectWalletLoading,
        currentConnector,
        walletName,
        setWalletName,
        loginError,
        appNetworkLoading,
        handleConnectorDisconnect,
    } = useProviderConnect(
        setOpenConnectWallet,
        openConnectWallet,
        binanceAvailable
    );

    useEffect(() => {
        document.onreadystatechange = function () {
            if (document.readyState == "complete") {
                setBinanceAvailable(true);
            }
        }
    }, []);

    useEffect(() => {
        const { type, message } = alert;
        if (!alertTypeIsPush.success && type === 'success') return;
        if (!alertTypeIsPush.warn && type === 'warning') return;
        if (!alertTypeIsPush.failed && type === 'error') return;
        if (message) {
            NotificationManager[type](message);
        }
    }, [alert, alertTypeIsPush]);

    useEffect(() => {
        history.listen((location, action) => {
            dispatch(clearAlert());
        });
    }, []);

    return (
        <AppContext.Provider
            value={{
                binanceAvailable,
                handleProviderChosen,
                connectWalletLoading,
                walletName,
                setWalletName,
                loginError,
                appNetworkLoading,
                handleConnectorDisconnect,
                currentConnector,
                logout,
                setCurrentConnectedWallet,
                openConnectWallet,
                setOpenConnectWallet,
                currentConnectedWallet
            }}
        >
            <div>
                <Switch>
                    {/* <Route
            exact path="/"
            render={() => <Redirect to={`${'/home'}`} />}
          /> */}
                    <Route exact path={'/staking-pools'} component={StakingPools} />
                    <Route exact path={'/buy-nft/:id'} component={Ticket} />
                    <Route exact path={'/mystery-box/:id'} component={Ticket} />
                    <Route exact path={`${'/dashboard'}`} component={Dashboard} />
                    <Route path={`${'/buy-token/:id'}`} component={BuyToken} />
                    <Route path={'/account'} component={AccountV2} />
                    <Route exact path={'/pools'} component={Pools} />
                    <Route exact path={'/pools/:type'} component={TicketSale} />
                    <Route exact path={'/mystery-boxes'} component={MysteryBoxes} />
                    <Route exact path={'/'} component={Home} />
                    <Route exact path={'/maintain'} component={MaintainPage} />
                    <Route component={NotFoundPage} />
                </Switch>
            </div>
        </AppContext.Provider>
    )
};

const RoutesHistory = withRouter(Routes);

const routing = function createRouting() {
    return (
        <>
            <NotificationContainer />
            <Router>
                <AppContainer>
                    <ErrorBoundary>
                        <RoutesHistory />
                    </ErrorBoundary>
                </AppContainer>
            </Router>
        </>
    );
};
/**
 * Wrap the app routes into router
 *
 * PROPS
 * =============================================================================
 * @returns {React.Node}
 */
export default routing;
