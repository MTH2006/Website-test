package com.minicaas.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "demo_tests")
public class DemoTest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "test_code", nullable = false, unique = true, length = 50)
    private String testCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String objective;

    @Column(name = "execution_order", nullable = false)
    private Integer executionOrder = 1;

    public DemoTest() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTestCode() { return testCode; }
    public void setTestCode(String testCode) { this.testCode = testCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public Integer getExecutionOrder() { return executionOrder; }
    public void setExecutionOrder(Integer executionOrder) { this.executionOrder = executionOrder; }
}
