package com.streeteats.menu.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/** Post today's menu. */
public class MenuRequest {
    @NotEmpty
    private List<Item> items;

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    public static class Item {
        private String name;
        private Double price;
        private boolean special;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        public boolean isSpecial() { return special; }
        public void setSpecial(boolean special) { this.special = special; }
    }
}
