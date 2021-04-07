import React from 'react';
import styles from './Option.module.scss';

const Option = props => <div className={styles.option} onClick={props.clicked}>
    <div className={styles.icon_holder}>
        {props.option.icon}
    </div>
    <div className={styles.text_holder}>
        <div className={styles.name}>{props.option.name}</div>
        <span className={styles.size}>{props.option.size}</span>
    </div>
</div>

export default Option;