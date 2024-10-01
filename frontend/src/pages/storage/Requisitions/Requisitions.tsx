import { useState, useEffect } from "react";
import { Table, Col, Row, Divider, message, DatePicker, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetRequisitionsDate, GetRequisitions } from "../../../services/https/storage/index";
import { RequisitionInterface } from "../../../interfaces/storage/IRequisition";
import "./Requisitions.css";
import new_logo from "../../../assets/stock/new_logo.png";
import requisitionss from "../../../assets/stock/requisitionss.jpg";
import moment, { Moment } from "moment";
import { SearchOutlined } from '@ant-design/icons';


function Requisition() {
  const [requisitions, setRequisitions] = useState<RequisitionInterface[]>([]);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<RequisitionInterface> = [
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
      dataIndex: "RequisitionQuantity",
      key: "requisition_quantity",
      align: 'center',
    },
    {
      title: "วันเวลาที่เบิก",
      dataIndex: "Time",
      key: "time",
      align: 'center',
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss') // Display both date and time
    },
    {
      title: "บันทึกช่วยจำ",
      dataIndex: "Note",
      key: "note",
      align: 'center',
    },
    {
      title: "ชื่อผู้ทำรายการ",
      dataIndex: "EmployeeName",
      key: "employee_name",
      align: 'center',
    },
  ];

  const getRequisitionsDate = async (date: string) => {
    try {
      const res = await GetRequisitionsDate(date);
      if (res.status === 200) {
        setRequisitions(res.data);
      } else {
        setRequisitions([]);
        messageApi.error("ไม่พบข้อมูล");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getRequisitions = async () => {
    try {
      const res = await GetRequisitions(); // Make sure this function is implemented in your service
      if (res.status === 200) {
        setRequisitions(res.data);
      } else {
        setRequisitions([]);
        messageApi.error("ไม่พบข้อมูล");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const handleSearch = () => {
    console.log('Value received from Select:', selectedDate);

    if (selectedDate) {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      getRequisitionsDate(formattedDate);
    } else {
      getRequisitions(); 
    }
  };

  useEffect(() => {
    getRequisitions(); 
  }, []);

  return (
    <>
      {contextHolder}
      <div className="logo-container">
        <img src={new_logo} alt="logo" className="logo1" />
      </div>

      <Row align="top">
        <Col>
          <div className="logo-icon">
            <img src={requisitionss} alt="logo" style={{ marginTop: '-38px', width: '108px', marginLeft: '0px' }} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={9} lg={9}>
          <h1 style={{ marginTop: '-12px' }}>รายการเบิก</h1>
        </Col>
        <Divider style={{ marginTop: '-35px', marginBottom: '30px' }} />
      </Row>

      <Row gutter={0} style={{ marginBottom: 18, marginTop: -15 }} className="custom-search">
        <Col span={1}></Col>
          <Col>
          <DatePicker
          format="YYYY-MM-DD"
          onChange={(value) => {
            setSelectedDate(value ? (value as Moment) : null);
          if (!value) {
            getRequisitions(); 
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

      <div style={{ marginTop: 1 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={requisitions}
          style={{ width: "91.5%", margin: "0 auto" }}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </>
  );
}

export default Requisition;