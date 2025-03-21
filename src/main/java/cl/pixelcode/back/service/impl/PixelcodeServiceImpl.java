package cl.pixelcode.back.service.impl;

import cl.pixelcode.back.dto.request.ContactoRequestDto;
import cl.pixelcode.back.dto.response.ResponseDto;
import cl.pixelcode.back.service.PixelcodeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PixelcodeServiceImpl implements PixelcodeService {
    @Override
    public ResponseDto registrarContacto(ContactoRequestDto contacto) {
        return new ResponseDto(true, "Contacto registrado correctamente");
    }
}
