export function hasValidTableIdAndReservationId({table_id, reservation_id} ) {
    const errors = {};

    if (!table_id) {
        console.error("Validation error: Missing table ID");
        errors.table_id = "Validation error: Missing table ID.";
    }

    if (!reservation_id) {
        console.error("Validation error: Missing reservation ID.");
        errors.reservation_id = "Validation error: Missing reservation ID.";
    }

    return Object.keys(errors).length === 0 ? null : errors;
}
