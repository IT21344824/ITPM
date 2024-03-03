import { useState } from 'react';
import "./Notify_Suc.scss";
import PDFFileProdcuts from "../PDFFiles/ProdcutsPdf";
import { saveAs } from 'file-saver';
import { toBlob } from 'pdfjs-dist/build/pdf';
import { PDFDownloadLink, Document, Page, PDFViewer, toStream } from '@react-pdf/renderer';
import Base64Downloader from 'common-base64-downloader-react';

const Button_test = () => {
  const [isDownloading, setIsDownloading] = useState(false);


  //----------------------------
  const handleDownload = async () => {
    setIsDownloading(true);

    const pdfBlob = await generatePDF(); // Generate the PDF and get a Blob
    saveAs(pdfBlob, 'PDFFileProdcuts.pdf'); // Save the Blob as a file

    setIsDownloading(false);
  };

  const generatePDF = async () => {
    // Generate the PDF using @react-pdf/renderer
    const pdfBlob = await new Promise((resolve) => {
      const doc = (
        <PDFFileProdcuts />
      );

      const pdfStream = doc.toStream();
      const chunks = [];
      pdfStream.on('data', (chunk) => chunks.push(chunk));
      pdfStream.on('end', () => {
        const pdfBlob = new Blob(chunks, { type: 'application/pdf' });
        resolve(pdfBlob);
      });
    });

    return pdfBlob;
  };

  return (
    <div className='button_test'>
      <div className="btn_body">
        <button onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? 'Downloading...' : 'Save'}
        </button>
        <PDFDownloadLink document={<PDFFileProdcuts />} filename="FORM">
          {({ loading }) => (loading ? <button>Loading Document...</button> : <button>Download</button>)}
        </PDFDownloadLink>

      </div>
    </div>
  );
};

export default Button_test;
