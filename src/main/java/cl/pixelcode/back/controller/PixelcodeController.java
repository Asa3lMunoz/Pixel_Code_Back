package cl.pixelcode.back.controller;

import cl.pixelcode.back.dto.response.TestResponseDto;
import cl.pixelcode.back.service.PixelcodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/pixelcode")
public class PixelcodeController {

    @Autowired
    private PixelcodeService pixelcodeService;

    @GetMapping("hola-mundo")
    public TestResponseDto holaMundo(@RequestParam String nombre) {
        return pixelcodeService.holaMundo(nombre);
    }
}
