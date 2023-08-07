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
public class PDKSServiceIstanbul {

    public Map<String, Object> processFile(MultipartFile pdksIstXlsx) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> responseChildObjects = new HashMap();


        try {
            Workbook pdksWorkbook = WorkbookFactory.create(pdksIstXlsx.getInputStream());
            List<List<String>> PdksIstanbulList = new ArrayList<>();
            Sheet pdksWorkbookSheet = pdksWorkbook.getSheetAt(0);
            int startRowIndex = 1; // 2. satırın indeksi (0'dan başlayarak)
            int lastRowNum = pdksWorkbookSheet.getLastRowNum();
            for (int rowIndex = startRowIndex; rowIndex <= lastRowNum; rowIndex++) {
                Row row = pdksWorkbookSheet.getRow(rowIndex);
                if (row != null) {
                    List<String> rowData = new ArrayList<>();
                    int startColumnIndex = 0; // 1. sütunun indeksi (0'dan başlayarak)
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
                            if (cellValue.contains("s") || cellValue.contains("d")) {
                                int hours = 0;
                                int minutes = 0;

                                String[] parts = cellValue.split(" ");
                                for (String part : parts) {
                                    if (part.endsWith("s")) {
                                        hours = Integer.parseInt(part.substring(0, part.length() - 1));
                                    } else if (part.endsWith("d")) {
                                        minutes = Integer.parseInt(part.substring(0, part.length() - 1));
                                    }
                                }

                                int totalTimeInMinutes = hours * 60 + minutes;
                                cellValue = String.valueOf(totalTimeInMinutes);
                            }
                        }
                        rowData.add(cellValue);
                    }
                    PdksIstanbulList.add(rowData);
                }
            }

            //task1

            Map<String, Integer> kisiVeGunList = new HashMap<>();
            Map<String, List<String>> toplamGunveGunList = new HashMap<>();
            for (List<String> rowData : PdksIstanbulList) {
                if (!rowData.isEmpty()) {
                    String firstCellValue = rowData.get(2);

                    if (kisiVeGunList.containsKey(firstCellValue)) {
                        kisiVeGunList.put(firstCellValue, kisiVeGunList.get(firstCellValue) + 1);
                    } else {
                        kisiVeGunList.put(firstCellValue, 1);
                        toplamGunveGunList.put(firstCellValue, new ArrayList<>());
                    }

                    List<String> firstElementsList = toplamGunveGunList.get(firstCellValue);
                    firstElementsList.add(rowData.get(0));
                }
            }

            Map<String, List<Object>> toplamGunMap = new HashMap<>();
            for (Map.Entry<String, Integer> countEntry : kisiVeGunList.entrySet()) {
                String key = countEntry.getKey();
                int count = countEntry.getValue();
                List<String> firstElementsList = toplamGunveGunList.get(key);

                List<Object> mergedList = new ArrayList<>();
                mergedList.add(count);
                mergedList.add(firstElementsList);

                toplamGunMap.put(key, mergedList);
            }

            for (Map.Entry<String, List<Object>> entry : toplamGunMap.entrySet()) {
                String key = entry.getKey();
                List<Object> mergedList = entry.getValue();
                List<String> firstElementList = (List<String>) mergedList.get(1);
            }

            // task2

            Map<String,List<Object>> incorrectTimeList = new HashMap<>();
            List<List<String>> rowsWithIndex5ValueOver600 = new ArrayList<>();

            for (List<String> rowData : PdksIstanbulList) {
                if (rowData.size() > 5) {
                    String cellValueAtIndex5 = rowData.get(5);
                    try {
                        double numericValue = Double.parseDouble(cellValueAtIndex5);
                        if (numericValue > 600) {
                            rowsWithIndex5ValueOver600.add(rowData);

                            List<Object> mergedList = new ArrayList<>();
                            mergedList.add(rowData.get(0));
                            mergedList.add(rowData.get(5));
                            incorrectTimeList.put(rowData.get(2),mergedList);
                        }
                    } catch (NumberFormatException e) {
                    }
                }
            }

            responseChildObjects.put("toplamGunMap",toplamGunMap);
            responseChildObjects.put("incorrectTimeList",incorrectTimeList);
            response.put("pdksIstOutput",responseChildObjects);

        } catch (IOException e) {
            e.printStackTrace();
            response.put("error", "An error occurred during file processing.");
        }

        return response;
    }
}
