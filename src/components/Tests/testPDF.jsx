import { useState } from 'react';
import "./Notify_Suc.scss";
import PDFFileProdcuts from "../PDFFiles/AllProdcuts";
import { saveAs } from 'file-saver';
import { toBlob } from 'pdfjs-dist/build/pdf';
import { PDFDownloadLink, Document, Page, PDFViewer, toStream } from '@react-pdf/renderer';
import Base64Downloader from 'common-base64-downloader-react';


const testPDF = () => {
  return (
    <div>
        <PDFFileProdcuts />
    </div>
  )
}

export default testPDF
