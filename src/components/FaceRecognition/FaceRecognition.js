import React from 'react';
import './FaceRecognition.css';


const FaceRecognition = ({ imageUrl, box }) => {
        if (Object.keys(imageUrl).length !== 0){
        return (
            <div className='center ma'>
                <div className='absolute mt2'>
                    <img id='inputimage' alt='det' src={imageUrl} width='500px' height='auto' />
                    <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol,}}></div>
                </div>
            </div>
        )
    }
}

export default FaceRecognition;