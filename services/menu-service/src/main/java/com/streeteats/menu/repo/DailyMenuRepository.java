package com.streeteats.menu.repo;

import com.streeteats.menu.model.DailyMenu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DailyMenuRepository extends JpaRepository<DailyMenu, UUID> {
    Optional<DailyMenu> findByVendorIdAndMenuDate(UUID vendorId, LocalDate menuDate);
    List<DailyMenu> findByVendorIdOrderByMenuDateDesc(UUID vendorId);
}
