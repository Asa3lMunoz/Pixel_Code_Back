package cl.pixelcode.back.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactoRequestDto {
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private String mensaje;
}
