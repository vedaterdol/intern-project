import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";




const PdksIstOutput = () => {

  const pdksIstOutput = useSelector((state) => state.pdksIst.pdksIstOutput);
  const navigate = useNavigate();


  const handleBackClick = () => {
    navigate('/', { replace: true })
    window.location.reload();

  };

  const handlePdksIstExportExcel = () => {
    if (pdksIstOutput && pdksIstOutput.toplamGunMap) {
      const worksheet1 = XLSX.utils.json_to_sheet(
        Object.entries(pdksIstOutput.toplamGunMap).map(([key, value]) => ({
          "İlgili Kişi": key,
          "Toplam Gün Sayısı": value[0],
          "Gelinen Tarihler": value[1].join(', '),
        }))
      );
  
      const worksheet2 = XLSX.utils.json_to_sheet(
        Object.entries(pdksIstOutput.incorrectTimeList).map(([key, value]) => ({
          "Kişi": key,
          "Tarih": value[0],
          "Geçirilen Süre": `${value[1]} dakika (10 saat = 600 dakika)`,
        }))
      );
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet1, "Toplam_Gun_Sayisi_Ve_Tarihler");
      XLSX.utils.book_append_sheet(workbook, worksheet2, "Hatalar");
      XLSX.writeFile(workbook, "PDKSIstXlsxOutput.xlsx");
    } else {
      alert("You haven't uploaded any file yet!");
    }
  };


  return (
    <div>
      {pdksIstOutput && pdksIstOutput.toplamGunMap && (
        <div>
          <h2>PERSONEL TOPLAM GÜN VE TARİH TABLOSU:</h2>
          <table>
            <thead>
              <tr>
                <th>İlgili Kişi</th>
                <th>Toplam Gün Sayısı</th>
                <th>Gelinen Tarihler</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pdksIstOutput.toplamGunMap).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value[0]}</td>
                  <td>{value[1].join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pdksIstOutput && pdksIstOutput.incorrectTimeList && (
        <div>
          <h2>HATALI KAYIT TABLOSU:</h2>
          <table>
            <thead>
              <tr>
                <th>İlgili Kişi</th>
                <th>Tarih</th>
                <th>Geçirilen Süre</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pdksIstOutput.incorrectTimeList).map(
                ([key, value]) => (
                  <tr style={{ color: 'red' }} key={key}>
                    <td>{key}</td>
                    <td>{value[0]}</td>
                    <td >{value[1]} dakika (10 saat = 600 dakika)</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}


      <div>
        <button onClick={handleBackClick}>Geri</button>
        <button onClick={handlePdksIstExportExcel}>Export as Excel</button>

      </div>

    </div>
  );
};

export default PdksIstOutput;