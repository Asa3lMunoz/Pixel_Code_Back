package cl.pixelcode.back.service.impl;

import cl.pixelcode.back.dto.response.TestResponseDto;
import cl.pixelcode.back.service.PixelcodeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class PixelcodeServiceImpl implements PixelcodeService {
    @Override
    public TestResponseDto holaMundo(String nombre) {
        return new TestResponseDto(1, nombre);
    }
}
