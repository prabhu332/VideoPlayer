import React from 'react';
import styles from './FeatureBar.module.scss';
import Slider from '../UI/Slider/Slider'

const FeatureBar = props => {
    let feature_bar_classes = [styles.feature_bar]
    console.log(props.isVisible)
    if(props.isVisible){
        feature_bar_classes.push(styles.visible)
    }
    return (
        <div className={feature_bar_classes.join(' ')}>
            <div className={styles.title}>Extra Features</div>
            <Slider value={props.fps} changed={props.handleFpsChange}/>
        </div>
    )
}

export default FeatureBar;
