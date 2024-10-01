import React from 'react';
import './dashbord.css';
import { Carousel } from 'antd';
//import photo1 from '../../assets/istockphoto-1177380740-612x612.jpg'
import photo1 from '../../../assets/payment/istockphoto-1177380740-612x612.jpg'
import photo2 from '../../../assets/payment/istockphoto-1201790705-612x612.jpg'
import photo3 from '../../../assets/payment/istockphoto-1354983233-612x612.jpg'
import photo4 from '../../../assets/payment/istockphoto-1411072839-612x612.jpg'

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',  // จัดภาพให้อยู่ตรงกลางแนวนอน
  alignItems: 'center',      // จัดภาพให้อยู่ตรงกลางแนวตั้ง
  background: 'pink',
  height: '500px',           // ปรับความสูงของ container
  width: '10%',   // ปรับความกว้างของ Carousel
  margin: '0 auto', // จัดให้อยู่ตรงกลาง
};

const imageStyle: React.CSSProperties = {
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',       // ป้องกันภาพบิดเบี้ยว
};

const dashbord: React.FC = () => (
<div style={{backgroundColor:"pink"}}>
  <Carousel autoplay effect="fade" >
    <div style={containerStyle}>
      <img 
        src={photo1}
        alt="Image 1" 
        style={imageStyle}
      />
    </div>
    <div style={containerStyle}>
      <img 
        src={photo2}
        alt="Image 2" 
        style={imageStyle}
      />
    </div>
    <div style={containerStyle}>
      <img 
        src={photo3}
        alt="Image 3" 
        style={imageStyle}
      />
    </div>
    <div style={containerStyle}>
      <img 
        src={photo4}
        alt="Image 4" 
        style={imageStyle}
      />
    </div>
  </Carousel>
</div>
);

export default dashbord;
