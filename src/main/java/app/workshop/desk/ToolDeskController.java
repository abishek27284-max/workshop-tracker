package app.workshop.desk;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tools")
public class ToolDeskController {

    private final ToolCatalogRepository catalogRepo;

    public ToolDeskController(ToolCatalogRepository catalogRepo) {
        this.catalogRepo = catalogRepo;
    }

    @GetMapping
    public List<ToolItem> fetchAllEquipment() {
        return catalogRepo.findAll();
    }

    @PostMapping
    public ToolItem registerTool(@RequestBody ToolItem incoming) {
        incoming.setItemId(null);
        return catalogRepo.save(incoming);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ToolItem> updateToolDetails(@PathVariable Long id, @RequestBody ToolItem updated) {
        return catalogRepo.findById(id)
                .map(record -> {
                    record.setLabel(updated.getLabel());
                    record.setStorageSpot(updated.getStorageSpot());
                    return ResponseEntity.ok(catalogRepo.save(record));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ToolItem> flipCheckoutStatus(@PathVariable Long id) {
        return catalogRepo.findById(id)
                .map(record -> {
                    record.setCheckedOut(!record.isCheckedOut());
                    return ResponseEntity.ok(catalogRepo.save(record));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeTool(@PathVariable Long id) {
        if (!catalogRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        catalogRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
