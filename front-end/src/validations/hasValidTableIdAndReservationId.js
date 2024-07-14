export function hasValidTableIdAndReservationId({table_id, reservation_id} ) {
    const errorMessages = [];

    if (!table_id) {
        console.error("Validation error: Missing table ID");
        errorMessages.push("Validation error: Missing table ID.");
    }

    if (!reservation_id) {
        console.error("Validation error: Missing reservation ID.");
        errorMessages.push("Validation error: Missing reservation ID.");
    }

    if (errorMessages.length > 0) {
        return { message: errorMessages.join(" ") }; // Joins messages with a space
    }
}
