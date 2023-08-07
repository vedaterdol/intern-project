import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";


const ExcelComparison = () => {


    const gunSayisiOutput = useSelector((state) => state.gunSayisi.gunSayisiOutput);
    const pdksOutput = useSelector((state) => state.pdks.pdksOutput);

    const navigate = useNavigate();

    function findAbsentPersonnel(obj1, obj2) {
        return [
            ...Object.keys(obj2).filter((key) => !obj1.hasOwnProperty(key)),
        ];
    }

    function findDifferenceInPDKS(obj1, obj2) {
        const differentKeysAndValues = [];

        for (const key in obj1) {
            const value1 = obj1[key];
            const value2 = obj2[key];

            if (!obj2.hasOwnProperty(key) || value1 / 2 !== value2) {
                differentKeysAndValues.push({
                    key,
                    value1,
                    value2,
                });
            }
        }

        for (const key in obj2) {
            const value1 = obj1[key];
            const value2 = obj2[key];

            if (!obj1.hasOwnProperty(key) && value1 !== value2 * 2) {
                differentKeysAndValues.push({
                    key,
                    value1,
                    value2,
                });
            }
        }

        return differentKeysAndValues;
    }


    const absentPersonnel = pdksOutput && gunSayisiOutput
        ? findAbsentPersonnel(pdksOutput.pdksVeGunSayisi, gunSayisiOutput.pdksİgsCountMap)
        : [];




    const differenceInPDKS = pdksOutput && gunSayisiOutput
        ? findDifferenceInPDKS(pdksOutput.pdksVeGunSayisi, gunSayisiOutput.pdksİgsCountMap)
        : [];



    const handleBackClick = () => {
        navigate('/', { replace: true })
        window.location.reload();
    };

    const handleExcel = () => {
        if (gunSayisiOutput && gunSayisiOutput.pdksİgsCountMap) {
    
         
          const worksheet1 = XLSX.utils.json_to_sheet(
            absentPersonnel.map((key) => ({
              "PDKS.xlsx Excelinde Bulunmayan Kişi": key,
            }))
          );
    
          const worksheet2 = XLSX.utils.json_to_sheet(
            differenceInPDKS
              .filter((item) => !isNaN(item.value1 / 2))
              .map((item) => ({
                "Kişi": item.key,
                "PDKS.xlsx Gün Sayısı": item.value1 / 2,
                "GunSayisi.xlsx Gün Sayısı": item.value2,
              }))
          );
    
          const workbook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(workbook, worksheet1, "Bulunmayan_Kisiler");
          XLSX.utils.book_append_sheet(workbook, worksheet2, "Farkli_Gun_Sayisi");
    
          XLSX.writeFile(workbook, "ExcelComparisonOutput.xlsx");
        }
        else {
          alert("You haven't uploaded any file yet!");
        }
      };

    return (
        <div>
            {pdksOutput && gunSayisiOutput && (
                <div>
                    <h2 style={{ color: "blue" }}>PDKS.xlsx excelinde bulunmayan kişiler:<hr /></h2>
                    <ul>
                        {absentPersonnel.map((key) => (
                            <li style={{ color: "blue" }} key={key}><strong>{key}</strong></li>
                        ))}
                    </ul>
                </div>
            )}

{pdksOutput && gunSayisiOutput && (
  <div>
    <h2 style={{ color: "red" }}>
      2 Excel arasında PDKS/Gün sayısında farklılık olan kişiler:
    </h2>
    <hr />
    <table>
      <thead>
        <tr>
          <th>Kişi</th>
          <th>PDKS.xlsx</th>
          <th>GunSayisi.xlsx</th>
        </tr>
      </thead>
      <tbody>
        {differenceInPDKS.map((item) => (
          isNaN(item.value1 / 2) ? null : (
            <tr style={{ color: "red" }} key={item.key}>
              <td>
                <strong>{item.key}</strong>
              </td>
              <td>{item.value1 / 2} gün</td>
              <td>{item.value2} gün</td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  </div>
)}
            <div>
                <button onClick={handleBackClick}>Geri</button>
                <button onClick={handleExcel}>Export as Excel</button>

            </div>
        </div>

    );
};

export default ExcelComparison;