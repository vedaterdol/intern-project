package com.example.internproject;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class Controller {
    private final PDKSService pdksService;
    private final GunSayisiService gunSayisiService;
    private final PDKSServiceIstanbul pdksServiceIstanbul;

    public Controller(PDKSService pdksService, GunSayisiService gunSayisiService, PDKSServiceIstanbul pdksServiceIstanbul) {
        this.pdksService = pdksService;
        this.gunSayisiService = gunSayisiService;
        this.pdksServiceIstanbul = pdksServiceIstanbul;
    }


    @PostMapping("/upload-pdksXlsx")
    public ResponseEntity<Map<String, Object>> uploadPdksXlsx(@RequestParam("pdksXlsx") MultipartFile pdksXlsx) {
        Map<String, Object> response = pdksService.processFile(pdksXlsx);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-gunSayisiXlsx")
    public ResponseEntity<Map<String, Object>> uploadGunSayisiXlsx(@RequestParam("gunSayisiXlsx") MultipartFile gunSayisiXlsx) {
        Map<String, Object> response = gunSayisiService.processFile(gunSayisiXlsx);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-pdksIstXlsx")
    public ResponseEntity<Map<String, Object>> uploadPdksIstanbulXlsx(@RequestParam("pdksIstXlsx") MultipartFile pdksIstXlsx) {
        Map<String, Object> response = pdksServiceIstanbul.processFile(pdksIstXlsx);
        return ResponseEntity.ok(response);
    }
}
