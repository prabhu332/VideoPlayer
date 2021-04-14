import React, { Component } from 'react';
import { BsFillGearFill, BsFillXCircleFill } from "react-icons/bs";

import styles from './VideoPlayer.module.scss';
import * as Utils from '../../Utils/Utils';
import Sidebar from '../../components/Sidebar/Sidebar';
import PlayerActions from '../../components/PlayerActions/PlayerActions';
import Uploader from '../../components/Uploader/Uploader';
import Canvas from '../../components/Canvas/Canvas';
import FeatureBar from '../../components/FeatureBar/FeatureBar';

class VideoPlayer extends Component {
    state = {
        activeSizeOption: 'Original',
        playerCanvas: null,
        playerContext: null,
        playerTracker: null,
        canvasWidth: 480,
        canvasHeight: 360,
        isPlaying: false,
        imageCounter: 0,
        imageCounterLimit: 8000,
        fps: 10,
        interval: 100,
        totalDurationInSeconds: 800,
        currentSource: null,
        isUploaderReady: false,
        isUploadedFileReady: false,
        uploadedFilePlayStart: null,
        uploadedTimeoutTracker: null,
        uploadedFileDuration: 0,
        uploadedFileRemainingDuration: 0,
        originalWidth: 480,
        originalHeight: 360,
        isFeatureBarVisible: false
    }
    changeImage = (src) => {
        let mainThis = this;
        let base_image = new Image();
        base_image.src = src;
        base_image.onload = function(){
            if(mainThis.state.isPlaying){
                let w = mainThis.state.playerCanvas.width;
                let h = mainThis.state.playerCanvas.height;
                mainThis.state.playerContext.drawImage(base_image, 0, 0, w, h);
            }
        }
    }
    getNextImage = () => {
        let newImageCounter = this.state.imageCounter + 1;
        if(newImageCounter > this.state.imageCounterLimit){
            newImageCounter = 1;
            let mainThis = this;
            setTimeout(function(){
                mainThis.initPlayer();
            }, 10);
        }
        let src = '/frames/s_' + Utils.padLeadingZeros(newImageCounter, 8) + '.jpg';
        this.setState({
            imageCounter: newImageCounter,
            currentSource: src
        });
        return src;
    }
    initPlayer = (e, isDirectPlay) => {
        let newState = { isPlaying: (isDirectPlay || !this.state.isPlaying) };
        if(!this.state.isPlaying && !isDirectPlay && this.state.uploadedFileName){
            let mainThis = this;
            mainThis.changeImage(this.state.uploaddFileSrc);
            newState.uploadedFilePlayStart = new Date();
            newState.uploadedTimeoutTracker = setTimeout(function(){
                mainThis.initPlayer(e, true);
            }, mainThis.state.uploadedFileRemainingDuration);
            newState.currentSource = this.state.uploaddFileSrc;
            this.setState(newState);
            return false;
        }
        let mainThis = this;
        if(!this.state.playerCanvas){
            newState.playerCanvas = document.getElementById('player');
            newState.playerContext = newState.playerCanvas.getContext('2d');
        }
        if(!newState.isPlaying){
            if(this.state.uploadedTimeoutTracker){
                clearTimeout(this.state.uploadedTimeoutTracker);
                newState.uploadedTimeoutTracker = null;
                newState.uploadedFileRemainingDuration = this.state.uploadedFileRemainingDuration - (new Date() - this.state.uploadedFilePlayStart);
                if(newState.uploadedFileRemainingDuration < 0){
                    newState.uploadedFileRemainingDuration = this.state.uploadedFileDuration
                }
            }
            if(this.state.playerTracker){
                clearTimeout(this.state.playerTracker);
            }
        }
        this.setState(newState,() => {
            if(newState.isPlaying){ mainThis.reinitPlayerTracker() }
        });
    }
    reinitPlayerTracker = () => {
        if(this.state.playerTracker){
            clearInterval(this.state.playerTracker)
        }
        let mainThis = this;
        let playerTracker = setInterval(function(){
            let src = mainThis.getNextImage();
            mainThis.changeImage(src)
        }, this.state.interval);
        this.setState({playerTracker: playerTracker});
    }
    openUploader = () => {
        this.setState({ isUploaderReady: true });
    }
    closeUploader = () => {
        this.setState({
            isUploadedFileReady: false,
            isUploaderReady: false,
            uploaddFileSrc: null,
            uploadedFileName: null
        })
    }
    triggerFile = () => {
        document.getElementById('upload_file').click();
    }
    handleSubTitle = (e) => {
        this.setState({ subTitle: e.target.value });
    }
    handleFile = (e) => {
        let file = e.target.files[0];
        let src = URL.createObjectURL(file);
        this.setState({
            isUploadedFileReady: true,
            isUploaderReady: false,
            uploaddFileSrc: src,
            uploadedFileName: file.name
        })
    }
    changeCanvasSize = (type) => {
        let original = {
            width: this.state.originalWidth,
            height: this.state.originalHeight
        };
        let minSize, maxSize, newState = {};
        switch(type.toLowerCase()) {
            case 'landscape':
                maxSize = original.width > original.height ? original.width : original.height;
                newState = {
                    canvasWidth: maxSize,
                    canvasHeight: (maxSize/16)*9
                };
            break;
            case 'portrait':
                minSize = original.width > original.height ? original.height : original.width;
                newState = {
                    canvasWidth: (minSize/16)*9,
                    canvasHeight: minSize
                };
            break;
            case 'square':
                minSize = original.width > original.height ? original.height : original.width;
                newState = {
                    canvasWidth: minSize,
                    canvasHeight: minSize
                };
                break;
            default:
                newState = {
                    canvasWidth: original.width,
                    canvasHeight: original.height
                };
        };
        let mainThis = this;
        newState.activeSizeOption = type;
        this.setState(newState, () => {
            document.getElementById('player_holder').style.width = newState.canvasWidth.toString() + 'px';
            mainThis.changeImage(this.state.currentSource);
        });
    }
    handleDuration = () => {
        let duration = parseInt(document.getElementById('duration').value);
        if(isNaN(duration) || duration < 1){
            alert('Enter valid number');
            document.getElementById('duration').value = '';
            return false;
        }
        this.setState({
            uploadedFileDuration: duration*1000,
            isUploaderReady: false,
            isUploadedFileReady: false,
        }, () => {
            alert('File added successfully');;
        });
    }
    handleFpsChange = (e, value) => {
        let mainThis = this;
        let interval = 1000/value;
        let duration = Math.ceil(this.state.imageCounterLimit/value);
        this.setState({
            fps: value,
            interval: interval,
            totalDurationInSeconds: duration
        },() => mainThis.reinitPlayerTracker());
    }
    componentDidMount(){
        let newState = {};
        newState.playerCanvas = document.getElementById('player');
        newState.playerContext = newState.playerCanvas.getContext('2d');
        this.setState(newState);
        document.body.onkeyup = function(e){
            if(e.code === 'Space' && (document.activeElement.tagName !== 'TEXTAREA' || document.activeElement.readOnly)){
                try {
                    document.getElementById('play_pause_btn').click();
                }
                catch (e) {
                    console.log(e);
                }            
            }
        };  
        
    }
    showHideFeatureBar = () => {
        this.setState({ isFeatureBarVisible: !this.state.isFeatureBarVisible });
    }
        
    render (){
        return (
            <div className={styles.root}>
                <div className={styles.player_container}>
                    <div className={styles.video_player_holder}>
                        <Canvas
                            canvasWidth={this.state.canvasWidth}
                            canvasHeight={this.state.canvasHeight}
                            subTitle={this.state.subTitle}
                        />
                        <Sidebar clicked={this.changeCanvasSize} activeSizeOption={this.state.activeSizeOption} />
                    </div>
                    <div className={styles.action_and_frames_holder}>
                        <PlayerActions
                            onPlay={this.initPlayer}
                            isPlaying={this.state.isPlaying}
                            handleSubTitle={this.handleSubTitle}
                        />
                        <Uploader 
                            isUploaderReady={this.state.isUploaderReady}
                            isUploadedFileReady={this.state.isUploadedFileReady}
                            uploadedFileName={this.state.uploadedFileName}
                            openUploader={this.openUploader}
                            closeUploader={this.closeUploader}
                            triggerFile={this.triggerFile}
                            handleFile={this.handleFile}
                            handleDuration={this.handleDuration}
                        />   
                    </div>
                </div>
                <div className={styles.feature_bar_container}>
                    {
                        this.state.isFeatureBarVisible ? 
                        <BsFillXCircleFill className={styles.trigger} onClick={this.showHideFeatureBar}/> :
                        <BsFillGearFill className={styles.trigger} onClick={this.showHideFeatureBar}/>
                    }
                    <FeatureBar 
                        mainState={this.state}
                        handleFpsChange={this.handleFpsChange}
                        />
                </div>
            </div>
        );
    }
}

export default VideoPlayer;