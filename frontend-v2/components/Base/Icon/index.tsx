
type IconProps = {
  color?: string;
  className?: string;
  [k: string]: any;
}
export const BulletListIcon = ({ color = '#6C6D71', className, ...props }: IconProps) => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M15 0H7C6.4 0 6 0.4 6 1V3C6 3.6 6.4 4 7 4H15C15.6 4 16 3.6 16 3V1C16 0.4 15.6 0 15 0Z" fill={color} />
    <path d="M15 6H7C6.4 6 6 6.4 6 7V9C6 9.6 6.4 10 7 10H15C15.6 10 16 9.6 16 9V7C16 6.4 15.6 6 15 6Z" fill={color} />
    <path d="M15 12H7C6.4 12 6 12.4 6 13V15C6 15.6 6.4 16 7 16H15C15.6 16 16 15.6 16 15V13C16 12.4 15.6 12 15 12Z" fill={color} />
    <path d="M3 0H1C0.4 0 0 0.4 0 1V3C0 3.6 0.4 4 1 4H3C3.6 4 4 3.6 4 3V1C4 0.4 3.6 0 3 0Z" fill={color} />
    <path d="M3 6H1C0.4 6 0 6.4 0 7V9C0 9.6 0.4 10 1 10H3C3.6 10 4 9.6 4 9V7C4 6.4 3.6 6 3 6Z" fill={color} />
    <path d="M3 12H1C0.4 12 0 12.4 0 13V15C0 15.6 0.4 16 1 16H3C3.6 16 4 15.6 4 15V13C4 12.4 3.6 12 3 12Z" fill={color} />
  </svg>
}

export const GridIcon = ({ color = '#6C6D71', className, ...props }: IconProps) => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M6 0H1C0.4 0 0 0.4 0 1V6C0 6.6 0.4 7 1 7H6C6.6 7 7 6.6 7 6V1C7 0.4 6.6 0 6 0Z" fill={color} />
    <path d="M15 0H10C9.4 0 9 0.4 9 1V6C9 6.6 9.4 7 10 7H15C15.6 7 16 6.6 16 6V1C16 0.4 15.6 0 15 0Z" fill={color} />
    <path d="M6 9H1C0.4 9 0 9.4 0 10V15C0 15.6 0.4 16 1 16H6C6.6 16 7 15.6 7 15V10C7 9.4 6.6 9 6 9Z" fill={color} />
    <path d="M15 9H10C9.4 9 9 9.4 9 10V15C9 15.6 9.4 16 10 16H15C15.6 16 16 15.6 16 15V10C16 9.4 15.6 9 15 9Z" fill={color} />
  </svg>
}

export const MediumIcon = ({ color = '#fff', className, ...props }: IconProps) => {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M13.9998 28C21.7317 28 27.9998 21.732 27.9998 14C27.9998 6.26801 21.7317 0 13.9998 0C6.26777 0 -0.000244141 6.26801 -0.000244141 14C-0.000244141 21.732 6.26777 28 13.9998 28Z" fill="#2E2E2E" />
    <path d="M20.2749 9.78983L21.4665 8.6499V8.40039H17.3386L14.3967 15.7228L11.0497 8.40039H6.72149V8.6499L8.11342 10.3256C8.24907 10.4494 8.32 10.6305 8.30196 10.8128V17.3978C8.34489 17.6349 8.26774 17.8788 8.10098 18.0512L6.53296 19.9515V20.1979H10.9788V19.9483L9.41077 18.0512C9.2409 17.8782 9.16063 17.6386 9.19486 17.3978V11.7019L13.0975 20.201H13.5511L16.9068 11.7019V18.4724C16.9068 18.651 16.9068 18.6877 16.7898 18.8047L15.5827 19.9726V20.2228H21.4391V19.9732L20.2755 18.8339C20.1735 18.7568 20.1206 18.6274 20.1424 18.5017V10.1221C20.1206 9.99579 20.1729 9.86636 20.2749 9.78983Z" fill={color} />
  </svg>
}

export const TwitterIcon = ({ color = '#fff', className, ...props }: IconProps) => {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M28 14C28 21.7321 21.7321 28 14 28C6.26791 28 0 21.7321 0 14C0 6.26791 6.26791 0 14 0C21.7321 0 28 6.26791 28 14Z" fill="#2E2E2E" />
    <path d="M28 14C28 21.7321 21.7321 28 14 28C6.26791 28 0 21.7321 0 14C0 6.26791 6.26791 0 14 0C21.7321 0 28 6.26791 28 14Z" fill="#2E2E2E" />
    <path d="M10.5028 21.6587C17.6156 21.6587 21.5053 15.7659 21.5053 10.6562C21.5053 10.4887 21.5019 10.3223 21.4942 10.1566C22.2491 9.61053 22.9054 8.9295 23.4232 8.15427C22.7302 8.4621 21.9846 8.66952 21.2024 8.76288C22.0009 8.28436 22.6138 7.52686 22.903 6.62387C22.1555 7.06693 21.3284 7.38885 20.4476 7.56253C19.7418 6.811 18.7369 6.34082 17.625 6.34082C15.4892 6.34082 13.7574 8.07266 13.7574 10.2074C13.7574 10.511 13.7914 10.806 13.8576 11.0892C10.644 10.9275 7.7941 9.38858 5.88708 7.04898C5.55469 7.62042 5.36349 8.28436 5.36349 8.99252C5.36349 10.3341 6.04623 11.5186 7.08423 12.2114C6.44998 12.192 5.85397 12.0174 5.33295 11.7275C5.33209 11.7438 5.33209 11.76 5.33209 11.7769C5.33209 13.6499 6.6651 15.2134 8.43433 15.5678C8.10962 15.6563 7.76782 15.7039 7.41492 15.7039C7.16583 15.7039 6.92358 15.6791 6.68796 15.6343C7.18036 17.1704 8.60779 18.2885 10.3005 18.3202C8.97671 19.3573 7.3096 19.9753 5.49786 19.9753C5.18597 19.9753 4.87814 19.9576 4.57544 19.9217C6.28677 21.0184 8.31876 21.6587 10.5028 21.6587Z" fill={color} />
  </svg>
}

export const TelegramIcon = ({ color = '#fff', className, ...props }: IconProps) => {
  return <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#2E2E2E" />
    <path d="M12.6405 16.0398L18.9674 20.8166L22.1612 7.18359L5.83911 13.6039L10.8057 15.249L19.8699 9.16899L12.6405 16.0398Z" fill={color} />
    <path d="M10.8059 15.249L12.1662 20.1438L12.6407 16.0397L19.8701 9.16895L10.8059 15.249Z" fill="#D2D2D7" />
    <path d="M14.6971 17.5925L12.1663 20.1441L12.6408 16.04L14.6971 17.5925Z" fill="#B9B9BE" />
  </svg>
}

export const WebsiteIcon = ({ color = '#fff', className, ...props }: IconProps) => {
  return <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path d="M25 13C25 19.6275 19.6275 25 13 25C6.3725 25 1 19.6275 1 13C1 6.3725 6.3725 1 13 1C19.6275 1 25 6.3725 25 13Z" stroke="#AEAEAE" />
    <path d="M15.1411 10.6774C14.7903 8.51694 13.9629 7 13 7C12.0371 7 11.2097 8.51694 10.8589 10.6774H15.1411ZM10.6774 13C10.6774 13.5371 10.7065 14.0524 10.7573 14.5484H15.2403C15.2911 14.0524 15.3202 13.5371 15.3202 13C15.3202 12.4629 15.2911 11.9476 15.2403 11.4516H10.7573C10.7065 11.9476 10.6774 12.4629 10.6774 13ZM18.5331 10.6774C17.8411 9.03468 16.4403 7.76452 14.7105 7.25161C15.3008 8.06935 15.7073 9.30081 15.9202 10.6774H18.5331ZM11.2871 7.25161C9.55968 7.76452 8.15645 9.03468 7.46694 10.6774H10.0798C10.2903 9.30081 10.6968 8.06935 11.2871 7.25161ZM18.7919 11.4516H16.0169C16.0677 11.9597 16.0968 12.4798 16.0968 13C16.0968 13.5202 16.0677 14.0403 16.0169 14.5484H18.7895C18.9226 14.0524 18.9976 13.5371 18.9976 13C18.9976 12.4629 18.9226 11.9476 18.7919 11.4516ZM9.90323 13C9.90323 12.4798 9.93226 11.9597 9.98306 11.4516H7.20806C7.07742 11.9476 7 12.4629 7 13C7 13.5371 7.07742 14.0524 7.20806 14.5484H9.98064C9.93226 14.0403 9.90323 13.5202 9.90323 13ZM10.8589 15.3226C11.2097 17.4831 12.0371 19 13 19C13.9629 19 14.7903 17.4831 15.1411 15.3226H10.8589ZM14.7129 18.7484C16.4403 18.2355 17.8435 16.9653 18.5355 15.3226H15.9226C15.7097 16.6992 15.3032 17.9306 14.7129 18.7484ZM7.46694 15.3226C8.15887 16.9653 9.55968 18.2355 11.2895 18.7484C10.6992 17.9306 10.2927 16.6992 10.0798 15.3226H7.46694Z" fill={color} />
  </svg>
}

export const QuestionIcon = () => {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 0C3.13414 0 0 2.91 0 6.5C0 8.04875 0.58543 9.46906 1.55914 10.5856C1.2157 12.1578 0.0738281 13.5616 0.0601563 13.5781C0.0307133 13.6136 0.0110108 13.6581 0.00348772 13.7062C-0.00403532 13.7543 0.000951486 13.8039 0.0178308 13.8488C0.0347101 13.8937 0.0627407 13.9319 0.0984526 13.9588C0.134164 13.9857 0.17599 14 0.21875 14C2.03055 14 3.39035 13.0078 4.06328 12.3944C4.95715 12.7791 5.94973 13 7 13C10.8659 13 14 10.09 14 6.5C14 2.91 10.8659 0 7 0ZM7.65625 9.45125V10C7.65625 10.2762 7.46047 10.5 7.21875 10.5H6.78125C6.53953 10.5 6.34375 10.2762 6.34375 10V9.44594C6.03148 9.40375 5.73453 9.28375 5.47477 9.08781C5.30469 8.95938 5.28828 8.67812 5.43238 8.51344L5.91145 7.96594C6.01371 7.84906 6.16602 7.83344 6.29727 7.9025C6.38422 7.94813 6.47937 7.97188 6.57781 7.97188H7.47414C7.60156 7.97188 7.70492 7.85375 7.70492 7.70875C7.70492 7.59156 7.63602 7.4875 7.53758 7.45531L6.16848 7.00844C5.56008 6.81 5.07445 6.23625 4.99516 5.51875C4.88441 4.51656 5.51551 3.66156 6.34375 3.54844V3C6.34375 2.72375 6.53953 2.5 6.78125 2.5H7.21875C7.46047 2.5 7.65625 2.72375 7.65625 3V3.55406C7.96852 3.59625 8.26547 3.71625 8.52523 3.91219C8.69531 4.04063 8.71172 4.32188 8.56762 4.48656L8.08855 5.03406C7.98629 5.15094 7.83398 5.16656 7.70273 5.0975C7.6147 5.0515 7.51899 5.02783 7.42219 5.02812H6.52586C6.39844 5.02812 6.29508 5.14625 6.29508 5.29125C6.29508 5.40844 6.36398 5.5125 6.46242 5.54469L7.83152 5.99156C8.43992 6.19031 8.92555 6.76375 9.00484 7.48125C9.11559 8.48312 8.48449 9.33813 7.65625 9.45125Z" fill="white" />
  </svg>
}

export const CloseIcon = () => {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 1L4 4L7 7M13 13L10 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

export const DocumentCopyIcon = () => {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 3.5H2.5V15.5H12.5V3.5Z" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 0.5H15.5V13.5" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 6.5H9.5" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 9.5H9.5" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 12.5H9.5" stroke="#CFCFCF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

export const SolanaIcon = () => {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <rect width="32" height="32" fill="url(#pattern0)" />
    <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_1822_3731" transform="scale(0.00390625)" />
      </pattern>
      <image id="image0_1822_3731" width="256" height="256" xlinkHref="data:image/png;base64,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" />
    </defs>
  </svg>
}

export const TerraIcon = () => {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <rect width="32" height="32" fill="url(#pattern0)" />
    <defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_1822_3745" transform="scale(0.00390625)" />
      </pattern>
      <image id="image0_1822_3745" width="256" height="256" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAAJkUExURfnZXv///+94LPnZXfnaYfnYW/nbX////vnZXPrcavrdbf/++/rec/naY//88/nbZfrgefrbZ/vhgPvjhf/88f/99+93K/vkjO96Lv746/755/746f/79PzkxfnWXf/47vzonf/89vzqpPvnmP/78/3vvf3utf3xw//77f3yyPzsqv700vztsP/+/P/89f733P3zzvB8Mf3vuf/78fnYWvvmkvnZYP/+/P744v/99/vonPnQXPnUW//9+fGKSf///P/99/zrsfGEP/////B/N////////f/++v718P722P/99f/++/vig/rge+91KPnbaP/66/3wxvzrq/jLVv3rwPnQavWwSfGEMvvmkvKON/zrqf/++fzonPrfiPShQfi9mvzqr/3vu/rbcv712/755f///PnUY//++vnMsPfDUvnZZ/redPviifvfn/vil/nQffvhffrXivOPUv/55/OXYP766f701fzin/rciPzqrf3x1fa6TvrUvfrVgPvkmfnSdPKVO/7z0f///fvksv711//++vrecv/59v7x6v3vzPvom/7z0fzpqfznsP////vdyvvhi/3r4P/66fB+Nv3s1PzooPvjkfB+NvrViv////3vuPzj1PayiPSgbfvcqfrZnP734P700f////734f3xyf////vkiPnSa/Woev3xxf722PnPcvrZh/nRcfvho/7tzf3wyPvbpfzttfzdq/nLnf755faufvzktv3rxv///////PjEpf3z1v3wwfnWaf/67P735vzmt/SgbvvgnPnQYf/77vGKSfOVXPjFewD//0dwTEdwTOC1IbMAAADMdFJOU///////////////////C/////////////8B/wI0CP8T/zn//wX//////////yQZ////5CD///9Q/w72//8W/5Zsh/8r/3ikxf/+ZkX4+f/6d9fq/2n////q//a57cv//9fJ6aSbcv1a///z9fNuvOfkpv9Z/4O6Xdq9Rv//+df5/8rimNjZ+///K6OE0Hr0/+b/j/to4fbwe/qn////tZuCmtO/rer78//m45EouqtQu43xN8nq21V7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" />
    </defs>
  </svg>
}