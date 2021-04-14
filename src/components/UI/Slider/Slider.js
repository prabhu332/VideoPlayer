import React from 'react';
import Slider from '@material-ui/core/Slider';

const FpsSlider = props => {
  return (
    <div>
        {props.value} frames per second
        <Slider
            value={props.value}
            onChange={props.changed}
            valueLabelDisplay="auto"
            aria-labelledby="fps-slider"
            step={5}
            marks
            min={5}
            max={50}
        />
    </div>
  );
}
export default FpsSlider;