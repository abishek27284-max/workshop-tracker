package app.workshop.desk;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToolCatalogRepository extends JpaRepository<ToolItem, Long> {
}
