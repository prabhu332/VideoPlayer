import React, { Component } from 'react';
import styles from './Layout.module.scss';

class Layout extends Component {
    render (){
        return (
            <div className={styles.Content}>
                {this.props.children}
            </div>
        );
    }
}

export default Layout;