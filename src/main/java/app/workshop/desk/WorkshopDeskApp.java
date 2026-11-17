package app.workshop.desk;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class WorkshopDeskApp {

    public static void main(String[] args) {
        SpringApplication.run(WorkshopDeskApp.class, args);
    }

    @Bean
    CommandLineRunner seedInitialTools(ToolCatalogRepository repo) {
        return args -> {
            repo.save(new ToolItem("Cordless Impact Driver", "Aisle B - Shelf 2", false));
            repo.save(new ToolItem("Digital Caliper 150mm", "Cabinet 4 - Drawer 1", true));
            repo.save(new ToolItem("Rotary Laser Level", "Bay 3 - Rack A", false));
        };
    }
}
