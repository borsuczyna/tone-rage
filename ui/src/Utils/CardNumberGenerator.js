/**
 * Generate a deterministic card number from user ID
 * Format: 4 groups of 4 digits (XXXX-XXXX-XXXX-XXXX)
 * The card number is unique for each user ID
 *
 * Note: This is for display purposes only and not cryptographically secure.
 * Card numbers are generated client-side for visual representation.
 */
export function generateCardNumber(userId) {
    // Use a simple hash function to generate deterministic numbers from user ID
    const hash = (seed) => {
        let h = seed;
        h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
        h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
        return (h ^ (h >>> 16)) >>> 0;
    };
    // Generate 4 groups of 4 digits
    const group1 = String(hash(userId) % 10000).padStart(4, '0');
    const group2 = String(hash(userId * 2 + 1) % 10000).padStart(4, '0');
    const group3 = String(hash(userId * 3 + 2) % 10000).padStart(4, '0');
    const group4 = String(hash(userId * 4 + 3) % 10000).padStart(4, '0');
    return `${group1} ${group2} ${group3} ${group4}`;
}
