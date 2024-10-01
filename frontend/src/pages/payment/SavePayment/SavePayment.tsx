//สวัสดี
// src/components/PaymentList.tsx
import React from 'react';
import './SavePayment.css';
import logo from '../assets/logo.jpg'
import {useNavigate} from 'react-router-dom'; 
// import Nologo from '../../assets/nologo.png';
import Nologo from '../../../assets/payment/nologo.png';
import { useState, useEffect } from "react";
import { message, Input } from "antd"; // Import Input for Search
// ---------------------------------------------------
// import { SavePaymentInterface } from '../../interfaces/InterfaceSavePayment';
// import { GetSavePayment } from '../../services/https';

import { SavePaymentInterface } from '../../../interfaces/payment/ISavePayment';
import { GetSavePayment } from '../../../services/https/payment';
import {Link} from "react-router-dom";

//const { Search } = Input; // Destructure Search from Input
// ---------------------------------------------------
const SavePayment: React.FC = () => {
  const navigate = useNavigate();

  const [SaveRecord, setSaveRecord] = useState<SavePaymentInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();  
  const [filteredRecord, setFilteredRecord] = useState<SavePaymentInterface[]>([]);
  const [searchInput, setSearchInput] = useState<string>(''); // State for combined search input

  /*const Clist =  () =>{
    navigate('/paymentPage');
  };*/

  const getSavePayment = async () => {
    let res = await GetSavePayment();
    if (res.status == 200) {
      // Only update state if data has changed
      if (JSON.stringify(res.data) !== JSON.stringify(SaveRecord)) {
        setSaveRecord(res.data);
        setFilteredRecord(res.data);
      }
    } else {
      setSaveRecord([]);
      setFilteredRecord([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getSavePayment();
  }, []);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const filtered = value 
      ? SaveRecord.filter((rec) => {
          const fullName = `${rec.FirstName} ${rec.LastName}`;
          return fullName.includes(value) || rec.Date2 === value || rec.Date === value; // Check for name or date
        })
      : SaveRecord; // If input is empty, show all records
    setFilteredRecord(filtered);
  };

  return (
    <div className='savepayment-page'>
      <img className='logocenter' src={Nologo}/>
      <div className="saveheader">
        <h2 className='savecolor'>บันทึกชำระเงิน</h2>
        <Link to= "/viewschedule">
        <p className='appointment' style={{display:'flex',marginBottom:'5px',color:'#6495ED'}}>นัดหมายต่อเนื่อง</p>
        </Link>
      </div>
      <div>
        {/* Unified Search Section */}
        <Input
        placeholder="ค้นหาชื่อผู้ชำระเงิน หรือ วันที่"
        onChange={(e) => handleSearch(e.target.value)} // Update search on input change
        allowClear 
        style={{ maxWidth:250, backgroundColor: "#ffffff", borderColor: "#42C2C2", marginBottom: '10px', alignItems:'center'}} 
        className="custom-search"
      />
      <table className="savepaymentlist-table">
        <thead>
          <tr className='savecolor'>
            <th>ชื่อ</th>
            <th>อายุ</th>
            <th>จำนวนเงิน</th>
            <th>งวด</th>
            <th>วิธีชำระ</th>
            <th>วันที่</th>
            <th>สถานะ</th>
            <th>ผู้รับเงิน</th>
          </tr>
        </thead>
        <tbody>
        {filteredRecord.map((rec) => (
          <tr key={rec.ID} className='savecolor'> 
            <td  style={{textAlign:'left'}} >{  rec.FirstName} {rec.LastName}</td>
            <td>{rec.Age}</td>
            <td>{rec.PrintFees}</td>
            <td>{rec.NumberOfInstallment}</td>
            <td>{rec.MethodName}</td>
            <td>{rec.Date}</td>
            <td><span className="savestatus pending">{rec.StatusName}</span></td>
            <td>{rec.Efirst_name} {rec.Elast_name}</td>
          </tr>
           ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default SavePayment;
