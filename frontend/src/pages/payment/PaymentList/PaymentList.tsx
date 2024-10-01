import React from 'react';
import './PaymentList.css';
import { useNavigate } from 'react-router-dom';
import Nologo from '../../../assets/payment/nologo.png';

//--------------------------------------------
// import { DentalRecoedInterface } from '../../interfaces/InterfaceDentalRecoed';
// import { GetAllDentalRecord } from '../../services/https/index';

import { DentalRecoedInterface } from '../../../interfaces/payment/IDentalRecord';
import { GetAllDentalRecord } from '../../../services/https/payment';
//--------------------------------------------

import { useState, useEffect } from "react";
import { message } from "antd";
//import { PaymentDentalRecordInterface } from '../../interfaces/interfacePaymentDentalRecoed';
//import { GetDentalRecordByID } from '../../services/https/index';

const PaymentList: React.FC = () => {
  const navigate = useNavigate();

  // State to hold the dental records
  const [record, setRecord] = useState<DentalRecoedInterface[]>([]);
  
  // const [messageApi, contextHolder] = message.useMessage();
  //const [payment, setpayment] = useState<PaymentDentalRecordInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Function to navigate to payment page
  const Clist = (id?:number) => {
    navigate(`/paymentList/paymentPage/${id}`);
  };

  // Function to fetch all dental records from API
  const getAllDentalRecord = async () => {
    let res = await GetAllDentalRecord();
    if (res.status == 200) {
      setRecord(res.data);  // Store the fetched data in the 'record' state
    } else {
      setRecord([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  // Use useEffect to fetch the data when the component mounts
  useEffect(() => {
    getAllDentalRecord();
  // Set up an interval to fetch data every 5 seconds (5000 ms)
  const interval = setInterval(() => {
    getAllDentalRecord(); // Refresh data every 5 seconds
  }, 5000);

  // Clean up the interval when the component unmounts
  return () => clearInterval(interval);
  }, []);

  return (
    <div className='payment-page2'>
      {contextHolder}
      <div className="headerpayment">
        <img className='logocenter' src={Nologo} alt="logo" />
        <h2 className='color'>รอชำระเงิน</h2>
      </div>
      <div>
        <table className="paymentlist-table">
          <thead>
            <tr className='color'>
              <th>ชื่อ</th>
              <th>อายุ</th>
              <th>ค่าใช้จ่าย</th>
              <th>งวด</th>
              <th>วันที่</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
              {/* record.map(): ใช้สำหรับการวนลูปข้อมูลใน record ซึ่งเป็นอาร์เรย์ที่เก็บข้อมูลของผู้ใช้ที่ดึงมาจาก API */}
              {/* <tr key={rec.ID}>: สร้างแถวใหม่ในตาราง โดยใช้ rec.ID เป็นคีย์ที่ไม่ซ้ำกันสำหรับแต่ละแถว */}
            {record.map((rec) => (
              <tr key={rec.ID} className='color' onClick={() => Clist(rec.ID)}>
                <td>{rec.FirstName} {rec.LastName}</td>
                <td>{rec.Age}</td>
                <td>{rec.PrintFees}</td>
                <td>{rec.NumberOfInstallment}</td>
                <td>{rec.Date}</td>
                <td>
                  <span className={"status pending"}>
                    {rec.StatusName}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentList;
