import React, { Component } from 'react';
import styles from './VideoPlayer.module.scss';
import * as Utils from '../../Utils/Utils';
import Sidebar from '../../components/Sidebar/Sidebar';
import PlayerActions from '../../components/PlayerActions/PlayerActions';
import Uploader from '../../components/Uploader/Uploader';
import Canvas from '../../components/Canvas/Canvas';

class VideoPlayer extends Component {
    state = {
        playerCanvas: null,
        playerContext: null,
        playerTracker: null,
        canvasWidth: 480,
        canvasHeight: 360,
        isPlaying: false,
        imageCounter: 300,
        fps: 10,
        interval: 50,
        currentSource: null,
        isUploaderReady: false,
        uploadedFilePlayStart: null,
        uploadTimeoutTracker: null,
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
        })
        return src;
    }
    initPlayer = (e, isDirectPlay) => {
        let newState = { isPlaying: (isDirectPlay || !this.state.isPlaying) }
        if(!this.state.isPlaying && !isDirectPlay && this.state.uploadedFileName){
            let mainThis = this;
            this.setState({
                currentSource: this.state.uploaddFileSrc,
                ...newState
            });
            mainThis.changeImage(this.state.uploaddFileSrc)
            setTimeout(function(){
                mainThis.initPlayer(e, true)
            }, mainThis.state.uploadedFileDuration*1000)
            return false;
        }
        let mainThis = this;
        if(!this.state.playerCanvas){
            newState.playerCanvas = document.getElementById('player')
            newState.playerContext = newState.playerCanvas.getContext('2d')
        }
        this.setState(newState,() => {
            if(newState.isPlaying){
                let playerTracker = setInterval(function(){
                    let src = mainThis.getNextImage();
                    mainThis.changeImage(src)
                }, this.state.interval);
                this.setState({playerTracker: playerTracker})
            }
            else{
                clearInterval(this.state.playerTracker)
            }
        });
    }
    openUploader = () => {
        this.setState({ isUploaderReady: true })
    }
    closeUploader = () => {
        this.setState({ isUploaderReady: false })
    }
    triggerFile = () => {
        document.getElementById('upload_file').click()
    }
    handleSubTitle = (e) => {
        this.setState({ subTitle: e.target.value })
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
    changeVideoSize = (type) => {
        let original = {
            width: this.state.originalWidth,
            height: this.state.originalHeight
        }
        let minSize, maxSize, newObject = {}
        switch(type.toLowerCase()) {
            case 'landscape':
                maxSize = original.width > original.height ? original.width : original.height;
                newObject = {
                    canvasWidth: maxSize,
                    canvasHeight: (maxSize/16)*9
                }
            break;
            case 'portrait':
                minSize = original.width > original.height ? original.height : original.width;
                newObject = {
                    canvasWidth: (minSize/16)*9,
                    canvasHeight: minSize
                }
            break;
            case 'square':
                minSize = original.width > original.height ? original.height : original.width;
                newObject = {
                    canvasWidth: minSize,
                    canvasHeight: minSize
                }
                break;
            default:
                newObject = {
                    canvasWidth: original.width,
                    canvasHeight: original.height
                }
        }
        this.setState(newObject)
        document.getElementById('player_holder').style.width = newObject.canvasWidth.toString() + 'px';
        this.changeImage(this.state.currentSource)
    }
    handleDuration = () => {
        let duration = parseInt(document.getElementById('duration').value)
        console.log(duration)
        if(isNaN(duration) || duration < 1){
            alert('Enter valid number')
            document.getElementById('duration').value = '';
            return false;
        }
        console.log(duration)
        this.setState({
            uploadedFileDuration: duration,
            isUploaderReady: false,
            isUploadedFileReady: false,
        }, () => {
            alert('File added successfully')
        })
        // this.changeImage(this.state.uploaddFileSrc)
    }
    componentDidMount(){
        let newState = {}
        newState.playerCanvas = document.getElementById('player')
        newState.playerContext = newState.playerCanvas.getContext('2d')
        this.setState(newState)
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
                    <Sidebar clicked={this.changeVideoSize}/>
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