import { makeStyles } from "@material-ui/core";
import { typeDisplayFlex } from "../../../styles/CommonStyle";

const useStyles = makeStyles((theme: any) => ({
  cardImgUpcoming: {
    maxHeight: "220px",
    marginBottom: "15px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "13px",
      maxHeight: "108px",
    },
    // overflow: 'hidden',

    "&::before, &::after": {
      height: "6px !important",
      width: "25% !important",
      [theme.breakpoints.down("xs")]: {
        height: "3px !important",
        width: "20% !important",
      },
    },

    "& h4": {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "28px",
      textAlign: "center",
      color: "#72F34B",
      mixBlendMode: "normal",
      position: "absolute",
      top: "-26px",
      left: "50%",
      transform: "translate(-50%)",
      textTransform: "uppercase",
      [theme.breakpoints.down("xs")]: {
        fontWeight: 400,
        fontSize: "10px",
        lineHeight: "12px",
        top: "-20px",
      },
    },
    // "& img": {
    //   height: "90%"
    // },
  },
  cardOpening: {
    height: "100%",
    position: "relative",
    transition: ".5s",
    "&:hover > div": {
      opacity: ".3",
    },
    "&:hover .btn-detail": {
      ...typeDisplayFlex,
      justifyContent: "center",
      alignItems: "center",
      left: "50%",
    },
    [theme.breakpoints.down("xs")]: {
      paddingBottom: "13px",
    },
  },
  btnDetail: {
    position: "absolute",
    top: "50%",
    left: "200%",
    transform: "translate(-50%, -50%)",
    outline: "none",
    // border: 'none',
    borderRadius: "2px",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "26px",
    textAlign: "center",
    minWidth: "150px",
    [theme.breakpoints.down("xs")]: {
      minWidth: "100px",
    },
    cursor: "pointer",
    height: "44px",
    color: "#000",
    background: "#72f348",
    display: "none",
    border: "1px solid #72F34B",
    transition: ".5s",
    width: "fit-content",
    "&:hover": {
      textDecoration: "unset",
      color: "#000",
    },
  },
}));

export default useStyles;
