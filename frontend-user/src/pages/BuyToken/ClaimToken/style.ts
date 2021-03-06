import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    poolDetailClaim: {
      background: '#303035',
      borderRadius: 12,
      padding: '28px 28px',
      marginBottom: 12,
      color: '#FFFFFF',
      fontFamily: 'DM Sans',
      border: '1px solid #72F34B',

      [theme?.breakpoints?.down('sm')]: {
        padding: '28px 20px',
      },

      '& button': {
        color: '#000',
        height: 42,
        padding: 5,
        fontSize: 16,
        fontFamily: 'DM Sans',
        fontWeight: 500,
        lineHeight: '24px',
        borderRadius: 2,
        width: 240,
        maxWidth: '100%',
        backgroundColor: '#72F34B',

        [theme.breakpoints.down('sm')]: {
          marginTop: '30px !important',
        },

        '&:disabled': {
          cursor: 'not-allowed',
          opacity: 0.6,
          backgroundColor: '#72F34B !important',
        }
      },

      [theme.breakpoints.down('sm')]: {
        padding: '36px 20px',

        '& #countdown': {
          marginTop: 30
        },

        '& ul': {
          textAlign: 'center',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        },

        '& button': {
          width: '100% !important',
          padding: '0 60px',
          height: '42px',
          font: 'normal normal bold 14px/18px DM Sans',
        }
      }
    },
    poolDetailClaimTitle: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 20,
      textTransform: 'uppercase',

      [theme?.breakpoints?.down('sm')]: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: '24px',
      },
    },

    poolDetailClaimInfo: {
      marginBottom: '80px',
    },

    poolDetailClaimInfoBlock: {
      display: 'grid',
      gridTemplateColumns: '140px 2fr',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFF',
      gridColumnGap: 12,

      [theme.breakpoints.down('sm')]: {
        ...typeDisplayFlex,
        flexWrap: 'wrap',
        wordBreak: 'break-word',
      },

      '& span:first-child': {
        fontFamily: 'DM Sans',
        fontWeight: 'bold',
        color: '#AEAEAE',
      },

      '&:not(:first-child)': {
        marginTop: 13,
      },

      '& .text-blue': {
        color: '#72F34B'
      }
    },

    progressClaim: {
      width: '100%',
      marginBottom: '50px',
      // height: '6px',
      background: '#303035',
      '&.adjust': {
        width: '95% !important',
        '& li:last-child .info': {
          right: '-60px',
        },
      },
      '& li': {
        display: 'inline-block',
        position: 'relative',
        height: '6px',
        background: '#1b1b1b',
        [theme.breakpoints.down('sm')]: {
          display: 'block',
        },
        '&.active': {
          background: '#72F34B',
          '& .info': {
            [theme.breakpoints.down('sm')]: {
              top: '-15px',
              left: '20px',
              textAlign: 'left',
            },
          }
        },
        '& .mark:before': {
          content: '""',
          width: '16px',
          height: '16px',
          left: 0,
          background: '#44454B',
          borderRadius: '50%',
          position: 'absolute',
        },
        '& .mark': {
          '&:hover + .claim-at': {
            display: 'block'
          },
          position: 'absolute',
          top: '-5px',
          left: '-3px',
          content: '""',
          [theme.breakpoints.down('sm')]: {
            top: '-14px',
            left: '-5px',
          },
          '& img': {
            position: 'relative',
          }

        },
        '&:first-child .info': {
          left: '0',
          textAlign: 'left',
          [theme.breakpoints.down('sm')]: {
            top: '-15px',
            left: '20px',
            textAlign: 'left',
          },
        },
        '&:last-child .info': {
          right: '-10px',
          left: 'unset',
          textAlign: 'right',
          [theme.breakpoints.down('sm')]: {
            top: '-15px',
            left: '20px',
            textAlign: 'left',
          },
        },
        '&:nth-child(even) .info': {
          top: '-40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          minHeight: '30px',
          [theme.breakpoints.down('sm')]: {
            top: '-12px',
            display: 'block',
          },
        },
        '& .info': {
          position: 'absolute',
          top: '15px',
          left: '-5px',
          fontSize: 10,
          // lineHeight: '18px',
          width: '140px',
          wordBreak: 'break-word',
          '&.isShowDetail': {
            left: '-30px',
            [theme.breakpoints.down('sm')]: {
              top: '-15px',
            },
          },
          // marginTop: 12,
          [theme.breakpoints.down('sm')]: {
            top: '-12px',
            left: '20px !important',
            textAlign: 'left',
          },
          '& .percent.active': {
            color: '#72F34B',
          }
        },
        '&:nth-child(odd) .wrap-claim-box': {
          top: 'unset',
          bottom: '-75px',
          '& .claim-at': {
            top: 'unset',
            bottom: 0,
            '&::before': {
              bottom: 'unset',
              top: '-7px',
              borderTop: 'unset',
            },
            '&.gamefi::before': {
              borderBottom: '8px solid #72F34B',
            },
            '&.airdrop::before, &.tba::before': {
              borderBottom: '8px solid #AEAEAE',
            },
            '&.external::before': {
              borderBottom: '8px solid #00E0FF',
            },
          }
        },
        '& .wrap-claim-box': {
          zIndex: 1,
          position: 'absolute',
          height: '90px',
          left: '-70px',
          top: '-75px',
          width: '130px',
          maxWidth: '130px',
          '&:hover .claim-at': {
            display: 'block',
          },
          [theme.breakpoints.down('sm')]: {
            top: '-30px !important',
            left: '-5px !important',
            width: '250px',
            maxWidth: 'unset',
            height: '50px',
          },
        },
        '& .claim-at': {
          display: 'none',
          position: 'absolute',
          top: '0px',
          minWidth: '102px',
          width: 'max-content',
          color: '#000',
          borderRadius: '12px',
          textAlign: 'center',
          padding: '6px 12px',
          fontFamily: 'Firs Neue',
          fontSize: '12px',
          fontWeight: 600,
          fontStyle: 'normal',
          letterSpacing: '0.5px',
          left: '24px',
          transition: 'opacity 1s ease-out',
          '&.show': {
            display: 'block'
          },
          [theme.breakpoints.down('sm')]: {
            top: '10px !important',
            left: '120px !important',
            bottom: 'unset !important'
          },
          '& a': {
            color: '#000',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '0',
            bottom: '-7px',
            left: '50%',
            transform: 'translate(-50%)',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            [theme.breakpoints.down('sm')]: {
              display: 'none',
            },
          },
          '&.gamefi': {
            background: '#72F34B',
            '&::before': {
              borderTop: '8px solid #72F34B',
            }
          },
          '&.airdrop, &.tba': {
            background: '#AEAEAE',
            '&::before': {
              borderTop: '8px solid #AEAEAE',
            }
          },
          '&.external': {
            left: 'calc(-130px / 2 + 4px)',
            background: '#00E0FF',
            '&::before': {
              borderTop: '8px solid #00E0FF',
            },
          }
        },
        '&:last-child .claim-at': {
          '&.gamefi, &.airdrop, &.tba': {
            left: '-8px',
          },
          '&.external': {
            left: '-40px',
          },
          '&::before': {
            left: 'unset',
            right: '12px',
          }
        }
      },
    },

    poolDetailClaimProgress: {
      ...typeDisplayFlex,
      position: 'relative',

      '&:before': {
        content: '""',
        position: 'absolute',
        top: -12,
        left: 0,
        right: 0,
        height: 6,
        background: '#44454B',

        [theme.breakpoints.down('sm')]: {
          top: 0,
          left: 6,
          right: 'auto',
          height: '100%',
          width: 5,
        },
      },

      '& li .mark': {
        position: 'absolute',
        top: -17,
        left: 0,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#44454B',
        zIndex: 2,

        [theme.breakpoints.down('sm')]: {
          top: 0,
          left: 0,
          right: 'auto',
        },
      },

      '& li .info': {
        fontSize: 12,
        lineHeight: '18px',
        marginTop: 12,

        [theme.breakpoints.down('sm')]: {
          textAlign: 'left',
          marginTop: 0,
        },

        '& > div:nth-child(2)': {
          color: '#AEAEAE',
          lineHeight: '20px',
          marginTop: 4,
        },

        '&.show': {
          whiteSpace: 'nowrap',
          transform: 'translateX(50%) !important'
        }
      },

      '& .first-item': {
        flex: '3 1 0',
        color: 'white',

        [theme.breakpoints.down('sm')]: {
          position: 'relative',
          width: '100%',
          textAlign: 'left',
          paddingLeft: 25,
          flex: '0 0 20px'
        },

        '&.active': {
          color: '#72F34B',
          position: 'relative',

          '&:before': {
            content: '""',
            position: 'absolute',
            top: -12,
            left: 0,
            right: 0,
            height: 6,
            background: '#72F34B',
            zIndex: 1,

            [theme.breakpoints.down('sm')]: {
              content: 'unset'
            },
          },

          '& .info > div:first-child': {
            color: '#72F34B'
          },

          '&.solo:before': {
            [theme.breakpoints.down('sm')]: {
              top: -12,
              left: 6,
              height: '99%',
              width: 5,
              right: 'auto',
            },
          }
        }
      },

      '& .item.last-item': {
        flex: '5 1 0',

        '& .info.show': {
          transform: 'none !important',
        },

        [theme.breakpoints.down('sm')]: {
          flex: '0 0 80px'
        },
      },

      '& .item': {
        flex: '2 1 0',
        position: 'relative',

        [theme.breakpoints.down('sm')]: {
          width: '100%',
          paddingLeft: 25,
          flex: '0 0 50px'
        },

        '& .mark': {
          left: 'unset',
          right: 0,

          [theme.breakpoints.down('sm')]: {
            bottom: 0,
            left: 0,
            right: 'auto',
            top: 'auto'
          },
        },

        '& .info': {
          textAlign: 'right',

          [theme.breakpoints.down('sm')]: {
            textAlign: 'left',
            position: 'absolute',
            left: 24,
            bottom: -24
          },
        },

        '&:not(:last-child):not(:first-child) .info': {
          position: 'absolute',
          right: 0,
          textAlign: 'center',
          transform: 'translateX(4px)',

          [theme.breakpoints.down('sm')]: {
            textAlign: 'left',
            transform: 'none',
          },
        },

        '&.active': {
          '&:before': {
            content: '""',
            position: 'absolute',
            top: -12,
            left: 0,
            right: 1,
            height: 6,
            background: '#72F34B',
            zIndex: 1,

            [theme.breakpoints.down('sm')]: {
              top: -30,
              left: 6,
              height: '125%',
              width: 5,
              right: 'auto',
            },
          },

          '& .info > div:first-child': {
            color: '#72F34B'
          },

          '&.solo:before': {
            [theme.breakpoints.down('sm')]: {
              top: -12,
              left: 6,
              height: '99%',
              width: 5,
              right: 'auto',
            },
          }
        }
      }
    }
  };
});

export default useStyles;
