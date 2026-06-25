package com.streeteats.menu.web;

import com.streeteats.menu.dto.MenuRequest;
import com.streeteats.menu.event.MenuEventPublisher;
import com.streeteats.menu.model.DailyMenu;
import com.streeteats.menu.model.MenuItem;
import com.streeteats.menu.repo.DailyMenuRepository;
import com.streeteats.menu.repo.MenuItemRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin
public class MenuController {

    private final DailyMenuRepository menus;
    private final MenuItemRepository items;
    private final MenuEventPublisher events;

    public MenuController(DailyMenuRepository menus, MenuItemRepository items, MenuEventPublisher events) {
        this.menus = menus;
        this.items = items;
        this.events = events;
    }

    /** Post/replace today's menu for a vendor. */
    @PostMapping("/{vendorId}")
    public DailyMenu setToday(@PathVariable UUID vendorId, @Valid @RequestBody MenuRequest req) {
        LocalDate today = LocalDate.now();
        DailyMenu menu = menus.findByVendorIdAndMenuDate(vendorId, today).orElseGet(() -> {
            DailyMenu m = new DailyMenu();
            m.setVendorId(vendorId);
            m.setMenuDate(today);
            return m;
        });
        menu.getItems().clear();
        for (MenuRequest.Item i : req.getItems()) {
            MenuItem item = new MenuItem();
            item.setName(i.getName());
            item.setPrice(i.getPrice());
            item.setSpecial(i.isSpecial());
            menu.addItem(item);
        }
        menu.setUpdatedAt(Instant.now());
        DailyMenu saved = menus.save(menu);
        events.publish(saved);
        return saved;
    }

    @GetMapping("/{vendorId}/today")
    public DailyMenu today(@PathVariable UUID vendorId) {
        return menus.findByVendorIdAndMenuDate(vendorId, LocalDate.now())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No menu today"));
    }

    /** One-tap "reuse yesterday's menu" → copies the most recent menu to today. */
    @PostMapping("/{vendorId}/reuse-yesterday")
    public DailyMenu reuse(@PathVariable UUID vendorId) {
        List<DailyMenu> history = menus.findByVendorIdOrderByMenuDateDesc(vendorId);
        DailyMenu source = history.stream()
                .filter(m -> !m.getMenuDate().equals(LocalDate.now()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No previous menu to reuse"));
        MenuRequest req = new MenuRequest();
        req.setItems(source.getItems().stream().map(i -> {
            MenuRequest.Item it = new MenuRequest.Item();
            it.setName(i.getName());
            it.setPrice(i.getPrice());
            it.setSpecial(i.isSpecial());
            return it;
        }).toList());
        return setToday(vendorId, req);
    }

    /** Mark an item sold out (or back in stock) live. */
    @PatchMapping("/items/{itemId}/sold-out")
    public MenuItem soldOut(@PathVariable UUID itemId, @RequestParam(defaultValue = "true") boolean value) {
        MenuItem item = items.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));
        item.setSoldOut(value);
        return items.save(item);
    }
}
