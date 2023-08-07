package com.example.internproject;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class GunSayisiService {

    public Map<String, Object> processFile(MultipartFile gunSayisiXlsx) {

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> responseChildObjects = new HashMap();

        try {
            Workbook gunSayisiWorkbook = WorkbookFactory.create(gunSayisiXlsx.getInputStream());
            List<List<String>> GunSayisiList = new ArrayList<>();
            Sheet gunSayisiSheet = gunSayisiWorkbook.getSheetAt(0);
            int startRowIndex = 3; // 4. satırın indeksi (0'dan başlayarak)
            int lastRowNum = Math.min(gunSayisiSheet.getLastRowNum(), 49);
            for (int rowIndex = startRowIndex; rowIndex <= lastRowNum; rowIndex++) {
                Row row = gunSayisiSheet.getRow(rowIndex);
                if (row != null) {
                    List<String> rowData = new ArrayList<>();
                    int startColumnIndex = 1; // 2. sütunun indeksi (0'dan başlayarak)
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
                    GunSayisiList.add(rowData);
                }
            }

            // Toplam PDKS-İGS sayılarını bulma
            HashMap<String, Integer> pdksİgsCountMap = new HashMap<>();
            for (List<String> rowData : GunSayisiList) {
                String key = rowData.get(0);
                int count = 0;

                for (int i = 0; i < rowData.size(); i++) {
                    String cellValue = rowData.get(i);
                    if (cellValue.equals("PDKS-İGS")) {
                        count++;
                    }
                }
                pdksİgsCountMap.put(key, count);
            }

            // Kapsam içi yıllık izin bulma
            HashMap<String, Integer> izYılMap = new HashMap<>();

            int startRow = 3; // Başlangıç satırı
            int endRow = 49; // Bitiş satırı

            for (int rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
                Row currentRow = gunSayisiSheet.getRow(rowIndex);

                if (currentRow != null) {
                    int count = 0;

                    for (Cell currentCell : currentRow) {
                        if (currentCell.getCellType() == CellType.STRING && currentCell.getStringCellValue().equals("İZ-YIL")) {
                            XSSFCell xssfCell = (XSSFCell) currentCell;
                            Color color = xssfCell.getCellStyle().getFillForegroundColorColor();

                            if (color instanceof XSSFColor) {
                                XSSFColor xssfColor = (XSSFColor) color;
                                byte[] rgb = xssfColor.getRGB();
                                if (rgb != null) {
                                    int red = rgb[0] & 0xFF;
                                    int green = rgb[1] & 0xFF;
                                    int blue = rgb[2] & 0xFF;

                                    // Sadece RGB değeri (155,187,89) olan hücreleri kontrol eder ve artırır
                                    if (red == 155 && green == 187 && blue == 89) {
                                        count++;
                                    }
                                }
                            }
                        }
                    }

                    Cell keyCell = currentRow.getCell(1);

                    if (keyCell != null && count > 0) {
                        String key = keyCell.getStringCellValue();
                        izYılMap.put(key, count);
                    }
                }
            }

            responseChildObjects.put("pdksİgsCountMap",pdksİgsCountMap);
            responseChildObjects.put("izYılMap",izYılMap);
            response.put("gunSayisiOutput",responseChildObjects);

        } catch (IOException e) {
            e.printStackTrace();
            response.put("error", "An error occurred during file processing.");
        }

        return response;
    }
}