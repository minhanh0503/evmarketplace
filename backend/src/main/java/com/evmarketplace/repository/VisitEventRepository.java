package com.evmarketplace.repository;

import com.evmarketplace.model.VisitEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitEventRepository extends JpaRepository<VisitEvent, Long> {

    // Equivalent to the "findByVid" concept — vehicleId is the field name in the entity
    List<VisitEvent> findByVehicleId(Long vehicleId);

    List<VisitEvent> findByEventType(String eventType);

    // Used by generateUsageReport() to count events per type (VIEW, CART, PURCHASE)
    long countByEventType(String eventType);
}
