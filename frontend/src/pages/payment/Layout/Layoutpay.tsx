import React, { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Input, QRCode, Space } from 'antd';//QRCODE
//import Htmlrecipt from '../Receipt/htmlRecipt';
import PaymentPage from '../payment/PaymentPage'
import PaymentList from '../PaymentList/PaymentList'
import SavePayment from '../SavePayment/SavePayment';
import Dashbord from '../dashbord/dashbord';

import {
  PieChartOutlined,
  CalendarOutlined,
  DollarOutlined,
  IdcardOutlined,
  MedicineBoxOutlined,
  ReconciliationOutlined,
  ProfileOutlined,
  HddOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  to?: string,
): MenuItem {
  return {
    key,
    icon,
    children,
    label: to ? <Link to={to}>{label}</Link> : label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('หน้าแรก', '1', <PieChartOutlined />,undefined, '/dashbord'),
  getItem('จัดการประวัติ', '2', <IdcardOutlined />),
  getItem('นัดหมาย', '3', <CalendarOutlined />),
  getItem('การเงิน', 'sub1', <DollarOutlined />, 
  [ getItem('ชำระเงิน', '4',<DollarOutlined />,undefined, '/paymentList'),
    getItem('บันทึกการชำระเงิน','5',<HddOutlined />,undefined, '/savePayment')]),
  getItem('อุปกรณ์', '6', <MedicineBoxOutlined />), 
  getItem('รายการเบิก', '7', <ProfileOutlined />), 
  getItem('บันทึกการรักษา', '8', <ReconciliationOutlined />),
];

const Layoutpay: React.FC = () => {
  const [text, setText] = React.useState('http://localhost:5173/');//QRCODE
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
    <Layout style={{ minHeight: '100vh' } }>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ background: 'linear-gradient(180deg, #22225E, #42C2C2)'}}>
        <div className="demo-logo-vertical" />
        <div style={{ padding: '16px', color: '#fff', textAlign: 'center', fontSize: '11px', fontWeight: 'bold' }}>SAMGT PLEASANT</div>
        <Menu  style={{ background: 'inherit'  }} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} /> {/*background: 'inherit'  ไล่สีแบบสืบทอด */}
      </Sider>
      <Layout >
        <Header style={{background:'white'}}>
        </Header>
        <Content style={{background:'#f5f4f4'}}>
          <div style={{
              padding: 24,
              minHeight: 360,
              background: '#f5f4f4',
              borderRadius: borderRadiusLG,
            }}>
          <Routes>
          {/*<Route path="/Htmlrecipt" element={<Htmlrecipt/>} />*/}
            <Route path="/dashbord" element={<Dashbord />} />{/*แก้ตรงนี้วันที่11/9/67*/}
            <Route path="/paymentPage/:id" element={<PaymentPage />} />{/*แก้ตรงนี้วันที่11/9/67*/}
            <Route path="/paymentList" element={<PaymentList />} />
            <Route path="/buttonPay" element={<PaymentList />} />
            <Route path="/savePayment" element={<SavePayment />} />
          </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center',background:'white'}}>
        SAMGT PLEASANT ©{new Date().getFullYear()}<br/>
          <Space direction="vertical" align="center">
            <QRCode value={text || '-'} />
              <Input
                placeholder="-"
                maxLength={60}
                value={text}
                onChange={(e) => setText(e.target.value)}/>
          </Space>
        </Footer>
      </Layout>
    </Layout>
    </Router>
  );
};

export default Layoutpay;