import React from 'react';
import { BsToggles, BsPhoneLandscape, BsPhone, BsApp } from "react-icons/bs";
import styles from './Sidebar.module.scss';
import Option from './Option/Option';

const Sidebar = props => {
    let data = [
        { name: 'Original', size: '', icon: <BsToggles /> },
        { name: 'Landscape', size: '16:9', icon: <BsPhoneLandscape /> },
        { name: 'Portrait', size: '9:16', icon: <BsPhone /> },
        { name: 'Square', size: '1:1', icon: <BsApp />}
    ];
    let options = data.map(option => <Option key={option.name} isActive={option.name === props.activeSizeOption} option={option} clicked={() => props.clicked(option.name)}/>)
    return (
        <div className={styles.sidebar}>
            <div className={styles.title}>Size Options</div>
            <div className={styles.options}>{options}</div>
        </div>
    )
}

export default Sidebar;
