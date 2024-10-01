import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-party/Loadable";
import FullLayout from "../layout/FullLayout";


const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
//const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));
const Employee = Loadable(lazy(() => import("../pages/individual/employee")));
const CreateEmployee = Loadable(lazy(() => import("../pages/individual/employee/create")));
const EditEmployee = Loadable(lazy(() => import("../pages/individual/employee/edit")));

const Patient = Loadable(lazy(() => import("../pages/individual/patient")));
const CreatePatient = Loadable(lazy(() => import("../pages/individual/patient/create")));
const EditPatient = Loadable(lazy(() => import("../pages/individual/patient/edit")));

const ViewSchedule = Loadable(lazy(() => import("../pages/schedule/view/view")));
const ScheduleCreate = Loadable(lazy(() => import("../pages/schedule/create/create")));
const ScheduleEdit = Loadable(lazy(() => import("../pages/schedule/edit/edit")));
const ScheduleRecord = Loadable(lazy(() => import("../pages/schedule/record/record")));
//
//const DentalRecord = Loadable(lazy(() => import("../pages/Record/DentalRecord")));

//
const CreateEq = Loadable(lazy(() => import("../pages/storage/CreateEq/CreateEq")));
const AddEq = Loadable(lazy(() => import("../pages/storage/AddEq/AddEq")));
const EditEq= Loadable(lazy(() => import("../pages/storage/EditEq/EditEq")));
const Equipments = Loadable(lazy(() => import("../pages/storage/Equipments/Equipments")));
const LittleEq = Loadable(lazy(() => import("../pages/storage/LittleEq/LittleEq")));
const RequestEq = Loadable(lazy(() => import("../pages/storage/RequestEq/RequestEq")));
const Requisitions = Loadable(lazy(() => import("../pages/storage/Requisitions/Requisitions")));
const Restocks = Loadable(lazy(() => import("../pages/storage/Restocks/Restocks")));
//
const PaymentList = Loadable(lazy(() => import("../pages/payment/PaymentList/PaymentList")));
const PaymentPage = Loadable(lazy(() => import("../pages/payment/payment/PaymentPage")));
const SavePayment = Loadable(lazy(() => import("../pages/payment/SavePayment/SavePayment")));
//
const DentalRecord = Loadable(lazy(() => import("../pages/Record/DentalRecord")));
const AddDentalRecord = Loadable(lazy(() => import("../pages/Record/AddDentalRecord")));
const EditRecord = Loadable(lazy(() => import("../pages/Record/EditRecord")));
const DentalRecordDetails = Loadable(lazy(() => import("../pages/Record/DentalRecordDetails")));

//
const AdminRoutes = (isLoggedIn : boolean): RouteObject => {
  return {
    path: "/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      {
        path: "/",
        element: <MainPages />,
        //element: <div>test</div>,

      },
      {
        path: "/patient",
        children: [
          {
            path: "",
            element: <Patient />,
          },
          {
            path: "create",
            element: <CreatePatient />,
          },
          {
            path: "edit/:id",
            element: <EditPatient />,
          },
        ],
      },
      {
        path: "/employee",
        children: [
          {
            path: "employee",
            element: <Employee/>,
          },
          {
            path: "create",
            element: <CreateEmployee />,
          },
          {
            path: "edit/:id",
            element: <EditEmployee />,
          },
        ],
      },

      {
        path: "/viewschedule",
        children: [
          {
            path: "schedulecreate",
            element: <ScheduleCreate />,
          },
          {
            path: "editschedule/edit/:id",
            element: <ScheduleEdit />,
          },
          {
            path: "schedulerecord",
            element: <ScheduleRecord />,
          },
        ],
      },
      {
        path: "/DentalRecord",
        children: [
          {
            path: "",
            element: <ScheduleCreate />,
          },
          {
            path: "editschedule/edit/:id",
            element: <ScheduleEdit />,
          },
          {
            path: "DentalRecord",
            element: <DentalRecord />,
          },
        ],
      },
      // storage
      {
        path: "/Equipments",
        children: [
          {
            path: "AddEq",
            element: <AddEq />,
          },
          {
            path: "CreateEq",
            element: <CreateEq />,
          },
          {
            path: "EditEq",
            element: <EditEq />,
          },
          {
            path: "EditEq/:id",
            element: <EditEq />,
            children: [
              {
                path: "Equipments",
                element: <Equipments />,
              },
            ],
          },

          {
            path: "RequestEq",
            element: <RequestEq />,
          },
          {
            path: "RequestEq/:id",
            element: <RequestEq />,
          },
          {
            path: "LittleEq",
            element: <LittleEq />,
            children: [
              {
                path: "AddEq/:id",
                element: <AddEq />,
                children: [
                  {
                    path: "Equipments",
                    element: <Equipments />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/Requisitions",
      },
      {
        path: "/Restocks",
      },
      //
      {
        path:"/paymentList",
        children:[
            {
              path:"paymentPage/:id",
              element: <PaymentPage/>,
              // children:[
              //   {
              //     path:"savePayment",
              //     element:<SavePayment/>
              //   }
              // ],
            },
          ],
        },
        {
          path:"/savePayment",
        },
        {
          path: "/dentalrecord",
        },
        {
          path: "/AddDentalRecord",
          children: [
            {
              path: "AddDentalRecord", // ใช้ path นี้สำหรับเพิ่มบันทึก
              element: <AddDentalRecord />, // component สำหรับเพิ่มบันทึก
            }
          ],
        },
        {
          path: "/DentalRecordDetails/:id",
        },
        {
          path: "/EditRecord/:id",
          children: [
            {
              path: "EditRecord/:id", // ใช้ path นี้สำหรับแก้ไขบันทึก
              element: <EditRecord />, // component สำหรับแก้ไขบันทึก
            },
          ],
        },
       
      {
        path: "/",
      }

      
    ],
  };
};

export default AdminRoutes