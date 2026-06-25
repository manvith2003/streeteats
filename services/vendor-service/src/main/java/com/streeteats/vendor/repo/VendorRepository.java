package com.streeteats.vendor.repo;

import com.streeteats.vendor.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VendorRepository extends JpaRepository<Vendor, UUID> {

    /**
     * "Vendors near me" using the Haversine formula (km). Works on H2 and Postgres.
     * For production scale this is replaced by a PostGIS spatial index query.
     */
    @Query(value = """
            SELECT * FROM vendors v
            WHERE v.lat IS NOT NULL AND v.lng IS NOT NULL
              AND (6371 * acos(
                    cos(radians(:lat)) * cos(radians(v.lat)) *
                    cos(radians(v.lng) - radians(:lng)) +
                    sin(radians(:lat)) * sin(radians(v.lat))
                  )) <= :radiusKm
            ORDER BY (6371 * acos(
                    cos(radians(:lat)) * cos(radians(v.lat)) *
                    cos(radians(v.lng) - radians(:lng)) +
                    sin(radians(:lat)) * sin(radians(v.lat))
                  )) ASC
            """, nativeQuery = true)
    List<Vendor> findNearby(@Param("lat") double lat,
                            @Param("lng") double lng,
                            @Param("radiusKm") double radiusKm);
}
