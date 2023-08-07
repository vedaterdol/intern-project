package com.example.internproject;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PDKSService {

    public Map<String, Object> processFile(MultipartFile pdksXlsx) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> responseChildObjects = new HashMap();


        try {
            Workbook pdksWorkbook = WorkbookFactory.create(pdksXlsx.getInputStream());
            List<List<String>> PdksList = new ArrayList<>();
            Sheet pdksWorkbookSheet = pdksWorkbook.getSheetAt(0);
            int startRowIndex = 6; // 7. satırın indeksi (0'dan başlayarak)
            int lastRowNum = pdksWorkbookSheet.getLastRowNum();
            for (int rowIndex = startRowIndex; rowIndex <= lastRowNum; rowIndex++) {
                Row row = pdksWorkbookSheet.getRow(rowIndex);
                if (row != null) {
                    List<String> rowData = new ArrayList<>();
                    int startColumnIndex = 2; // 3. sütunun indeksi (0'dan başlayarak)
                    int lastCellNum = row.getLastCellNum();
                    for (int cellIndex = startColumnIndex; cellIndex < lastCellNum; cellIndex++) {
                        Cell cell = row.getCell(cellIndex, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
                        String cellValue = "";
                        if (cell != null) {
                            CellType cellType = cell.getCellType();
                            if (cellType == CellType.NUMERIC) {
                                if (DateUtil.isCellDateFormatted(cell)) {
                                    Date date = cell.getDateCellValue();
                                    LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

                                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
                                    cellValue = localDate.format(formatter);
                                } else {
                                    cellValue = String.valueOf(cell.getNumericCellValue());
                                }
                            } else if (cellType == CellType.STRING) {
                                cellValue = cell.getStringCellValue();
                            } else if (cellType == CellType.BOOLEAN) {
                                cellValue = String.valueOf(cell.getBooleanCellValue());
                            }
                        }
                        rowData.add(cellValue);
                    }
                    PdksList.add(rowData);
                }
            }

            // Toplam PDKS ve Gün sayısı bulma
            Map<String, Integer> pdksVeGunSayisi = new HashMap<>();
            for (List<String> rowData : PdksList) {
                if (!rowData.isEmpty()) {
                    String firstCellValue = rowData.get(0);

                    if (pdksVeGunSayisi.containsKey(firstCellValue)) {
                        pdksVeGunSayisi.put(firstCellValue, pdksVeGunSayisi.get(firstCellValue) + 1);
                    } else {
                        pdksVeGunSayisi.put(firstCellValue, 1);
                    }
                }
            }

            //Aynı isme ve tarihe sahip olan list elemanlarının 2 den farklı olma durumu kontrolü
            List<List<String>> duplicationCheckList1 = new ArrayList<>();

            for (List<String> rowData : PdksList) {
                List<String> childDuplicationCheckList1 = new ArrayList<>();
                childDuplicationCheckList1.add(rowData.get(0));
                childDuplicationCheckList1.add(rowData.get(1));
                duplicationCheckList1.add(childDuplicationCheckList1);
            }

            Map<List<String>, Integer> duplicatesCountMap1 = new HashMap<>();
            Map<String, String> duplicationCheckMap = new HashMap<>();

            for (List<String> currentList : duplicationCheckList1) {
                duplicatesCountMap1.put(currentList, duplicatesCountMap1.getOrDefault(currentList, 0) + 1);
            }

            for (Map.Entry<List<String>, Integer> entry : duplicatesCountMap1.entrySet()) {
                List<String> list = entry.getKey();
                int count = entry.getValue();
                if (count != 2) {
                    duplicationCheckMap.put(list.get(0),list.get(1));
                }
            }

            //Mükerrerlik kontrolü
            List<List<String>> duplicationCheckList = new ArrayList<>();

            for (List<String> rowData : PdksList) {
                List<String> childDuplicationCheckList = new ArrayList<>();
                childDuplicationCheckList.add(rowData.get(0));
                childDuplicationCheckList.add(rowData.get(1));
                childDuplicationCheckList.add(rowData.get(3));
                duplicationCheckList.add(childDuplicationCheckList);
            }

            List<List<String>> duplicateLists = new ArrayList<>();

            for (int i = 0; i < duplicationCheckList.size(); i++) {
                List<String> currentList = duplicationCheckList.get(i);
                boolean isDuplicate = false;

                for (int j = i + 1; j < duplicationCheckList.size(); j++) {
                    List<String> compareList = duplicationCheckList.get(j);

                    if (currentList.equals(compareList)) {
                        isDuplicate = true;
                        break;
                    }
                }

                if (isDuplicate && !duplicateLists.contains(currentList)) {
                    duplicateLists.add(currentList);
                }
            }

            Map<String,String> mukerrerlikMap = new HashMap<>();

            if (!duplicateLists.isEmpty()) {
                for (List<String> duplicateList : duplicateLists) {
                    for (String m: duplicateList) {
                        mukerrerlikMap.put(duplicateList.get(0),duplicateList.get(1));
                    }
                }
            } else {
                System.out.println("No duplicate lists found.");
            }


            responseChildObjects.put("pdksVeGunSayisi",pdksVeGunSayisi);
            responseChildObjects.put("duplicationCheckMap",duplicationCheckMap);
            responseChildObjects.put("mukerrerlikMap",mukerrerlikMap);
            response.put("pdksOutput",responseChildObjects);


        } catch (IOException e) {
            e.printStackTrace();
            response.put("error", "An error occurred during file processing.");
        }

        return response;
    }
}
