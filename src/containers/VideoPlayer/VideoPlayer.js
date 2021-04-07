import React, { Component } from 'react';
import styles from './VideoPlayer.module.scss';
import * as Utils from '../../Utils/Utils';
import Sidebar from '../../components/Sidebar/Sidebar';
import PlayerActions from '../../components/PlayerActions/PlayerActions';
import Uploader from '../../components/Uploader/Uploader';
import Canvas from '../../components/Canvas/Canvas';

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
        fps: 10,
        interval: 50,
        currentSource: null,
        isUploaderReady: false,
        uploadedFilePlayStart: null,
        uploadedTimeoutTracker: null,
        originalWidth: 480,
        originalHeight: 360
    }
    changeImage = (src) => {
        let mainThis = this;
        let base_image = new Image();
        base_image.src = src;
        base_image.onload = function(){
            let w = mainThis.state.playerCanvas.width;
            let h = mainThis.state.playerCanvas.height;
            mainThis.state.playerContext.drawImage(base_image, 0, 0, w, h);
        }
    }
    getNextImage = () => {
        let newImageCounter = this.state.imageCounter + 1;
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
            }, mainThis.state.uploadedFileDuration);
            newState.currentSource = this.state.uploaddFileSrc;
            this.setState(newState);
            return false;
        }
        let mainThis = this;
        if(!this.state.playerCanvas){
            newState.playerCanvas = document.getElementById('player');
            newState.playerContext = newState.playerCanvas.getContext('2d');
        }
        if(!newState.isPlaying &&  this.state.uploadedTimeoutTracker){
            console.log('cleared timout')
            clearTimeout(this.state.uploadedTimeoutTracker);
            newState.uploadedTimeoutTracker = null;
            newState.uploadedFileDuration = this.state.uploadedFileDuration - (new Date() - this.state.uploadedFilePlayStart);
        }
        this.setState(newState,() => {
            if(newState.isPlaying){
                let playerTracker = setInterval(function(){
                    let src = mainThis.getNextImage();
                    mainThis.changeImage(src)
                }, this.state.interval);
                this.setState({playerTracker: playerTracker});
            }
            else{
                if(this.state.playerTracker){
                    clearInterval(this.state.playerTracker);
                }
            }
        });
    }
    openUploader = () => {
        this.setState({ isUploaderReady: true });
    }
    closeUploader = () => {
        this.setState({ isUploaderReady: false });
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
    componentDidMount(){
        let newState = {};
        newState.playerCanvas = document.getElementById('player');
        newState.playerContext = newState.playerCanvas.getContext('2d');
        this.setState(newState);
    }
        
    render (){
        return (
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
        );
    }
}

export default VideoPlayer;