package cl.pixelcode.back.controller;

import cl.pixelcode.back.dto.request.ContactoRequestDto;
import cl.pixelcode.back.dto.response.ResponseDto;
import cl.pixelcode.back.service.PixelcodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/pixelcode")
public class PixelcodeController {

    @Autowired
    private PixelcodeService pixelcodeService;

    @PostMapping("registro-contacto")
    public ResponseDto holaMundo(@RequestBody ContactoRequestDto contacto) {
        return pixelcodeService.registrarContacto(contacto);
    }
}
