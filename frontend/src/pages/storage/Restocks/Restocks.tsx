import { useState, useEffect } from "react";
import { Table, Col, Row, Divider, message, Modal, DatePicker, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetRestocksDate,GetRestocks } from "../../../services/https/storage/index";
import "./Restocks.css";
import { RestockInterface } from "../../../interfaces/storage/IRestock";
import new_logo from "../../../assets/stock/new_logo.png";
import restocks from "../../../assets/stock/restocks.jpg";
import moment, { Moment } from "moment";
import { SearchOutlined } from '@ant-design/icons';

function Restocks() {
  
  const [Restocks, setRestocks] = useState<RestockInterface[]>([]);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [messageApi] = message.useMessage();

  const [modal, contextHolder] = Modal.useModal();

  const columns: ColumnsType<RestockInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
      align: 'center',
    },
    {
      title: "ชื่ออุปกรณ์",
      dataIndex: "EquipmentName",
      key: "equipment_name",
      align: 'center',
    },
    {
      title: "จำนวน",
      dataIndex: "RestockQuantity",
      key: "restock_quantity",
      align: 'center',
    },
    {
      title: "รับเข้า",
      dataIndex: "ReceivingDate",
      key: "receiving_date",
      align: 'center',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss') // Display both date and time
    },
    {
      title: "ชื่อผู้ทำรายการ",
      dataIndex: "EmployeeName",
      key: "employee_name",
      align: 'center',
    },
  ];

  const getRestocksDate = async (date: string) => {
    try {
      const res = await GetRestocksDate(date);
      if (res.status === 200) {
        setRestocks(res.data);
      } else {
        setRestocks([]);
        messageApi.error("ไม่พบข้อมูล");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };


  const getRestocks = async () => {
    try {
      let res = await GetRestocks();
      if (res.status === 200) {
        setRestocks(res.data);
      } else {
        setRestocks([]);
        messageApi.open({
          type: "error",
          content: res.data.error || "Error fetching data",
        });
      }
    } catch (error: any) {  // แปลง error เป็น any เพื่อให้เข้าถึง property ต่างๆ
      console.error("Error fetching equipment:", error);
      
      messageApi.open({
        type: "error",
        content: error?.message || error?.response?.data?.error || "Unexpected error occurred",
      });
    }
  };
  

  const handleSearch = () => {
    console.log('Value received from Select:', selectedDate);

    if (selectedDate) {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      getRestocksDate(formattedDate);
    } else {
      getRestocks();
    }
  };

  useEffect(() => {
    getRestocks();
  }, []);


  return (
    <>
      {contextHolder}
      <div className="logo-container">
          <img
            src={new_logo}
            alt="logo"
            className="logo1"
          />
      </div>

      <Row align="top">
        <Col>
          <div className="logo-icon">
            <img src={restocks} alt="logo" style={{ marginTop: '-35px', width: '108px', marginLeft: '0px'}} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={9} lg={9}>
          <h1 style={{ marginTop: '-12px'}}>รายการเติมสำเร็จ</h1>
        </Col>
        <Divider style={{ marginTop: '-32px', marginBottom: '30px' }}  />
      </Row>


      <Row gutter={0} style={{ marginBottom: 16, marginTop: -10 }} className="custom-search">
        <Col span={1}></Col>
          <Col>
          <DatePicker
          format="YYYY-MM-DD"
          onChange={(value) => {
            setSelectedDate(value ? (value as Moment) : null);
          if (!value) {
            getRestocks(); 
          }
          }}
            placeholder="เลือกวันที่"
          />

          </Col>
          <Col>
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
            style={{ width: 40 }} 
          />
          </Col>
        </Row>


      <Row style={{ marginBottom: 1 }}>
        <Col span={24} style={{ textAlign: "end", alignSelf: "center" }}>
        </Col>
      </Row>

      <div style={{ marginTop: 1 }}>
        <Table rowKey="ID" columns={columns} dataSource={Restocks} style={{ width: "91.5%", margin: "0 auto" }} 
        pagination={{ pageSize: 5 }} 
        />
      </div>
    </>
  );
}

export default Restocks;