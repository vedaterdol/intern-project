import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";



const GunSayisiOutput = () => {

    const gunSayisiOutput = useSelector((state) => state.gunSayisi.gunSayisiOutput);

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/', { replace: true })
        window.location.reload();
    };

    const handleGunSayisiExportExcel = () => {
    if (gunSayisiOutput && gunSayisiOutput.pdksİgsCountMap) {

      const worksheet1 = XLSX.utils.json_to_sheet(
        Object.entries(gunSayisiOutput.pdksİgsCountMap).map(([key, value]) => ({
          "İlgili Kişi": key,
          "PDKS-İGS Sayısı": value,
        }))
      );

      const worksheet2 = XLSX.utils.json_to_sheet(
        Object.entries(gunSayisiOutput.izYılMap).map(([key, value]) => ({
          "Kapsam İçi Yıllık İzin": key,
          "Gün Sayısı": value,
        }))
      );

    

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet1, "PDKS_IGS_Sayilari");
      XLSX.utils.book_append_sheet(workbook, worksheet2, "Kapsam_Ici_Yillik_Izin");
  

      XLSX.writeFile(workbook, "GunSayisiXlsxOutput.xlsx");
    }
    else {
      alert("You haven't uploaded any file yet!");
    }
  };

    return (
        <div>
            {gunSayisiOutput && gunSayisiOutput.pdksİgsCountMap && (
                <div>
                    <h2>İlgili kişi kaç gün PDKS kaydı oluşturmuş ve PDKS kaydı oluşmayan kayıt. (Kaynak PDKS):<hr></hr></h2>
                    <table>
                        <thead>
                            <tr>
                                <th>İlgili Kişi</th>
                                <th>PDKS-İGS Sayısı</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(gunSayisiOutput.pdksİgsCountMap).map(([key, value]) => (
                                <tr key={key}>
                                    <td style={{ color: value === 0 ? "red" : "green", fontWeight: value === 0 ? "bold" : "normal" }}>
                                        <strong>{key}</strong>
                                    </td>
                                    <td style={{ color: value === 0 ? "red" : "green", fontWeight: value === 0 ? "bold" : "normal" }}><strong>{value} gün</strong> (PDKS-İGS)</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

{gunSayisiOutput && gunSayisiOutput.izYılMap && (
  <div>
    <h2 style={{ color: "purple" }}>Kapsam içi yıllık izin kullanımı:</h2>
    <hr />
    <table>
      <thead>
        <tr>
          <th>Yıl</th>
          <th>Gün Sayısı</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(gunSayisiOutput.izYılMap).map(([key, value]) => (
          <tr style={{ color: "purple" }} key={key}>
            <td >
              <strong>{key}</strong>
            </td>
            <td>
              <strong>{value} gün</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

            <div>
                <button onClick={handleBackClick}>Geri</button>
                <button onClick={handleGunSayisiExportExcel}>Export as Excel</button>

            </div>


        </div>

    );
};

export default GunSayisiOutput;