import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => ({
  cardActive: {
    display: 'grid',
    width: '840px',
    gridTemplateColumns: '401px auto',
    gap: '32px',
    // [theme.breakpoints.down('md')]: {
    //   width: 'unset',
    //   gridTemplateColumns: '400px',
    // },
    // [theme.breakpoints.down('sm')]: {
    //   width: 'unset',
    //   gridTemplateColumns: '310px',
    // }
    [theme.breakpoints.down("sm")]: {
      width: "400px",
      gridTemplateColumns: "auto",
    },
    [theme.breakpoints.down("xs")]: {
      width: "319px",
      gridTemplateColumns: "auto",
    },
  },
  cardActiveApproved: {
    border: '1px solid #72F34B',
    boxShadow: '0px 4px 40px rgba(114, 243, 75, 0.12)',
    background: '#000000'
  },
  timeEnd: {
    ...typeDisplayFlex,
    alignItems: 'center',
    // padding: '3px 8px',
    borderRadius: '4px',
    // background: '#2E2E2E',
    fontFamily: 'Firs Neue',
    fontStyle: 'normal',
    color: ' #fff',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '28px',
    mixBlendMode: 'normal',
    '& .sp1': {
      display: 'block',
      marginRight: '6px'
    }
  },
  btnDetail: {
    outline: 'none',
    border: 'none',
    borderRadius: '2px',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '26px',
    textAlign: 'center',
    minWidth: '130px',
    cursor: 'pointer',
    height: '44px',
    background: 'transparent',
    ...typeDisplayFlex,
    justifyContent: 'center',
    alignItems: 'center',
    transition: '.3s',
    '&:hover': {
      textDecoration: 'unset',
      color: '#000 !important',
      background: '#72f348',
    },
    // '&.approved': {
    //   color: '#000',
    //   background: '#72f348',
    // },
    '&.not-approved': {
      border: '1px solid #72F34B',
      color: '#72F34B',
    }
  },
  buyBox: {
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '5px',
    },
  },
  price: {
    color: '#72F34B',
    textTransform: 'uppercase'
  }
}));

export default useStyles;
