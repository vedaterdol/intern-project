import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";




const PdksTable = () => {

  const pdksOutput = useSelector((state) => state.pdks.pdksOutput);
  const navigate = useNavigate();


  const handleBackClick = () => {
    navigate('/', { replace: true })
    window.location.reload();
  };

  const handlePdksExportExcel = () => {
    if (pdksOutput && pdksOutput.pdksVeGunSayisi) {
      const worksheet1 = XLSX.utils.json_to_sheet(
        Object.entries(pdksOutput.pdksVeGunSayisi).map(([key, value]) => ({
          "İlgili Kişi": key,
          "Gün Sayısı": value / 2,
        }))
      );

      const worksheet2 = XLSX.utils.json_to_sheet(
        Object.entries(pdksOutput.duplicationCheckMap).map(([key, value]) => ({
          "Kişi": key,
          "Hata": value,
        }))
      );

      const worksheet3 = XLSX.utils.json_to_sheet(
        Object.entries(pdksOutput.mukerrerlikMap).map(([key, value]) => ({
          "Kişi": key,
          "Hata": value,
        }))
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet1, "PDKS_Sonuclari");
      XLSX.utils.book_append_sheet(workbook, worksheet2, "Duplication_Hatalari");
      XLSX.utils.book_append_sheet(workbook, worksheet3, "Mukerrerlik");
      XLSX.writeFile(workbook, "PDKSXlsxOutput.xlsx");
    }
    else {
      alert("You haven't uploaded any file yet!");
    }
  };


  return (
    <div>

      {pdksOutput && pdksOutput.pdksVeGunSayisi && (
        <div>
          <h2>İlgili kişi kaç gün PDKS kaydı oluşturmuş. (Kaynak PDKS):</h2>
          <table>
            <thead>
              <tr>
                <th>İlgili Kişi</th>
                <th>Gün Sayısı</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pdksOutput.pdksVeGunSayisi).map(([key, value]) => (
                <tr key={key}>
                  <td style={{ color: Number.isInteger(value / 2) ? 'green' : 'red' }}><strong>{key}</strong></td>
                  <td style={{ color: Number.isInteger(value / 2) ? 'green' : 'red' }}>
                    <strong>{value / 2} gün</strong> ({value} PDKS)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}



      <h2 style={{ color: 'red' }}>PDKS kayıtlarında Girişi Çıkış hatası (Kaynak PDKS)</h2>
      {pdksOutput && pdksOutput.mukerrerlikMap && (
        <table>
          <thead>
            <tr>
              <th>İlgili Kişi</th>
              <th>Tarih</th>
              <th>Problemin Tanımı</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(pdksOutput.mukerrerlikMap).map(([key, value]) => (
              <tr style={{ color: 'red' }} key={key}>
                <td >
                  <strong>{key}</strong>
                </td>
                <td>{value}</td>
                <td>[G or C] x2 Duplication!</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <button onClick={handleBackClick}>Geri</button>
        <button onClick={handlePdksExportExcel}>Export as Excel</button>

      </div>

    </div>
  );
};

export default PdksTable;