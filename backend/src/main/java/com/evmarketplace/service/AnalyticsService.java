package com.evmarketplace.service;

import com.evmarketplace.dto.SalesReportEntry;
import com.evmarketplace.dto.UsageReportEntry;
import com.evmarketplace.model.Order;
import com.evmarketplace.model.VisitEvent;
import com.evmarketplace.repository.OrderRepository;
import com.evmarketplace.repository.VisitEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private VisitEventRepository visitEventRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Saves a VisitEvent record. Called externally (e.g. from CatalogController) when a
    // vehicle is viewed, added to cart, or purchased.
    @Transactional
    public VisitEvent recordVisitEvent(String ipAddress, Long vehicleId, String eventType) {
        VisitEvent event = new VisitEvent();
        event.setIpAddress(ipAddress);
        event.setVehicleId(vehicleId);
        event.setEventType(eventType);
        event.setDay(LocalDate.now().toString());
        event.setCreatedAt(LocalDateTime.now());
        return visitEventRepository.save(event);
    }

    @Transactional(readOnly = true)
    public List<SalesReportEntry> generateSalesReport() {
        Map<YearMonth, Long> countsByMonth = orderRepository.findByStatus(Order.Status.CONFIRMED).stream()
                .filter(order -> order.getOrderDate() != null)
                .collect(Collectors.groupingBy(
                        order -> YearMonth.from(order.getOrderDate()),
                        TreeMap::new,
                        Collectors.counting()
                ));

        return countsByMonth.entrySet().stream()
                .map(entry -> new SalesReportEntry(
                        entry.getKey().getYear(),
                        entry.getKey().getMonthValue(),
                        entry.getValue()
                ))
                .collect(Collectors.toList());
    }

    // Counts VisitEvent records by event type. Returns 0 for any type with no records.
    @Transactional(readOnly = true)
    public List<UsageReportEntry> generateUsageReport() {
        List<String> eventTypes = Arrays.asList("VIEW", "CART", "PURCHASE");
        return eventTypes.stream()
                .map(type -> new UsageReportEntry(type, visitEventRepository.countByEventType(type)))
                .collect(Collectors.toList());
    }
}
