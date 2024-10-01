import React, { useRef, useState } from 'react'; 
import './dashbord.css';
import { Card, Carousel } from 'antd';

// Import รูปภาพ
import dadfun from '../../assets/payment/StockCake-Smiling with aligners_1727370690.jpg';
import rakfun from '../../assets/payment/รักษารากฟัน.jpg';
import utfun from '../../assets/payment/StockCake-Dental Treatment Close-up_1727372346.jpg';
import fuorai from '../../assets/payment/เคลือบฟลูออไรด์.jpg';
import tuadfun from '../../assets/payment/ตรวจฟัน.jpg';
import kudhinpun from '../../assets/payment/ขูดหินปูน.jpg';
import kubfun from '../../assets/payment/ครอบฟัน.jpg';
import phafunkud from '../../assets/payment/ผ่าฟันคุด.jpg';
import raka from '../../assets/payment/1.png'
import raka1 from '../../assets/payment/2.png'
import raka2 from '../../assets/payment/3.png'
import raka3 from '../../assets/payment/4.png'
import raka4 from '../../assets/payment/5.png'
import raka5 from '../../assets/payment/6.png'
import raka6 from '../../assets/payment/7.png'
import Nologo from '../../assets/payment/nologo.png';
// ข้อมูลการ์ด
const cardData = [
  { 
    title: 'ตรวจสุขภาพฟันและช่องปาก', 
    img: tuadfun, // ภาพด้านหน้าการ์ด
    hiddenDetails: [
      { header: 'ตรวจสุขภาพฟันและช่องปาก', price: 'เริ่มต้น 1,200 บาท', content: 'การตรวจสุขภาพฟันและช่องปากอย่างละเอียดเพื่อประเมินสภาพสุขภาพช่องปากทั้งหมด รวมถึงการตรวจหาฟันผุและโรคเหงือก ช่วยให้คุณมีสุขภาพฟันที่ดีตลอดไป' },
    ]
  },
  { 
    title: 'ครอบฟัน', 
    img: kubfun, // ภาพด้านหน้าการ์ด
    hiddenDetails: [
      { header: 'ครอบฟัน', price: 'เริ่มต้น 10,000 บาท', content: 'การครอบฟันเพื่อฟื้นฟูฟันที่เสียหายหรือมีรู โดยการติดตั้งครอบฟันที่มีคุณภาพสูง ช่วยให้ฟันกลับมาทำงานได้เหมือนเดิม พร้อมเพิ่มความสวยงามให้กับรอยยิ้ม' },
    ]
  },
  { 
    title: 'รักษารากฟัน', 
    img: rakfun, // ภาพด้านหน้าการ์ด
    hiddenDetails: [
      { header: 'รักษารากฟัน', price: 'เริ่มต้น 9,000 บาท', content: 'การรักษารากฟันเป็นการรักษาฟันที่มีปัญหาต่อการเกิดฟันผุ โดยจะช่วยรักษาฟันให้คงอยู่ในช่องปากและมีสุขภาพดี ช่วยป้องกันการถอนฟันในอนาคต' },
    ]
  },
  { 
    title: 'เคลือบฟลูออไรด์', 
    img: fuorai, // ภาพด้านหน้าการ์ด
    hiddenDetails: [
      { header: 'เคลือบฟลูออไรด์', price: 'เริ่มต้น 1,000 บาท', content: 'การเคลือบฟลูออไรด์จะช่วยเสริมความแข็งแรงให้กับฟันของคุณ ลดความเสี่ยงในการเกิดฟันผุและทำให้ฟันของคุณมีสุขภาพดีขึ้น' },
    ]
  },
  { 
    title: 'อุดฟัน ถอนฟัน', 
    img: utfun, // ภาพด้านหน้าการ์ด
    hiddenDetails: [
      { header: 'อุดฟัน', price: 'เริ่มต้น 600 บาท', content: 'กการอุดฟันเป็นการรักษาฟันผุเพื่อป้องกันไม่ให้ฟันเกิดความเสียหายมากขึ้น ช่วยรักษาความสวยงามและการทำงานของฟัน' },
      { header: 'ถอนฟัน', price: 'เริ่มต้น 1,200 บาท', content: 'การถอนฟันจะเป็นการรักษาที่จำเป็นในกรณีที่ฟันไม่สามารถรักษาได้ ช่วยให้คุณหลีกเลี่ยงอาการปวดและการติดเชื้อในอนาคต' },
    ]
  },
  { 
    title: 'จัดฟัน จัดฟันใส', 
    img: dadfun, // ภาพด้านหน้าการ์ด
    hiddenDetails: [
      { header: 'จัดฟัน', price: 'เริ่มต้น 40,000 บาท', content: 'การจัดฟันช่วยปรับโครงสร้างฟันให้เข้าที่ ช่วยให้รอยยิ้มของคุณสวยงามและมั่นใจมากขึ้น' },
      { header: 'จัดฟันใส', price:'เริ่มต้น 79,000 บาท', content: 'การจัดฟันแบบใสเป็นทางเลือกที่ทันสมัย ช่วยให้คุณมีรอยยิ้มที่สวยงามโดยไม่ต้องกังวลเกี่ยวกับลวดและเหล็ก' },
    ]
  },
  { 
    title: 'ขูดหินปูนและขัดฟัน', 
    img: kudhinpun, // ภาพด้านหน้าการ์ด
    hiddenDetails: [
      { header: 'เคลือบฟลูออไรด์', price: 'เริ่มต้น 1,200 บาท', content: 'การขูดหินปูนและขัดฟันจะช่วยทำความสะอาดฟันอย่างละเอียด โดยช่วยกำจัดคราบหินปูนและทำให้ฟันของคุณมีสุขภาพดีและสดใส' },
    ]
  },
  { 
    title: 'ผ่าฟันคุด', 
    img: phafunkud, // ภาพด้านหน้าการ์ด
    hiddenDetails: [
      { header: 'ผ่าฟันคุด', price: 'เริ่มต้น 3,300 บาท', content: 'การผ่าฟันคุดจะมีการดูแลเป็นพิเศษ เพื่อให้คุณมีการฟื้นตัวที่รวดเร็วและไม่มีอาการเจ็บปวดหลังการรักษา' },
    ]
  },


];

const Dashbord: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselRef = useRef<any>(null); // Reference for the Carousel

  const scrollToCard = (index: number) => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.children[0].getBoundingClientRect().width;
      containerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToCard(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < cardData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollToCard(currentIndex + 1);
    }
  };

  const handleCarouselPrev = () => {
    carouselRef.current.prev();
  };

  const handleCarouselNext = () => {
    carouselRef.current.next();
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center',     // Center vertically
    height: '500px',          // Adjust height as needed
    width: '100%',            // Full width to occupy the container
    position: 'relative',     // For positioning buttons
  };
  
  const imageStyle: React.CSSProperties = {
    maxWidth: '65%',         // Ensure the image doesn't exceed container width
    maxHeight: '65%',        // Ensure the image doesn't exceed container height
    objectFit: 'cover',       // Maintain aspect ratio
    margin: 'auto',           // Center the image within the container
  };

  return (
    <div>
      <div className='headerdash'>
        {/* <img className='logocenter' src={Nologo} alt="Logo" /> */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{color:'#22225E',marginLeft:'15px'}}>หน้าหลัก</h2>
        </div>
      </div>
      {/* Card Section */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden',marginTop:'-25px'}}>
        <button 
          onClick={handlePrevClick} 
          disabled={currentIndex === 0}
          style={{ 
            position: 'absolute', 
            left: 0, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 1, 
            background: 'rgba(0,0,0,0.5)', 
            color: 'white', 
            border: 'none', 
            padding: '10px',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {'<'}
        </button>
        
        <div className="card-container" ref={containerRef}>
          {cardData.map((card, index) => (
            <Card
              key={index}
              hoverable
              className="hover-card"
              cover={<img alt={card.title} src={card.img} />}
            >
              <div className="static-text">
                <h3>{card.title}</h3>
              </div>
              <div className="hidden-content">
                {card.hiddenDetails.map((detail, i) => (
                  <div key={i}>
                    <h3 style={{ fontSize: '16px'}}>{detail.header}</h3>
                    <h4 style={{ fontSize: '20px', marginTop: '5px',marginBottom: '0px' }}>{detail.price}</h4>
                    <p>{detail.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <button 
          onClick={handleNextClick} 
          disabled={currentIndex === cardData.length - 1}
          style={{ 
            position: 'absolute', 
            right: 0, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 1, 
            background: 'rgba(0,0,0,0.5)', 
            color: 'white', 
            border: 'none', 
            padding: '10px',
            cursor: currentIndex === cardData.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          {'>'}
        </button>
      </div>

      {/* Carousel Section */}
      <div style={{ position: 'relative', marginTop: '50px' }}>
        <Carousel 
          autoplay 
          effect="fade" 
          ref={carouselRef}
          dots={true} // Show dots for navigation
        >
          <div style={containerStyle}>
            <img 
              src={raka}
              alt="Image 1" 
              style={imageStyle}
            />
          </div>
          <div style={containerStyle}>
            <img 
              src={raka1}
              alt="Image 2" 
              style={imageStyle}
            />
          </div>
          <div style={containerStyle}>
            <img 
              src={raka2}
              alt="Image 3" 
              style={imageStyle}
            />
          </div>
          <div style={containerStyle}>
            <img 
              src={raka3}
              alt="Image 4" 
              style={imageStyle}
            />
          </div>
          <div style={containerStyle}>
            <img 
              src={raka4}
              alt="Image 5" 
              style={imageStyle}
            />
          </div>
          <div style={containerStyle}>
            <img 
              src={raka5}
              alt="Image 6" 
              style={imageStyle}
            />
          </div>
          <div style={containerStyle}>
            <img 
              src={raka6}
              alt="Image 7" 
              style={imageStyle}
            />
          </div>
        </Carousel>

        {/* Carousel Navigation Buttons */}
        <button 
          onClick={handleCarouselPrev} 
          style={{ 
            position: 'absolute', 
            left: 0, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 1, 
            background: 'rgba(0,0,0,0.5)', 
            color: 'white', 
            border: 'none', 
            padding: '10px',
            // cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {'<'}
        </button>
        
        <button 
          onClick={handleCarouselNext} 
          style={{ 
            position: 'absolute', 
            right: 0, 
            top: '50%', 
            transform: 'translateY(-50%)', 
            zIndex: 1, 
            background: 'rgba(0,0,0,0.5)', 
            color: 'white', 
            border: 'none', 
            padding: '10px',
            // cursor: currentIndex === cardData.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default Dashbord;
