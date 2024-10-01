import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, Modal, message ,Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined,SearchOutlined,AuditOutlined   } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
// import { GetEmployees, DeleteEmployeeByID  } from "../../services/https";
// import { EmployeesInterface } from "../../interfaces/IEmployee";
import { GetEmployees, DeleteEmployeeByID  } from "../../../services/https/login";
import { EmployeesInterface } from "../../../interfaces/individual/IEmployee";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

//import logoSamgt from '../../../assets/logoSamgt.png';
import new_logo from "../../../assets/stock/new_logo.png";
const { Search } = Input;


function Employees() {
  
  const myId = localStorage.getItem("id");
  const columns: ColumnsType<EmployeesInterface> = [
    {
      title: "ชื่อ",
      dataIndex: "FirstName",
      key: "firstname",
      align: "center",
    },
    {
      title: "นามสกุล",
      dataIndex: "LastName",
      key: "lastname",
      align: "center",
    },
    {
      title: "เพศ",
      dataIndex: "Gender",
      key: "gender",
      align: "center",
      render: (gender) => Object.values(gender?.Sex),
    },// ? ไม่สนใจข้อมูล null
    {
      title: "ตำแหน่ง",
      dataIndex: "JobPosition",
      key: "่jobPosition",
      align: "center",
      render: (job) => Object.values(job?.Job),
      //render: (record) => <p>{dayjs(record).format("dddd DD MMM YYYY")}</p>,
    },
    {
      title: "อีเมล",
      dataIndex: "Email",
      key: "email",
      align: "center",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "Tel",
      key: "tel",
      align: "center",
      render: (tel) => {
        const formattedTel = `${tel.substring(0, 3)}-${tel.substring(3, 6)}-${tel.substring(6, 10)}`;
        return <p>{formattedTel}</p>;
      },
    },
   
    {
      title: "จัดการ",
      align: "center",
      // dataIndex: "Manage",
      // key: "manage",
      render: (record) => (
        <>
          <Button
            onClick={() => navigate(`/employee/edit/${record.ID}`)}
            shape="circle"
            icon={<EditOutlined />}
            size={"large"}
          />
          <Button
            onClick={() => {
              if (record) {
                showModal(record);
              } else {
                console.error("Invalid record");
              }
            }}
            //onClick={() => showModal(record)}
            //onClick={() => DeleteEmployeeByID(record.Employee.ID)}
            style={{ marginLeft: 10 }}
            shape="circle"
            icon={<DeleteOutlined />}
            size={"large"}
            danger
          />
        </>
      ),
    },
  ];

  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeesInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  // Model
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //const [modalText, setModalText] = useState<String>();
  const [modalText, setModalText] = useState<string>("");

  const [deleteId, setDeleteId] = useState<Number>();

  const [searchText, setSearchText] = useState<string>("");

  const [filteredEmployees, setFilteredEmployees] = useState<EmployeesInterface[]>([]);

  const getEmployees = async () => {
    let res = await GetEmployees();
    if (res) {
      //console.log(res)
      setEmployees(res);//เพื่อให้ค้นตัวใหม่ได้
      setFilteredEmployees(res);
    }
  };

  const handleSearch = (value: string) => {
    const currValue = value.toLowerCase();
    setSearchText(currValue);
    // const filteredData = employees.filter(entry =>
    //   entry?.Tel?.includes(currValue)
    // );
    const filteredData = employees.filter(entry => {
      const nameMatch = entry?.FirstName?.toLowerCase().includes(currValue);
      const lastnameMatch = entry?.LastName?.toLowerCase().includes(currValue);
      const telMatch = entry?.Tel?.includes(currValue);
      return nameMatch || telMatch || lastnameMatch;
    });
    // setEmployees(filteredData);
    setFilteredEmployees(filteredData)
  };

  // const filteredEmployees = employees.filter(employee =>
  //   employee.Tel?.toLowerCase().includes(searchText)
  // );

  const showModal = (val: EmployeesInterface) => {
    setModalText(
      `คุณต้องการลบข้อมูลผู้ใช้ "${val.FirstName} ${val.LastName}" หรือไม่ ?`
    );
    // if (!val || !val.FirstName || !val.LastName) {
    //   console.error("Invalid data:", val);
    //   return;
    // }
    // console.log("ข้อความในโมเดล:", modalText);
    setDeleteId(val.ID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    let res = await DeleteEmployeeByID(deleteId);
    if (res) {
      setOpen(false);
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลสำเร็จ",
      });
      getEmployees();
    } else {
      setOpen(false);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={new_logo} alt="logo" className="logo1" />
      </div>
      <Row>
        
        <Col span={12}>
          <h2><AuditOutlined /> จัดการประวัติพนักงาน</h2>
      
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/employee/create">
              <Button type="primary" icon={<PlusOutlined />}>
                เพิ่มพนักงาน
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Search
            placeholder="ค้นหาด้วยชื่อหรือเบอร์โทร"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300, marginBottom: 20 }}
          />
        </Col>
      </Row>
      <div style={{ marginTop: 20 }}>
        <Table rowKey="ID" columns={columns} dataSource={filteredEmployees} />
      </div>
      <Modal
        title="ลบข้อมูล ?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default Employees;
