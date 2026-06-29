# EECS4413 Project - EVMarketplace E-commerce System

An architecture foundation for a cloud-native Electric Vehicle (EV) and automotive component e-commerce platform.

## System Architecture & Design Pattern

* **Controller Layer:** Handles REST API endpoints, routing, and HTTP request/response mappings.
* **Service Layer:** Houses the core business logic and system workflow orchestrations.
* **Repository Layer:** Abstracts the data access layer utilizing the **Repository Pattern** for database decoupled operations.
* **Entity Layer:** Represents the domain models and data schemas.

### Implemented Design Patterns
To meet the architectural quality attributes specified in Deliverable 1, the following patterns are foundational to this codebase:
* **Repository Pattern:** Decouples the business logic layer from data access strategies via Spring Data JPA.
* **Strategy Pattern:** (Planned/Skeleton) To be used for dynamic payment processing variations (e.g., Credit Card, Digital Wallets) and multi-tiered shipping rate calculations.
* **Singleton Pattern:** Managed inherently via Spring-managed `@Service` and `@Component` beans to guarantee single instances for global service access.