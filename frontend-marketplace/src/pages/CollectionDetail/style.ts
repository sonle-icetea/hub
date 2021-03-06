import { makeStyles } from "@material-ui/core";
import { typeDisplayFlex } from "../../styles/CommonStyle";

const useStyles = makeStyles((theme: any) => {
  return {
    backgroundLayout: {
      background: "url(/images/bg-1140x1161.png)",
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
    content: {
      // display: 'grid',
      // gap: '45px',
      // paddingTop: '35px',
      // alignItems: 'center',
      // position: 'relative',
      // paddingLeft: 'calc(100% - (461px * 2))',
      // paddingRight: 'calc(100% - (461px * 2))'

    },
    contentCard: {
      width: '100%',
      display: 'grid',
      placeContent: 'center'
    },
    contentCardNft: {
      width: '100%',
    },
    wrapperCardNft: {
      margin: 'auto',
      background: 'radial-gradient(82.49% 167.56% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%)',
      border: '1px solid #686868',
      backdropFilter: 'blur(10px)',
      borderRadius: '4px',
    },
    wrapperCard: {
      maxWidth: '1020px',
      width: '100%',
      marginTop: '40px',
      marginBottom: '40px',
      padding: '28px',
    },
    displayContent: {
      // paddingLeft: "calc((100% - (461px * 2 + 40px)) / 2)",
      // paddingRight: "calc((100% - (461px * 2 + 40px)) / 2)",
      maxWidth: '1120px',
      margin: 'auto',
    },
    alert: {
      marginTop: "12px",
      background: "#591425",
      borderRadius: "2px",
      padding: "10px 40px",
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      textAlign: "center",
      color: " #fff",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "22px",
      "& a": {
        "&.link": {
          textDecoration: "underline",
          fontFamily: "inherit",
          fontStyle: "inherit",
          color: "inherit",
        },
        "&.kyc-link": {
          fontFamily: "inherit",
          fontStyle: "inherit",
          color: "inherit",
          fontWeight: "bold",
        },
      },
    },
    card: {
      // marginTop: "35px",
      marginBottom: "32px",
      display: "grid",
      gridTemplateColumns: "522px minmax(350px, 1fr)",
      // placeContent: "center",
      gap: "30px",
      [theme.breakpoints.down("sm")]: {
        placeItems: "center",
        gap: "20px",
        gridTemplateColumns: "1fr",
      },
      [theme.breakpoints.down("xs")]: {
        // gridTemplateColumns: "300px",
        // marginTop: "28px",
      },
    },
    cardImg: {
      "& img": {
        width: "100%",
        maxHeight: "376px",
        height: "100%",
        objectFit: "contain",
      },
    },
    cardBody: {
      // paddingTop: '30px',
      ...typeDisplayFlex,
      flexDirection: "column",
      justifyContent: "space-between",
      width: "461px",
      gap: "20px",
      [theme.breakpoints.down("md")]: {
        // width: '461px',
      },
      [theme.breakpoints.down("xs")]: {
        width: "303px",
      },
    },
    cardBodyText: {
      display: "grid",
      placeContent: "center",
      placeItems: "center",
      gridTemplateColumns: '1fr',
      "& h4, & h3": {
        margin: 0,
        padding: 0,
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        textAlign: "center",
        mixBlendMode: "normal",
        width: '100%'
      },

      "& h3": {
        paddingLeft: '24px',
        fontWeight: "bold",
        fontSize: "28px",
        lineHeight: "36px",
        color: " #FFFFFF",
        position: 'relative',
        '& img': {
          position: 'absolute', top: '5px', left: 0, width: '24px', height: '24px'
        }
        // marginBottom: '4px',
      },
      "& h4": {
        fontWeight: "600",
        fontSize: "16px",
        lineHeight: "28px",
        color: " #FFFFFF",
        marginBottom: "16px",
        "& span": {
          fontWeight: "normal",
          fontSize: "12px",
          lineHeight: "16px",
        },
      },

      "& button": {
        border: "1px solid #72F34B",
        boxSizing: "border-box",
        borderRadius: "4px",
        background: "transparent",
        padding: "10px",
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        textAlign: "center",
        color: " #72F34B",
        fontWeight: "600",
        fontSize: "20px",
        lineHeight: "28px",
        ...typeDisplayFlex,
        alignItems: "center",
        justifyContent: "center",
        minWidth: "190px",
        cursor: "pointer",

        "&.openBuy": {
          width: "fit-content",
          fontSize: "16px",
          lineHeight: "28px",
          padding: "4px 25px",

          "& .small-text": {
            fontSize: "12px",
            lineHeight: "16px",
          },
        },

        "& img": {
          marginRight: "8px",
        },
        "& .small-text": {
          color: "#D1D1D1",
          fontWeight: "normal",
          fontSize: "14px",
          lineHeight: "22px",
        },
      },
    },
    cardBodyDetail: {},
    cardBodyClock: {
      "& h5": {
        margin: 0,
        padding: 0,
        marginBottom: "8px",
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        textAlign: "center",
        color: "#FFFFFF",
        fontWeight: "normal",
        fontSize: "12px",
        lineHeight: "16px",
        mixBlendMode: "normal",
        textTransform: "uppercase",
        ...typeDisplayFlex,
        justifyContent: "center",

        "& .open": {
          display: "block",
          maxWidth: "8px",
          maxHeight: "8px",
          borderRadius: "50%",
          marginLeft: "11px",
          marginTop: "1px",
          position: "relative",
          width: "fit-content",
          height: "fit-content",

          // '&:before': {
          //   position: 'absolute',
          //   content: '""',
          //   width: '8px',
          //   height: '8px',
          //   filter: 'blur(5px)',
          //   background: '#72F34B',
          //   left: '-1.4px',
          //   top: '-1.3px'
          // }
        },
      },
      "& .times": {
        ...typeDisplayFlex,
        justifyContent: "space-around",
        gap: "12px",
        background: "#2E2E2E",
        borderRadius: "4px",

        "& .dot": {
          display: "block",
          marginTop: "8px",
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "20px",
          lineHeight: "28px",
          color: "#fff",
        },

        "& .time": {
          // display: 'grid',
          // gap: '1px',
          display: "block",
          textAlign: "center",
          width: "60px",
          paddingTop: "6px",
          paddingBottom: "6px",

          "& .number, & .text": {
            fontStyle: "normal",
            mixBlendMode: "normal",
            display: "block",
          },
          "& .number": {
            color: "#fff",
            fontWeight: "600",
            fontSize: "24px",
            lineHeight: "36px",
            fontFamily: "Firs Neue",
          },
          "& .text": {
            color: "#D1D1D1",
            fontWeight: "600",
            fontSize: "8px",
            lineHeight: "12px",
            fontFamily: "Hanken Grotesk",
            textTransform: "uppercase",
          },
        },
      },
    },

    cardBodyProgress: {
      display: "grid",
      gap: "4px",
      [theme.breakpoints.down("xs")]: {
        display: "block",
      },
    },
    progressItem: {
      display: "grid",
      gap: "10px",

      "& .total .amount": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        color: " #aeaeae",
        fontWeight: "normal",
        fontSize: "16px",
        lineHeight: "24px",
        mixBlendMode: "normal",
      },
    },
    text: {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      color: " #fff",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "16px",
      mixBlendMode: "normal",
      textTransform: "uppercase",
    },
    textBold: {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      color: " #fff",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "28px",
      mixBlendMode: "normal",
    },
    infoTicket: {
      ...typeDisplayFlex,
      justifyContent: "space-between",
      [theme.breakpoints.down("xs")]: {
        marginTop: "5px",
      },
    },
    buyBox: {
      [theme.breakpoints.down("xs")]: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "5px",
      },
    },
    timeEnd: {
      display: "block",
      padding: "3px 8px",
      borderRadius: "4px",
      background: "#2E2E2E",
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      color: " #fff",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "28px",
      mixBlendMode: "normal",
    },
    amountBuy: {
      [theme.breakpoints.down("xs")]: {
        display: "grid",
        " grid-template-columns": "40px auto",
        "place-content": "space-between",
      },

      "& > span": {
        textTransform: "uppercase",
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        color: " #aeaeae",
        fontWeight: "normal",
        fontSize: "12px",
        lineHeight: "16px",
        mixBlendMode: "normal",
        marginBottom: "6px",
        display: "block",
      },
      "& > div": {
        ...typeDisplayFlex,
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        color: " #ffffff",
        fontWeight: 600,
        fontSize: "12px",
        lineHeight: "20px",
        mixBlendMode: "normal",
        "& span": {
          display: "grid",
          placeContent: "center",
          padding: "5px 12px",
          border: "1px solid #2E2E2E",
          cursor: "pointer",
        },
        "& span:nth-child(3)": {
          padding: "5px 14px",
          fontSize: "16px",
        },
        "& > span input": {
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          color: " #ffffff",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "28px",
          background: "transparent",
          border: "none",
          borderBottom: "1px solid #3a3a3a",
          borderRadius: "unset",
          width: "44px",
          height: "26px",
          padding: "8px 4px",
          textAlign: "center",
        },
      },
    },
    btnMinMax: {
      background: "#72F34B",
      color: "#000",
      textTransform: "uppercase",

      "&.max": {
        borderRadius: "0px 2px 2px 0px",
      },
      "&.min": {
        borderRadius: "2px 0px  0px 2px",
      },

      "&.disabled": {
        background: "#498631 !important",
        cursor: "not-allowed !important",
      },
    },
    disabledAct: {
      cursor: "not-allowed !important",
      color: "#565555",
    },
    buyDisabled: {
      background: "#498631 !important",
    },
    btnClaim: {
      outline: 'none',
      border: 'none',
      background: '#F3E24B !important',
      borderRadius: '2px',
      color: '#000',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '28px',
      textAlign: 'center',
      padding: '13px 20px',
      textTransform: 'uppercase',
      minWidth: '200px',
      cursor: 'pointer',
      height: '52px',
      marginTop: '16px',
      '&.disabled': {
        opacity: '.5'
      }
    },
    buynow: {
      outline: "none",
      border: "none",
      background: "#72f348",
      borderRadius: "2px",
      color: "#000",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "28px",
      textAlign: "center",
      padding: "13px 20px",
      textTransform: "uppercase",
      minWidth: "200px",
      cursor: "pointer",
      height: "52px",
    },
    btnApprove: {
      outline: "none",
      border: "none",
      background: "#0070a7",
      borderRadius: "2px",
      color: "#fff",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "28px",
      textAlign: "center",
      padding: "13px 20px",
      textTransform: "uppercase",
      minWidth: "200px",
      cursor: "pointer",
      display: 'grid',
      placeContent: 'center',
    },
    finished: {
      alignItems: "center",
      marginTop: "30px",
    },
    comingSoon: {
      width: "100%",
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: "36px",
      textAlign: "center",
      background: "#2E2E2E",
      color: "#FFFFFF",
      padding: "10px",
      borderRadius: "4px",
    },
    alertMsg: {
      width: "100%",
      marginTop: "14px",
      "& img": {
        width: "14px",
        height: "14px",
        marginRight: "8px",
      },
      "& span": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "12px",
        lineHeight: "16px",
        textAlign: "left",
        color: "#F24B4B",
      },
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
    bannerBox: {
      width: '100%',
      maxHeight: '550px',
      minHeight: '180px',
      '& img': {
        width: '100%',
        height: '100%',
        minHeight: '180px',
        maxHeight: '550px',
      }
    },
    priceBidBox: {
      marginTop: '22px',
      width: '100%',
      border: '1px solid #72F34B',
      boxSizing: 'border-box',
      borderRadius: '4px',
      padding: '9px 20px',

      '& > span': {
        display: 'block',
        marginBottom: '4px',
      },
      '& > div': {
        display: 'grid',
        gridTemplateColumns: '18px auto',
        gridGap: '8px',
        alignItems: 'center',
        '& img': {
          width: '18px',
          height: '18px',
        },
        '& span': {
          fontSize: '20px',
        }
      }
    }
  };
});

export default useStyles;

export const useAboutStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: '32px',
    paddingRight: '32px',
    // backgroundColor: "#171717",
    // background: 'radial-gradient(82.49% 167.56% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%)',
    // backdropFilter: 'blur(80px)',
  },
  tabName: {
    fontFamily: "Firs Neue !important",
    fontWeight: 600,
    fontStyle: "normal !important",
    fontSize: "16px !important",
    lineHeight: "28px !important",
    // color: "#72F34B",
    mixBlendMode: "normal",
    textTransform: "unset",
    justifyContent: "space-between",
    '&.active': {
      color: "#72F34B !important"
    },
    [theme.breakpoints.down("xs")]: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
    },
  },
  appbar: {
    background: "transparent !important",
    boxShadow: "none",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "24px",
      paddingRight: "24px",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  tabPaneContent: {
    fontFamily: "Firs Neue",
    fontWeight: "normal",
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#d1d1d1",
    mixBlendMode: "normal",
  },
  desc: {
    marginBottom: "20px",
  },
  links: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  link: {
    display: "grid",
    gridTemplateColumns: "80px auto",
    gap: "2px",
    alignItems: "center",

    "& .text": {
      fontFamily: "Firs Neue",
      fontWeight: "normal",
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "22px",
      color: "#fff",
      mixBlendMode: "normal",
    },
  },
  weblink: {
    "& a": {
      background: "#2E2E2E",
      borderRadius: "4px",
      padding: "4px 8px",
      fontFamily: "Firs Neue",
      fontWeight: "normal",
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "22px",
      color: "#fff",
      mixBlendMode: "normal",
      display: "inline-flex",
      gap: "7px",
    },
  },
  wrapperBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 190px)',
    gridAutoRows: 'minmax(max-content, 1fr)',
    placeContent: 'center',
    gap: '12px',
    '& .box': {
      cursor: 'pointer',
      transition: '0.3s',
      '& .img-box': {
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '10px',
        marginBottom: '4px',
        borderRadius: '2px',
        position: 'relative',
        zIndex: '100',
        '&::before': {
          content: '""',
          filter: 'blur(15px)',
          position: 'absolute',
          background: '#283145',
          width: 'calc(100% - 20px)',
          height: '80px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%'
        },
        // 
        '& img': {
          width: '100%',
          height: '100px',
          position: 'relative',
        }
      },
      '& .id-box': {
        fontFamily: "Firs Neue",
        fontWeight: 600,
        fontStyle: "normal",
        fontSize: "14px",
        lineHeight: "22px",
        color: "#fff",
        mixBlendMode: "normal",
        display: 'block',
        textAlign: 'left',
      }
    },
    '& .box.active, & .box:hover': {
      '& .img-box': {
        border: '1px solid #72F34B',
      }

    }
  },
  informationTab: {
    '& p': {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '22px',
      color: ' #fff',
      marginBottom: '20px',
    },
    '& .item': {
      display: 'grid',
      gridTemplateColumns: '140px auto',
      gap: '8px',
      marginBottom: '16px',
      alignItems: 'center',

      '& label, & > div': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        color: ' #fff',
      },
      '& label': {
        textTransform: 'uppercase',
      },
      '& > div': {
        fontSize: '14px',
        lineHeight: '22px',

      },
      '& .network': {
        ...typeDisplayFlex,
        alignItems: 'center',
        padding: '6px 10px',
        background: '#373737',
        borderRadius: '4px',
        width: '100%',

        '& .name, & .address, & a': {
          lineHeight: 'unset',
          display: 'block',
          fontSize: '14px',
          marginTop: '3px'
        },

        '& .name': {
          marginRight: '6px',
          color: '#AEAEAE',
        },
        '& .address': {
          marginRight: '8px',
          lineBreak: 'anywhere'
        },

        '& img': {
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          marginRight: '6px',
        }
      }
    }
  },
  tableCellOffer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    '& h4': {
      fontWeight: 600,
      fontSize: '16px',
      '&.flex': {
        ...typeDisplayFlex,
        // alignItems: 'center',
        justifyContent: 'flex-end',
        '& img': {
          width: '18px',
          height: '18px',
          marginRight: '8px',
          marginTop: '3px'
        }
      },
      '& span': {
        fontWeight: 'normal',
      }
    },
    '& h5': {
      fontWeight: 'normal',
    }
  },
  btn: {
    // height: 'unset !important',
    // padding: '6px 16px !important',
    fontSize: '14px !important',
    marginTop: 'unset',
    fontFamily: 'Firs Neue',
    minWidth: '100px !important',
    height: '32px !important',
    padding: 'unset !important',
  },
  activities: {
    marginTop:'24px',
    marginBottom:'24px',
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 45%))',
    '& .item': {
      display: 'grid',
      
      gridTemplateColumns: 'minmax(200px, 50%) auto',
      gap: '20px',
      '& label': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        textTransform: 'uppercase',
        lineHeight: '24px'
      },
      '& span': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        wordBreak: 'break-all'
      }
    }
  }
}));

export const useMarketplaceStyle = makeStyles((theme) => ({
  cardBodyHeader: {
    marginBottom: '16px',
    '& h3': {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '36px',
      lineHeight: '32px',
      color: '#fff',
      marginBottom: '24px',
    },
    '& h4': {
      display: 'grid',
      gridTemplateColumns: '20px auto',
      gap: '8px',
      alignItems: 'center',
      '& .icon': {
        width: '20px',
        height: '20px',
      },
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      color: '#fff',
    },
  },
  carBodyInfo: {
    width: '100%',
    display: 'grid',
    alignItems: 'center'
  },
  cardBodyDetail: {
    marginTop: '14px',
    marginBottom: '14px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    '& .detail-items': {
      display: 'grid',
      gap: '24px',
      gridTemplateColumns: '1fr',

      '& .wrapper-contract-info': {
        background:'#1d1d1d',
        '& .item': {
          '&:first-child': {
            marginBottom: '12px'
          },
          '& .label': {
            marginBottom:'2px',
          }
        }
      },

      '& .item': {
        '& .label': {
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '14px',
          color: '#AEAEAE',
          marginBottom: '5px',
          display: 'block',
          '&.contract': {
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '6px !important',
            '& span': {
              display: 'block',
              borderRadius: '2px',
              background: '#5A5B5B',
              padding: '5px 10px',
              fontSize: '14px',
              fontFamily: 'Helvetica',
              fontWeight: 'normal',
            }
          }
        },
        '& div.address a': {
          fontFamily: 'Helvetica',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#fff',
          lineBreak: 'anywhere',
          '&:hover': {
            textDecoration: 'underline'
          }
        },
        '& span': {
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '16px',
          color: '#fff',
          display: 'block',
        },
        '& span.icon': {
          display: 'grid',
          gap: '5px',
          gridTemplateColumns: '16px auto',
          '& .icon': {
            width: '16px',
            height: '16px',
          }
        },
        '& .tags': {
          ...typeDisplayFlex,
          flexWrap: 'wrap',
          gap: '6px',
          '& span': {
            display: 'block',
            padding: '2px 8px',
            fontFamily: 'Firs Neue',
            fontSize: '14px',
            lineHeight: '24px',
            fontStyle: 'normal',
            fontWeight: 'normal',
            color: '#FFFFFF',
            background: '#2E2E2E',
            borderRadius: '4px',
          }
        },
        '& .network': {
          ...typeDisplayFlex,
          // alignItems: 'center',
          padding: '6px 10px',
          background: '#373737',
          borderRadius: '4px',
          width: '100%',
          justifyContent: 'center',
          [theme.breakpoints.down('sm')]: {
            width: 'fit-content'
          },
          '& .name, & .address, & a': {
            lineHeight: 'unset',
            display: 'block',
            fontSize: '14px',
            marginTop: '3px'
          },

          '& .name': {
            marginRight: '6px',
            color: '#AEAEAE',
          },
          '& .address': {
            marginRight: '8px',
            lineBreak: 'anywhere'
          },

          '& img': {
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            marginRight: '6px',
          }
        },
        '&.price': {
          '& label': {
            fontWeight: 'bold',
            fontSize: '16px',
            textTransform: 'unset',
            marginBottom: '13px',
          },
          '& div': {
            fontSize: '36px',
            display: 'grid',
            gridTemplateColumns: '32px auto',
            gap: '12px',
            alignItems: 'center',
            '& img': {
              width: '32px',
              height: '32px',
            }
          }
        }
      }
    },
  },
  countdown: {
    ...typeDisplayFlex,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '14px',
    marginBottom: '14px',
    '& > .title': {
      ...typeDisplayFlex,
      alignItems: 'center',
      color: '#fff',
      fontSize: '12px',
      fontFamily: 'Firs Neue',
      fontWeight: 'normal',

      '& img': {
        marginLeft: '5px',
      }
    },

    '& .countdown': {
      background: 'transparent !important',
      fontFamily: 'Space Ranger',
      '& .time .number': {
        transform: 'skew(-30deg)',
        fontSize: '26px'
      }
    }

  },
  actions: {
    ...typeDisplayFlex,
    marginTop: '38px',
    gap: '12px',
    [theme.breakpoints.down('xs')]: {
      gap: '4px',
      flexWrap: 'wrap',
    },
    '& button': {
      textTransform: 'unset',
    }
  },
  currency: {
    display: 'grid',
    gridTemplateColumns: '24px auto',
    gap: '8px',
    alignItems: 'center',
    '& .icon': {
      width: '24px',
      height: '24px',
    },
    '& span': {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '20px',
      color: '#fff',
      display: 'block',
    }
  },
  cardImg: {
    width: '100%',
    background: '#000',
    display: 'grid',
    alignItems: 'center',
    height: '522px',
    [theme.breakpoints.down('sm')]: {
      height: '375px',
    },
    '& .wrapperVideo': {
      position: 'relative',
      height: '379px',
      '& .uncontrol': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'block',
        background: 'transparent',
      },
      '& .onload': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        display: 'block',
        background: '#000',

        '& > span': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      },
      '& .video': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        display: 'block',
        background: '#000',
      },

      '& video': {
        width: '100%',
        height: '100%',
        zIndex: 100,
      }
    },
  },
  wrapperAmount: {
    ...typeDisplayFlex,
    justifyContent: 'space-between',

    [theme.breakpoints.down('xs')]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
    },

    '& .bought': {
      marginTop: '20px',
      [theme.breakpoints.down('xs')]: {
        ...typeDisplayFlex,
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      '& h4': {
        color: '#aeaeae',
        display: 'block',
        fontSize: '12px',
        fontStyle: 'normal',
        fontFamily: 'Firs Neue',
        fontWeight: 'normal',
        lineHeight: '16px',
        marginBottom: '6px',
      }
    }
  },
  boxesBodyHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    '&.grid-2fr': {
      gridTemplateColumns: '1fr 1fr',
    },
    gap: '6px',
    '& .box-icon': {
      display: 'grid',
      gap: '12px',
      gridTemplateColumns: '46px auto',
      '& img.icon': {
        width: '46px',
        height: '46px',
      },
      '& .text': {
        // textTransform: 'uppercase',
        color: '#fff',
        fontSize: '14px',
        // fontFamily: 'Firs Neue',
        fontWeight: 'normal',
        '& span': {
          display: 'block',
          // color: '#AEAEAE',
          // fontSize: '12px',
          // lineHeight: '16px',
        },
        // '& .collection': {
        //   marginBottom: '6px'
        // }
      }
    },
    '& .interactions': {
      ...typeDisplayFlex,
      alignItems: 'center',
      gap: '8px',
      '& .item': {
        '& svg': {
          marginRight: '6px',
        },
        '& span': {
          fontFamily: 'Firs Neue',
          fontSize: '12px',
          lineHeight: '14px',
          fontStyle: 'normal',
          fontWeight: 'normal',
          color: '#FFFFFF',
        }
      }
    }
  }
}));