package com.pureskin.etudiant.model;

public enum TransactionStatus {
    PENDING("En attente"),
    COMPLETED("Complétée"),
    FAILED("Échouée"),
    REFUNDED("Remboursée"),
    CANCELLED("Annulée");
    
    private final String displayName;
    
    TransactionStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
