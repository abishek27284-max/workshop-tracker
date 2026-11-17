package app.workshop.desk;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tool_inventory")
public class ToolItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    private String label;
    private String storageSpot;
    private boolean checkedOut;

    public ToolItem() {
    }

    public ToolItem(String label, String storageSpot, boolean checkedOut) {
        this.label = label;
        this.storageSpot = storageSpot;
        this.checkedOut = checkedOut;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getStorageSpot() {
        return storageSpot;
    }

    public void setStorageSpot(String storageSpot) {
        this.storageSpot = storageSpot;
    }

    public boolean isCheckedOut() {
        return checkedOut;
    }

    public void setCheckedOut(boolean checkedOut) {
        this.checkedOut = checkedOut;
    }
}
