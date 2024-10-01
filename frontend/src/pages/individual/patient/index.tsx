import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, Modal, message ,Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined,SearchOutlined,AuditOutlined   } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetPatients, DeletePatientByID  } from "../../../services/https/individual/index";
import { PatientsInterface } from "../../../interfaces/individual/IPatient";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import new_logo from "../../../assets/stock/new_logo.png";
import logoSamgt from '../../../assets/logoSamgt.png';

const { Search } = Input;
// const employee :EmployeesInterface[] = []

function Patients() {
  
  const myId = localStorage.getItem("id");
  const columns: ColumnsType<PatientsInterface> = [
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
    },
    // ? ไม่สนใจข้อมูล null
    // {
    //   title: "ตำแหน่ง",
    //   dataIndex: "JobPosition",
    //   key: "่jobPosition",
    //   render: (job) => Object.values(job?.Job),
    //   //render: (record) => <p>{dayjs(record).format("dddd DD MMM YYYY")}</p>,
    // },
 
    // {
    //   title: "วันเกิด",
    //   dataIndex: "Birthday",
    //   key: "birthday",
    //   render: (record) => <p>{dayjs(record).format("dddd DD MMM YYYY")}</p>,
    // },// record ใช้ record.gender?.Sex
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
      title: "หมู่เลือด",
      dataIndex: "BloodType",
      key: "bloodType",
      align: "center",
      render: (BloodType) => Object.values(BloodType?.BloodGroup),
    },
    {
      title: "แพ้ยา",
      dataIndex: "DrugAllergy",
      key: "drugAllergy",
      align: "center",
    },
   
    {
      title: "โรคประจำตัว",
      dataIndex: "Chronicdisease",
      key: "chronicdisease",
      align: "center",
      
    },
   
   
    {
      title: "จัดการ",
      align: "center",
      // dataIndex: "Manage",
      // key: "manage",
      render: (record) => (
        <>
          <Button
            onClick={() => navigate(`/patient/edit/${record.ID}`)}
            shape="circle"
            icon={<EditOutlined />}
            size={"large"}
          />
          {/* <Button
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
          /> */}
        </>
      ),
       //
      //  render: (record) => (
      //   <>
      //     {myId == record?.ID ? (
      //       <></>
      //     ) : (
      //       <Button
      //         type="dashed"
      //         danger
      //         shape="circle"
      //         icon={<DeleteOutlined />}
      //         onClick={() => DeleteEmployeeByID(record.ID)}
              
      //       ></Button>
      //     )}
      //   </>
      // ),
       //
    },
  ];

  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientsInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Model
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //const [modalText, setModalText] = useState<String>();
  const [modalText, setModalText] = useState<string>("");

  const [deleteId, setDeleteId] = useState<Number>();

  const [searchText, setSearchText] = useState<string>("");

  const [filteredPatients, setFilteredPatients] = useState<PatientsInterface[]>([]);

  
  const getPatients = async () => {
    let res = await GetPatients();
    if (res) {
      //console.log(res)
      setPatients(res);
      setFilteredPatients(res);
    }
  };

  const handleSearch = (value: string) => {
    const currValue = value.toLowerCase();
    setSearchText(currValue);
    const filteredData = patients.filter(entry => {
      const nameMatch = entry?.FirstName?.toLowerCase().includes(currValue);
      const lastnameMatch = entry?.LastName?.toLowerCase().includes(currValue);
      const telMatch = entry?.Tel?.includes(currValue);
      return nameMatch || telMatch || lastnameMatch;
    });
    //setEmployees(filteredData);
    setFilteredPatients(filteredData)
  };

  // const filteredPatients = patients.filter(patient =>
  //   patient.Tel?.toLowerCase().includes(searchText)
  // );

  const showModal = (val: PatientsInterface) => {
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
    let res = await DeletePatientByID(deleteId);
    if (res) {
      setOpen(false);
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลสำเร็จ",
      });
      getPatients();
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
    getPatients();
  }, []);

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={new_logo} alt="logo" className="logo1" />
      </div>
      <Row>
        
        <Col span={12}>
          <h2><AuditOutlined /> จัดการประวัติคนไข้</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/patient/create">
              <Button type="primary" icon={<PlusOutlined />}>
                เพิ่มคนไข้
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
        <Table rowKey="ID" columns={columns} dataSource={filteredPatients} />
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

export default Patients;
