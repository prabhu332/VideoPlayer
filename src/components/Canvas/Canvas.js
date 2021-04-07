import React from 'react';
import styles from './Canvas.module.scss';

const Canvas = props => <div className={styles.video_player}>
    <div className={styles.title}>Sample Video</div>
    <div className={styles.player_holder} id='player_holder'>
        <canvas id="player" width={props.canvasWidth} height={props.canvasHeight}></canvas>
        {props.subTitle ? <div className={styles.sub_title}>{props.subTitle}</div> : null}
    </div>
</div>

export default Canvas;
