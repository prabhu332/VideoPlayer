import React from 'react';
import { BsXCircle } from "react-icons/bs";
import styles from './Uploader.module.scss';
import * as Utils from '../../Utils/Utils';

const Uploader = props => {
    let uploadFrame = (
        <div onClick={props.openUploader} className={styles.add_frame}>Add a frame</div>
    );
    if(props.isUploaderReady){
        uploadFrame = (
            <div className={styles.frame_uploader}>
                <BsXCircle className={styles.close_icon} onClick={props.closeUploader}/>
                <div className={styles.upload_link} onClick={props.triggerFile}>
                    Upload Frame
                    <input type='file' id='upload_file' accept="image/*" onChange={(e) => props.handleFile(e)} />
                </div>
            </div>
        );
    }
    if(props.isUploadedFileReady){
        let filename = props.uploadedFileName.split('.');
        let ext = filename[filename.length-1];
        filename = Utils.truncateMidString(filename.slice(0, filename.length - 1).join('.'), 15);
        filename += '.' + ext;
        uploadFrame = (
            <div className={styles.file_handler}>
                <BsXCircle className={styles.close_icon} onClick={props.closeUploader}/>
                <div className={styles.filename}>{filename}</div>
                <div className={styles.add_duration}>
                    Length <input type='text' id='duration' maxLength="1"/> secs
                </div>
                <button onClick={props.handleDuration}>Add</button>
            </div>
        );
    }
    return <div className={styles.upload_frame_container}>{uploadFrame}</div>
}

export default Uploader;
