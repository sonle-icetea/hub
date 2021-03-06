import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    alertKyc: {
      paddingLeft: 0,
      paddingRight: 0,
      marginBottom: '10px',
      '& div': {
        borderRadius: '8px',
      }
    },
    bottomBoxHowTo: {
      marginTop: 100,
      position: 'relative',
      ...typeDisplayFlex,
      justifyContent: 'flex-end',
    },

    boxHowTo: {
      background: '#2dc000',
      boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.6)',
      borderRadius: 12,
      width: 280,
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      color: '#FFFFFF',
      position: 'fixed',
      bottom: 30,
      right: 30,
      zIndex: 999,
    },

    contentHowTo: {
      minHeight: 'calc(300px - 65px)',
    },

    titleBoxHowTo: {
      ...typeDisplayFlex,
      justifyContent: 'space-between',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 20,
      lineHeight: '24px',
      color: '#FFFFFF',
      cursor: 'pointer',
      height: 65,
      paddingLeft: 20,
      paddingRight: 20,
      alignItems: 'center',
    },

    iconHowTo: {
      width: 20,
      height: 20,
    },

    listHowTo: {
      padding: '0px 20px',
    },

    itemHowTo: {
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 14,
      ...typeDisplayFlex,
    },

    checkmark: {
      display: 'block',
      width: 20,
      height: 20,
      minWidth: 20,
      borderRadius: '50%',
      background: '#FFFFFF',
      marginRight: 8,
      position: 'relative',
    },

    activeItemHowTo: {
      textDecoration: 'line-through',
    },

    activeCheckmark: {
      background: '#40FBA1',

      '&:after': {
        position: 'absolute',
        content: '""',
        display: 'block',
        left: 6,
        top: 2,
        width: 5,
        height: 10,
        border: 'solid #000',
        borderWidth: '0 3px 3px 0',
        transform: 'rotate(45deg)',
        borderRadius: 3,
      }
    },

    textClickHowTo: {
      padding: '0px 20px',
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 15,

      '& a': {
        fontWeight: 700,
      }
    },

    poolDetailContainer: {
      padding: '40px 0 80px 0',
      width: '1120px',
      maxWidth: 'calc(100vw - 80px)',
      margin: 'auto',

      [theme.breakpoints.down('xs')]: {
        width: 'calc(100% - 36px)',
        maxWidth: 'calc(100% - 36px)',
        margin: '8px auto',
        paddingTop: 12,
      }
    },

    midPage: {
      display: 'grid',
      gridColumnGap: 12,
      gridTemplateColumns: '1fr 1fr',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '100%',
      }
    },
    // networkError: {
    //   font: 'normal normal normal 14px/24px Helvetica',
    //   color: '#fff',
    //   backgroundColor: '#5b0712fa',
    //   textAlign: 'center',
    //   height: '40px',
    //   position: 'relative',
    //   ...typeDisplayFlex,
    //   alignItems: 'center',
    //   justifyContent: 'center',

    //   '& img': {
    //     position: 'absolute',
    //     transform: 'translateY(-50%)',
    //     right: '10px',
    //     top: '50%'
    //   }
    // },
    poolDetailHeader: {
      paddingBottom: 20,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    poolHeaderWrapper: {
      ...typeDisplayFlex,
      alignItems: 'flex-start',
    },
    poolHeaderNetworkAvailable: {
      fontWeight: 400,
      marginLeft: 10,
      color: '#999999',
      fontSize: 14,
    },
    poolTicketWinner: {
      color: 'white',
      borderRadius: 4,
      padding: '13px 8px',
      backgroundColor: 'rgba(50, 50, 220, 0.2)',
      fontSize: 'normal normal bold 14px/18px DM Sans',
      ...typeDisplayFlex,
      alignItems: 'center',
      marginTop: 20,

      '& span': {
        [theme.breakpoints.down('xs')]: {
          textAlign: 'center',
          marginLeft: '0 !important' as any
        }
      },

      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'center'
      }
    },
    poolHeaderImage: {

    },
    poolImage: {
      width: 60,
      height: 60,
      borderRadius: '50%',
      objectFit: 'cover'
    },
    poolHeaderInfo: {
      color: 'white',
      marginLeft: 12,
    },
    poolHeaderTitle: {
      fontWeight: 700,
      fontSize: 28,
      ...typeDisplayFlex,
      alignItems: 'center',
      font: 'normal normal bold 28px/32px DM Sans',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontSize: 25,

        '& > div': {
          ...typeDisplayFlex,
          flexDirection: 'row',
          alignItems: 'center',
        },
      }
    },
    poolHeaderType: {
      display: 'inline-block',
      fontSize: 17,
      padding: '0 20px 0 6px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 20
    },
    poolHeaderTypeInner: {
      ...typeDisplayFlex,
      alignItems: 'center',
      font: 'normal normal normal 12px/28px Helvetica',
    },
    poolType: {
      ...typeDisplayFlex,
      alignItems: 'center',
      marginTop: 30
    },
    poolStatus: {
      fontSize: 14,
      marginLeft: 10,
      padding: '6px 20px',
      backgroundColor: 'blue',
      borderRadius: 40,
      color: 'white',
      fontWeight: 700,
      font: 'normal normal bold 12px/14px DM Sans',

      '&--In-progress': {
        backgroundColor: '#FFDE30'
      },
      '&--Whitelisting': {
        background: "#12A064"
      },
      '&--Upcoming': {
        background: "#72F34B"
      },
      '&--Ended': {
        backgroundColor: "#D01F36"
      },
      '&--Filled': {
        backgroundColor: "deeppink"
      },
      '&--Claimable': {
        backgroundColor: "#FF9330"
      },
      '&--TBA': {
        backgroundColor: "#9E63FF"
      }
    },
    poolHeaderAddress: {
      fontSize: 14,
      ...typeDisplayFlex,
      alignItems: 'center',
      marginTop: 8,
      lineHeight: "20px",
      font: 'normal normal normal 14px/24px Helvetica',
    },
    poolHeaderCopy: {
      marginLeft: 10,
      display: 'inline-block',
      cursor: 'pointer'
    },
    poolDetailInfo: {
      background: 'transparent',
    },
    poolDetailIntro: {
      color: 'white',
      minWidth: 400,
      width: '50%',
      marginRight: 120,
      [theme.breakpoints.down('xs')]: {
        marginRight: 0,
        minWidth: 'unset',
        width: '100%',
        marginBottom: '30px'
      }
    },
    poolDetailBasic: {
      display: 'grid',
      gridTemplateColumns: '1fr 4fr',

      '&:not(:first-child)': {
        marginTop: 30
      },

      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '1fr 2fr',
      },
    },
    poolDetailBasicIcon: {
      marginRight: 10,
      width: 20,
      height: 20
    },
    poolDetailBasicLabel: {
      color: '#999999',
      font: 'normal normal normal 14p/24px Helvetica'
    },
    poolsDetailBasicText: {
      color: 'white',
      ...typeDisplayFlex,
      alignItems: 'center',
      marginLeft: 50,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      font: 'normal normal bold 14px/18px DM Sans',

      '& span': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        display: 'inline-block'
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 15
      }
    },
    poolDetailUtil: {
      marginLeft: 10,
      display: 'inline-block',
      cursor: 'pointer',
      width: 18
    },
    poolDetailTierWrapper: {
      ...typeDisplayFlex,
      justifyContent: 'space-between',
      marginTop: 30,
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      }
    },
    poolDetailTier: {
      padding: '28px 40px',
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: 8,
      width: '50%',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      }
    },
    poolDetailMaxBuy: {
      marginTop: 15,
      color: '#999999',
      font: 'normal normal normal 12px/18px Helvetica'
    },
    poolDetailProgress: {
      color: 'white',
      marginTop: 32
    },
    poolDetailProgressTitle: {
      font: 'normal normal bold 14px/18px DM Sans'
    },
    poolDetailProgressStat: {
      ...typeDisplayFlex,
      justifyContent: 'space-between',
      margin: '12px 0px 5px 0px',
      color: '#999999',
      font: 'normal normal normal 12px/18px Helvetica'
    },
    poolDetailProgressPercent: {
      font: 'normal normal bold 16px/24px DM Sans',
      color: 'white'
    },
    progress: {
      width: '100%',
      height: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      position: 'relative'
    },
    achieved: {
      width: '30%',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      backgroundColor: '#232394',
      borderRadius: '0px 20px 20px 0px'
    },
    poolDetailStartTime: {
      marginTop: 28
    },
    poolDetailStartTimeTitle: {
      color: '#999999',
      fontWeight: 700,
      fontSize: 14
    },
    btnGroup: {
      marginTop: 40,

      '& button:first-child': {
        marginRight: 10
      },
      '& button': {
        font: 'normal normal bold 14px/18px DM Sans',
        height: '42px',
        padding: '0 50px'
      }
    },
    poolDetailBuy: {
      color: 'white'
    },
    poolDetailBuyNav: {
      marginTop: 100
    },
    poolDetailLink: {
      marginRight: 120,
      color: '#999999',
      cursor: 'pointer',
      paddingBottom: 12,
      position: 'relative',
      font: 'normal normal bold 14px/18px DM Sans'
    },
    poolDetailLinkActive: {
      color: '#72F34B',
      '&::before': {
        content: '""',
        position: 'absolute',
        height: 3,
        left: 0,
        backgroundColor: '#72F34B',
        bottom: 0,
        width: '100%',
        borderRadius: 20
      }
    },
    poolDetailLinks: {
      ...typeDisplayFlex,
      borderBottom: '1px solid rgba(255, 255, 255, .1)'
    },
    poolDetailBuyForm: {
      ...typeDisplayFlex,
      justifyContent: 'space-between',
      alignItems: 'flex-start',

      [theme.breakpoints.down('md')]: {
        flexDirection: 'column'
      },
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column'
      }
    },

    poolWhitelistGuide: {
      color: 'white',
      borderRadius: 4,
      padding: '13px 15px',
      backgroundColor: 'rgba(50, 50, 220, 0.2)',
      fontSize: 'normal normal bold 14px/18px DM Sans',
      // ...typeDisplayFlex,
      display: 'block',
      alignItems: 'center',
      marginTop: 20,

      '& span': {
        [theme.breakpoints.down('xs')]: {
          textAlign: 'center',
          marginLeft: '0 !important' as any
        }
      },

      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'center'
      }
    },
    poolWhiteListLineSmall: {
      paddingBottom: 5,
    },
    poolWhiteListLine: {
      paddingTop: 7,
      paddingBottom: 7,
    },

    loader: {
      ...typeDisplayFlex,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loaderText: {
      fontWeight: 700,
      marginTop: 20,
      color: "#999999",
      font: 'normal normal bold 14px/18px DM Sans'
    },

    headerComponent: {
      color: '#FFFFFF',
      marginBottom: 16,
      ...typeDisplayFlex,
      flexDirection: 'column',
      alignItems: 'center',
    },

    [theme.breakpoints.down('xs')]: {
      poolDetailTier: {
        padding: '20px',
        width: '100%',
      },
      poolHeaderAddress: {
        fontSize: 14,
        ...typeDisplayFlex,
        alignItems: 'center',
        marginTop: 8
      },
      poolDetailProgressPercent: {

      }
    },
    [theme.breakpoints.down('md')]: {
      poolDetailTierWrapper: {
        flexDirection: 'column',
      },
      poolDetailIntro: {
        width: '100%',
        marginRight: '0'
      },
      poolDetailTier: {
        width: '100%',
        marginRight: '0',
        marginTop: '30px'
      }
    },
    [theme.breakpoints.down('sm')]: {
      PoolAboutDesc: {
        width: '100%'
      }
    },
    [theme.breakpoints.down('xs')]: {
      poolDetailLink: {
        marginRight: '20px',
      },
      poolDetailTier: {
        width: '100%',
        padding: '10px'
      },
      btnGroup: {
        ...typeDisplayFlex,
        justifyContent: 'center',
        '& button': {
          padding: '15px 25px',
          width: '140px'
        }
      },
      poolHeaderType: {
        marginLeft: '0'
      },
      poolHeaderWrapper: {
        alignItems: 'flex-start'
      },
      poolStatus: {
        paddingRight: '10px',
        paddingLeft: '10px',
        marginLeft: '8px'
      },
      poolsDetailBasicText: {
        justifyContent: 'flex-start',
        marginLeft: 0,
        textAlign: 'left'
      },
      poolHeaderInfo: {
        width: '100%'
      },
    },

    boxBottom: {
      background: '#303035',
      borderRadius: 12,
      padding: '28px 28px',
      marginBottom: 12,
      color: '#FFFFFF',
      fontFamily: 'DM Sans',

      [theme?.breakpoints?.down('sm')]: {
        padding: '28px 20px',
      },
    },

    navBottom: {
      color: '#ffffff',
      ...typeDisplayFlex,
      marginBottom: 22,

      '& li': {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: '24px',
        textTransform: 'uppercase',
        marginRight: 40,
        color: '#AEAEAE',

        '&:last-child': {
          marginRight: 0,
        },
      },

      '&.multilTabBottom': {
        borderBottom: '1px solid rgb(255 255 255 / 10%)',

        '& li': {
          cursor: 'pointer',
          paddingBottom: 7,
          marginBottom: -2,

          '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '100%',
            height: 3,
            borderRadius: 20,
            background: 'transparent',
          },

          '&.active': {
            color: '#72F34B',
            position: 'relative',

            '&:after': {
              background: '#72F34B',
            }
          }
        },
      }
    },

    activeTabBottom: {

    },

    hiddenTabWinner: {
      display: 'none',

      '&.show': {
        display: 'block',
      }
    }
  };
});

export default useStyles;
