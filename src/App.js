import React from 'react';
import FileUpload from './components/FileUpload';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PdksOutput from './components/PdksOutput';
import GunSayisiOutput from './components/GunSayisiOutput';
import ExcelComparison from './components/ExcelComparison';
import PdksIstOutput from './components/PdksIstOutput';
import ExcelComparisonIst from './components/ExcelComparisonIst';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/pdksOutput" element={<PdksOutput />} />
        <Route path="/gunSayisiOutput" element={<GunSayisiOutput />} />
        <Route path="/excelComparison" element={<ExcelComparison />} />
        <Route path="/pdksIstOutput" element={<PdksIstOutput />} />
        <Route path="/excelComparisonIst" element={<ExcelComparisonIst />} />




      </Routes>
    </BrowserRouter>
  );
};

export default App;
