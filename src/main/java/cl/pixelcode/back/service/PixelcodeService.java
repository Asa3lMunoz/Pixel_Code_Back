package cl.pixelcode.back.service;

import cl.pixelcode.back.dto.request.ContactoRequestDto;
import cl.pixelcode.back.dto.response.ResponseDto;

public interface PixelcodeService {
    ResponseDto registrarContacto(ContactoRequestDto contacto);
}
