import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// import { ReceiptInterface } from '../../interfaces/interfaceReceipt';
// import { GetReceiptByID } from '../../services/https';
// import { useState, useEffect  } from 'react';
// import { Modal,message  } from 'antd';
// ----------------------------------------------------
// import { PaymentDentalRecordInterface } from '../../interfaces/interfacePaymentDentalRecoed';
// import { ReceiptInterface } from '../../interfaces/interfaceReceipt';
import { PaymentDentalRecordInterface } from '../../../interfaces/payment/IPaymentDentalRecord';
import { ReceiptInterface } from '../../../interfaces/payment/IReceipt';
// ---------------------------------------------------

export const generatePDF = async ( payment: PaymentDentalRecordInterface ,receipt:ReceiptInterface) => {

  // const name = "l6ou"
  // const RID = ID
    const doc = new jsPDF({
        orientation: 'portrait', // กำหนดทิศทางของเอกสารเป็นแนวตั้ง (หรือแนวนอนก็ได้)
        unit: 'mm', // หน่วยเป็นมิลลิเมตร
        format: [148, 210], // ขนาดกำหนดเอง กว้าง 148 mm สูง 210 mm (A5)
    });

    try {
      // โหลดฟอนต์ปกติ (THSarabunNew.ttf)
      const fontUrl = '/THSarabunNew.ttf';
      const fontResponse = await fetch(fontUrl);

      if (!fontResponse.ok) {
          throw new Error(`HTTP error! status: ${fontResponse.status}`);
      }

      const fontData = await fontResponse.arrayBuffer();
      const fontBase64 = arrayBufferToBase64(fontData);
      doc.addFileToVFS('THSarabunNew.ttf', fontBase64);
      doc.addFont('THSarabunNew.ttf', 'THSarabun', 'normal');

      // โหลดฟอนต์ตัวหนา (THSarabunNew-Bold.ttf)
      const fontBoldUrl = '/THSarabunNew Bold.ttf';
      const fontBoldResponse = await fetch(fontBoldUrl);

      if (!fontBoldResponse.ok) {
          throw new Error(`HTTP error! status: ${fontBoldResponse.status}`);
      }

      const fontBoldData = await fontBoldResponse.arrayBuffer();
      const fontBoldBase64 = arrayBufferToBase64(fontBoldData);
      doc.addFileToVFS('THSarabunNew-Bold.ttf', fontBoldBase64);
      doc.addFont('THSarabunNew-Bold.ttf', 'THSarabun', 'bold');

     

        // โลโก้
        // const imgData = '/logo.jpg'; // URL จากpublic
        const imgData = '/logo.jpg'; // URL จากpublic
        doc.addImage(imgData, 'JPG', 8,5, 15, 10);
        doc.setFontSize(8);
        // ที่อยู่บริษัท
        doc.setFont('THSarabun', 'normal');
        doc.text('111, ถนน มหาวิทยาลัย ตำบล สุรนารี อำเภอเมืองนครราชสีมา นครราชสีมา 30000',5,18);
        
        // หัวเรื่อง ใบเสร็จรับเงิน
        doc.setFont('THSarabun', 'bold');
        doc.setFontSize(30);
        doc.text('ใบเสร็จรับเงิน',140,15, { align: 'right' });
        doc.line(100,16,140,16);
        //เราใช้ doc.line(x1, y1, x2, y2) เพื่อวาดเส้นใต้ โดย
        // x1, y1: ตำแหน่งเริ่มต้นของเส้น
        // x2, y2: ตำแหน่งสิ้นสุดของเส้น

        // วันที่
        doc.setFont('THSarabun', 'normal');
        doc.setFontSize(12);
        doc.text(`วันที่ ${payment.Date2}`, 135, 35, { align: 'right' });
        doc.setDrawColor(128, 128, 128); 
        doc.line(120,36,135,36);
        //doc.text('2025-08-02', 135, 35, { align: 'right' });

        const textWidthPatient = doc.getTextWidth(` ${payment.FirstName} ${payment.LastName}`);  // ตำแหน่งชิดขวาที่กำหนด
        doc.setFontSize(12);
        doc.setDrawColor(128, 128, 128);
        doc.line(16.5,36,textWidthPatient+16.5,36);
        // ข้อมูลลูกค้า
        doc.text(`ชื่อ: ${payment.FirstName} ${payment.LastName}`,12, 35);
        //doc.text(name + " "+'สุขขี', 15, 35);

        (doc as any).autoTable({
            startY: 40,
            //head: [['ลำดับ', 'รายการ', 'จำนวนเงิน']],
            body: [
              ['รายการ', 'จำนวนเงิน'],
     
  
            ],
            styles: {
                font: 'THSarabun',
                fontStyle: 'bold',
                fontSize: 10.5,
            },
            /*headStyles: {
              halign: 'center', // ทำให้ข้อความในหัวตารางทั้งหมดชิดขวา
          },*/
            columnStyles: {
            //0: { cellWidth: 15 }, // Width for the first column (ลำดับ)
            0: { cellWidth: 90, overflow: 'linebreak',halign: 'center' }, // Width for the second column (รายการ), with line wrapping
            1: { cellWidth:15, halign: 'center' }, // Width for the third column (จำนวนเงิน), right-aligned
            },
            theme: 'plain',
            tableLineWidth: 0.1,
            tableLineColor: [0, 0, 0],
        });

        // ตาราง
        (doc as any).autoTable({
          startY: 40,
          //head: [['ลำดับ', 'รายการ', 'จำนวนเงิน']],
          body: [
            ['',''],
            [`${payment.TreatmentName}`, `${payment.PrintFees}`],
            [ '', ''],
            ['', ''],
          ],
          styles: {
              font: 'THSarabun',
              fontSize: 10,
          },
          /*headStyles: {
            halign: 'center', // ทำให้ข้อความในหัวตารางทั้งหมดชิดขวา
        },*/
          columnStyles: {
            //0: { cellWidth: 15 }, // Width for the first column (ลำดับ)
            0: { cellWidth: 90, overflow: 'linebreak',halign: 'center' }, // Width for the second column (รายการ), with line wrapping
            1: { cellWidth: 15, halign: 'center' }, // Width for the third column (จำนวนเงิน), right-aligned
              //0: { fontSize: 14, },

          },
        //   plain
          theme: 'plain',
          tableLineWidth: 0.2,
          tableLineColor: [0, 0, 0],
      });
      const secondTableY = (doc as any).lastAutoTable.finalY;
      // วัดความยาวของข้อความ `payment.PrintFees`
        const textWidth = doc.getTextWidth(` ${payment.PrintFees} บาท`);

        // ขนาดรวมของคอลัมน์ที่ 2 และ 3
        const totalWidth = 105; // ขนาดความกว้างรวมของคอลัมน์ที่ 2 และ 3
        const column3Width = Math.max(25, textWidth + 5); // ขนาดขั้นต่ำ 30 มม. และขยายตามข้อความ
        const column2Width = totalWidth - column3Width; // ลดขนาดคอลัมน์ที่ 2 ตามขนาดคอลัมน์ที่ 3

        // ป้องกันไม่ให้คอลัมน์ที่ 3 ขยายไปทางขวา
        const maxColumn3Width = totalWidth; // คอลัมน์ที่ 3 จะไม่ขยายเกินขอบเขตนี้
        const adjustedColumn3Width = Math.min(column3Width, maxColumn3Width);

        (doc as any).autoTable({
            startY: secondTableY + 0.2,
            body: [
                ['', 'รวมเป็นเงิน', ` ${payment.PrintFees} บาท`],
            ],
            styles: {
                fontStyle: 'bold',
                font: 'THSarabun',
                fontSize: 12,
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'right', tableLineWidth: 0 },
                1: { 
                    cellWidth: column2Width, // ลดขนาดคอลัมน์ที่ 2 เพื่อให้คอลัมน์ที่ 3 ขยายได้
                    halign: 'right', 
                    overflow: 'linebreak', 
                    tableLineWidth: 0 
                },
                2: { 
                    cellWidth: adjustedColumn3Width, // ขยายคอลัมน์ที่ 3 ไปทางซ้าย ไม่ให้เกินขอบขวา
                    halign: 'right', 
                    overflow: 'visible',  // ข้อความจะไม่ถูกตัด
                    fillColor: [230, 230, 250] 
                },
            },
            theme: 'plain',
            tableLineWidth: 0,
        });

    // // วาดเส้นใต้ในตาราง
    //     const finalY = (doc as any).lastAutoTable.finalY;
    //     const startX = 10; // ตำแหน่งเริ่มต้นของเส้น X
    //     const endX = 190; // ตำแหน่งสิ้นสุดของเส้น X
    //     const yPosition = finalY + 10; // ตำแหน่ง Y ของเส้นใต้

    //     // วาดเส้นใต้
    //     doc.line(startX, yPosition, endX, yPosition);
        // doc.setFontSize(17);
        // doc.text('รวมเป็นเงิน', 155, 236);
        // doc.text('18000.00', 195, 236, { align: 'right' });

        // ข้อมูลเพิ่มเติมและลายเซ็น
        const textWidthDoctor = doc.getTextWidth(` ${payment.Efirstname} ${payment.Elastname}`);
        const textWidthEmployee = doc.getTextWidth(` ${receipt.Pefirst_name} ${receipt.Pelast_name}`);
        const rightAlignX = 12;  // ตำแหน่งชิดขวาที่กำหนด
        doc.setFontSize(12);
        doc.setDrawColor(128, 128, 128); 
        // วาดเส้นที่มีสีที่กำหนด
        doc.line(25.5, secondTableY + 21,textWidthDoctor+25.5, secondTableY + 21);


        // เติมข้อมูลทันตแพทย์และจัดให้อยู่ชิดขวา
        doc.text(`ทันตแพทย์: ${payment.Efirstname} ${payment.Elastname}`, rightAlignX, secondTableY + 20, { align: 'left' });
        doc.line(22, secondTableY + 31,textWidthEmployee+22, secondTableY + 31);
        // เติมข้อมูลผู้รับเงินและจัดให้อยู่ชิดขวาเช่นกัน
        doc.text(`ผู้รับเงิน: ${receipt.Pefirst_name} ${receipt.Pelast_name}`, rightAlignX, secondTableY + 30, { align: 'left' });





        // เปิด PDF ในแท็บใหม่
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error loading font:', error);
    }
};

// ฟังก์ชันเพื่อแปลง ArrayBuffer เป็น Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

const Receipt: React.FC = () => {
  
    return (
        <div>
            {/* <h1>Receipt</h1>
            <button onClick={generatePDF}>Generate PDF</button> */}
        </div>
    );
};

export default Receipt;
