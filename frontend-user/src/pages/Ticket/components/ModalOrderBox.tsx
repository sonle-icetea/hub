import React, { useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { ButtonGreen } from '@base-components/Buttons';
import { FormInputNumber } from '@base-components/FormInputNumber';
import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
    wrapperContent: {
        width: '100%',
        '& h3': {
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '24px',
            color: '#FFFFFF',
            marginBottom: '12px',
        },
        '& .input': {
            background: '#171717',
            color: '#FFFFFF',
            border: '1px solid #44454B',
        }
    }
}));
type Props = {
    open: boolean;
    onClose?: Function,
    onConfirm?: Function,
    isLoadingButton?: boolean,
    [k: string]: any,
}

const ModalOrderBox = ({ open, isLoadingButton, ...props }: Props) => {
    const styles = useStyles();
    const [numberBox, setNumberBox] = useState(0);
    const onChangeNumberBox = (event: any) => {
        const {value} = event.target;
        setNumberBox(value ? +value : 0);
    }
    const onClose = () => {
        props.onClose && props.onClose();
    }
    const onConfirm = () => {
        props.onConfirm && props.onConfirm(numberBox);
    }
    return (
        <CustomModal open={open} onClose={onClose}>
            <div className={styles.wrapperContent}>
                <h3>Number of Boxes you want to buy</h3>
                <FormInputNumber isInteger isPositive allowZero value={numberBox} onChange={onChangeNumberBox} className="input" />
                <ButtonGreen onClick={onConfirm} className="w-full text-transform-unset" isLoading={isLoadingButton} disabled={isLoadingButton}>
                    Confirm
                </ButtonGreen>
            </div>
        </CustomModal>
    )
}

export default React.memo(ModalOrderBox)
