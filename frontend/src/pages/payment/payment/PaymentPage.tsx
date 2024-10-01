
//import { GetDentalRecordByID } from '../../services/https'; 
import React, { useState, useEffect  } from 'react';
import './PaymentPage.css';
import { Modal,message} from 'antd';
import {Link, useNavigate,useParams } from 'react-router-dom'; 
import {generatePDF}from '../Receipt/Receipt'
import Nologo from '../../../assets/payment/nologo.png';
import glogo from '../../../assets/payment/exchange.gif';
import {LeftOutlined } from '@ant-design/icons';
// import { PaymentDentalRecordInterface } from '../../interfaces/interfacePaymentDentalRecoed';
import { PaymentDentalRecordInterface } from '../../../interfaces/payment/IPaymentDentalRecord';
//import { GetDentalRecordByID, GetReceiptByID } from '../../services/https';
import { GetDentalRecordByID, GetReceiptByID, CreatePayment, UpdateDentalRecordPayment  } from '../../../services/https/payment';
//import { CreatePayment, UpdateDentalRecordPayment } from '../../services/https';
// import { ReceiptInterface } from '../../interfaces/interfaceReceipt';
import { ReceiptInterface } from '../../../interfaces/payment/IReceipt';

import choosepayment from '../../../assets/payment/online-payment.gif'
import creditcard from '../../../assets/payment/credit-card.gif'

import { GetLoggedInEmployee } from "../../../services/https/login/index";

const PaymentPage: React.FC = () => {
  
  const [employeeName, setEmployeeName] = useState(""); // เก็บชื่อ Employee ที่ล็อกอิน

  useEffect(() => {
    // เรียกใช้ service เพื่อดึงข้อมูลพนักงานที่ล็อกอิน
    GetLoggedInEmployee().then((res) => {
      if (res && res.employee) {
        setEmployeeName(res.employee.ID); // สมมติว่ามี FirstName และ LastName
      } else {
        setEmployeeName("Guest"); // ถ้าไม่มีข้อมูล
      }
    });
  }, []);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null); // State for selected payment method

  const { id } = useParams<{ id: any }>();
  const [payment, setPayment] = useState<PaymentDentalRecordInterface | null>(null);
  const [receipt, setreceipt] = useState<ReceiptInterface | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // const handleOk = () =>{//ไปหน้าบันทึกการชำระเงินและปริ้นใบเสร็จด้วย
  //   if (payment) {
  //     generatePDF(payment); // Pass payment data and ID to generatePDF
  //     navigate('/savePayment');
  //   }
  // }

  const handleOk = async () => {
    if (!selectedPaymentMethod || !payment) {
      message.error({content: (
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' ,color:'#FF0000'}}>
          <img src={`${choosepayment}?${Date.now()}`}  alt="Warning" style={{ width: '40px', height: '40px', marginRight: '8px' }}/>
          <span>กรุณาเลือกวิธีการชำระเงิน</span>
        </div>
         ),
         icon: ' ',
         duration:4.5, });
      return;
    }

    const employeeID = employeeName;   
    const paymentMethodID = getPaymentMethodID(selectedPaymentMethod);
    try {
      // ขั้นตอนที่ 1: สร้าง Payment ใหม่
      const data = {
        //date: "2006-06-25T09:00:00Z", // วันที่ปัจจุบัน
        paymentmethodid: paymentMethodID, // แปลงวิธีการชำระเงินที่เลือกเป็น ID
        EmployeeID: employeeID, // รับค่า Employee ID จาก dental record
       // Fees: payment.PrintFees, // สมมติว่า Fees ถูกส่งผ่าน payment.PrintFees
      };
      console.log("Sending data to API:", data); // ล็อกข้อมูลที่ส่งไป
      const paymentResponse = await CreatePayment(data); // เรียก API เพื่อสร้างรายการ Payment
  
      if (paymentResponse.status === 200) {
        const newPaymentID = paymentResponse.data.id; // รับค่า Payment ID จากการตอบกลับ
  
        // ขั้นตอนที่ 2: อัปเดต DentalRecord ด้วย Payment ID ใหม่
        const updateResponse = await UpdateDentalRecordPayment(payment?.ID, newPaymentID);
        const receiptResponse = await GetReceiptByID(payment?.ID);

        if (updateResponse.status === 200) {
          message.success({
            content: (
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' ,color:'#22225E'}}>
              <img src={`${creditcard}?${Date.now()}`}  alt="Success" style={{ width: '40px', height: '40px', marginRight: '8px' }}/>
              <span>ชำระเงินเสร็จสิ้น</span>
            </div>
             ),
             icon: ' ',
             duration:4.5, });
          navigate('/savePayment');
          setreceipt(receiptResponse.data[0]);
          generatePDF(payment, receiptResponse.data[0]);
        } else {
          message.error(`ไม่สามารถอัปเดท DentalRecord ได้: ${updateResponse.message || 'ไม่ทราบข้อผิดพลาด'}`);
        }
        
      } else {
        message.error("ไม่สามารถสร้าง Payment ได้");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการชำระเงิน");
    }
  
    setIsModalOpen(false);
  };
  
  // ฟังก์ชันช่วยในการแปลงวิธีการชำระเงินเป็น ID
  const getPaymentMethodID = (method: string) => {
    switch (method) {
      case 'เงินสด':
        return 1;
      case 'โอน':
        return 2;
      case 'บัตรเครดิต':
        return 3;
      default:
        return null;
    }
  };

  // ฟังก์ชันเปิดโมเดิล
  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      let res = await GetDentalRecordByID(id);
      if (res.status === 200) {
        setPayment(res.data[0]); 
      } else {
        setPayment(null);
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    };

    fetchData();
  }, [id]);


  /*const handleOk = () => {
    navigate('/paymentList');
    setIsModalOpen(false);

  };*/
//// ฟังก์ชันปิดโมเดิล
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Function to handle payment method selection
  const handlePaymentMethodClick = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  // const Name = 'สมหญิง สุขขี';

  return (
    
    <div className="payment-page">
      <div className='header2'>
        <img className='logocenter' src={Nologo} alt="Logo" />
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to = '/paymentList'>
          <h2><LeftOutlined /></h2>
        </Link>
        <h2 style={{color:'#22225E'}}>ชำระเงิน</h2>
        </div>
      </div>
      <div className="content-container">
        {/* Left Panel */}
        <div className='content-container-left'>
          <div className='mainright-panel'>
          <div className="left-panel">
            <div className="patient-info">
              <p id='name'><strong>คุณ:</strong>{payment?.FirstName} {payment?.LastName}</p>
              <p><strong>เพศ:</strong> {payment?.Sex}</p>
              <p><strong>อายุ:</strong> {payment?.Age}</p>
              <p><strong>โทร:</strong> {payment?.Tel}</p>
              <p><strong>หมู่เลือด:</strong>{payment?.BloodGroup}</p>
            </div>
          </div >
          <div className="left-panel">
            <div className="medical-info">
              <p><strong>โรคประจำตัว</strong></p>
              <ul>
                <li>{payment?.Chronicdisease}</li>
              </ul>
            </div>
          </div>
          <div className="left-panel">
            <div className="allergy-section">
              <p><strong>ประวัติแพ้ยา</strong></p>
              <ul>
                <li>{payment?.DrugAllergy}</li>
              </ul>
            </div>
          </div>
          </div>
        </div>
        {/* Right Panel */}
        <div className='content-container-right'>
          <div className="right-panel">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th>ทันตแพทย์</th>
                  <th>วันที่</th>
                  <th>ราคา</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{payment?.TreatmentName}</td>
                  <td>{payment?.Efirstname} {payment?.Elastname}</td>
                  <td>{payment?.Date}</td>
                  <td>{payment?.PrintFees}</td>
                </tr>
              </tbody>
            </table>
            <div className="payment-summary">
              <div className="summary-item total">
                <p className="summary-title">ค่าใช้จ่าย</p>
                <p className="summary-value">รวม {payment?.PrintFees} บาท</p>
              </div>
              <div className="summary-item installment">
                <div><p className="summary-title">ผ่อนจ่าย</p>
                    <p className="summary-title total">ยอดต้องจ่าย {payment?.PrintInstallment} บาท</p>
                </div>
                <p className="summary-value">งวดที่ {payment?.NumberOfInstallment} งวด</p>
              </div>
            </div>
          </div>
          <div className="payment-action">
            <button className="pay-button" onClick={showModal}>
              ชำระเงิน
            </button>  
          </div>
        </div>
      </div>
      <Modal title={<div className="modal-title"><span>ชำระเงิน</span>{/*<img src={glogo} alt="Logo" className="title-logo" />*/}</div>} open={isModalOpen} closable={false}  footer={null} className="payment-modal">
        <div className="payment-options">
          <button
            className={`payment-option-button ${selectedPaymentMethod === 'เงินสด' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodClick('เงินสด')}
          >
            เงินสด
          </button>
          <button
            className={`payment-option-button ${selectedPaymentMethod === 'โอน' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodClick('โอน')}
          >
            โอน
          </button>
          <button
            className={`payment-option-button ${selectedPaymentMethod === 'บัตรเครดิต' ? 'selected' : ''}`}
            onClick={() => handlePaymentMethodClick('บัตรเครดิต')}
          >
            บัตรเครดิต
          </button>
        </div>
        <div className="payment-details">
          <table className='tablemodal'>
            <tr><td className='lefttablemodal'><p className="detail-item">ค่าใช้จ่าย:</p></td><td className='righttablemodal'><p className="detail-item">{payment?.PrintFees} บาท</p></td></tr>
            <tr><td className='lefttablemodal'><p className="detail-item">ผ่อนชำระ:</p></td><td  className='righttablemodal'><p className="detail-item">{payment?.NumberOfInstallment} งวด</p></td></tr>
          </table>
        </div>
        <div className="payment-confirmation">
          <button className="paycancel-button" onClick={handleCancel}>ยกเลิก</button>
          <button className="payconfirm-button" onClick={handleOk} >ยืนยันการชำระเงิน</button>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;
