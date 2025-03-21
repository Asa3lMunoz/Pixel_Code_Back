package cl.pixelcode.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class PixelcodeBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(PixelcodeBackApplication.class, args);
    }

}
