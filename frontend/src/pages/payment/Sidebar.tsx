// src/components/Sidebar.tsx
import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h6>SAMGT PLEASANT</h6>
      </div>
      <ul className="sidebar-menu">
        <li className="menu-item"><i className="icon-home"></i> หน้าหลัก</li>
        <li className="menu-item"><i className="icon-profile"></i> จัดการประวัติ</li>
        <li className="menu-item"><i className="icon-appointment"></i> นัดหมาย</li>
        <li className="menu-item"><i className="icon-payment"></i> การเงิน</li>
        <li className="menu-item"><i className="icon-equipment"></i> อุปกรณ์</li>
        <li className="menu-item"><i className="icon-record"></i> รายการนัด</li>
        <li className="menu-item"><i className="icon-treatment"></i> บันทึกการรักษา</li>
      </ul>
      <div className="sidebar-footer">
        <button className="logout-button">ออกจากระบบ</button>
      </div>
    </div>
  );
};

export default Sidebar;
