import React from 'react';
import styles from './FeatureBar.module.scss';
import Slider from '../UI/Slider/Slider'
import { duration } from '@material-ui/core';

const FeatureBar = props => {
    let feature_bar_classes = [styles.feature_bar]
    if(props.mainState.isFeatureBarVisible){
        feature_bar_classes.push(styles.visible)
    }
    let duration = {
        total: props.mainState.totalDurationInSeconds,
    }
    duration.mins = Math.floor(props.mainState.totalDurationInSeconds/60);
    duration.secs = duration.total - (duration.mins*60);
    return (
        <div className={feature_bar_classes.join(' ')}>
            <div className={styles.title}>Extra Features</div>
            <div className={styles.feature}>
                <Slider value={props.mainState.fps} changed={props.handleFpsChange}/>
            </div>
            <div className={styles.feature}>
                Total {duration.mins} Minutes and {duration.secs} Seconds
            </div>
        </div>
    )
}

export default FeatureBar;
