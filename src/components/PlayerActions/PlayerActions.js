import React from 'react';
import { BsPlay, BsFillPauseFill } from "react-icons/bs";
import styles from './PlayerActions.module.scss';

const PlayerActions = props => {
    let icon = props.isPlaying ? <BsFillPauseFill /> : <BsPlay />
    return (
        <div className={styles.action_hodler}>
            <div className={styles.button_holder}>
                <button id='play_pause_btn' className={styles.play_button} onClick={props.onPlay}>{icon}</button>
            </div>
            <div className={styles.input_holder}>
                <textarea placeholder='Enter subtitle' maxLength={150} readOnly={props.isPlaying} onChange={(e) => props.handleSubTitle(e)} />
            </div>
        </div>
    )
}

export default PlayerActions;
