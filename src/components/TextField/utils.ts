/**
 * Normalizes user-typed numeric input.
 *
 * - Allows partial values ("-", ".", "1e", "1e-")
 * - Supports decimals and scientific notation
 */
export const normalizeNumberInput = (raw: string): string => {
    if (!raw) return "";

    const filtered = raw.replace(/[^0-9eE+\-.]/g, "");

    let result = "";
    let hasExponent = false;
    let hasDot = false;
    let isInExponent = false;
    let canUseSign = true;

    for (let i = 0; i < filtered.length; i++) {
        const ch = filtered[i];

        if (ch >= "0" && ch <= "9") {
            result += ch;
            canUseSign = false;
            continue;
        }

        if (ch === ".") {
            if (!isInExponent && !hasDot) {
                result += ch;
                hasDot = true;
            }
            continue;
        }

        if (ch === "e" || ch === "E") {
            if (!hasExponent) {
                if (/\d/.test(result)) {
                    result += ch;
                    hasExponent = true;
                    isInExponent = true;
                    canUseSign = true;
                }
            }
            continue;
        }

        if (ch === "+" || ch === "-") {
            if (canUseSign) {
                result += ch;
                canUseSign = false;
            }
        }
    }

    return result;
};
