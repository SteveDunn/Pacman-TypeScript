export class MathHelper {
    static readonly E = Math.E;
    static readonly log10E: number = 0.4342945;
    static readonly log2E: number = 1.442695;
    static readonly pi = Math.PI;
    static readonly piOver2 = (Math.PI / 2.0);
    static readonly piOver4 = (Math.PI / 4.0);
    static readonly twoPi = (Math.PI * 2.0);

    static barycentric = (value1: number, value2: number, value3: number, amount1: number, amount2: number) => {
        return value1 + (value2 - value1) * amount1 + (value3 - value1) * amount2;
    }

    static catmullRom = (value1: number, value2: number, value3: number, value4: number, amount: number): number => {
        // Using formula from http://www.mvps.org/directx/articles/catmull/
        // Internally using doubles not to lose precission
        const amountSquared = amount * amount;
        const amountCubed = amountSquared * amount;
        return (0.5 * (2.0 * value2 +
            (value3 - value1) * amount +
            (2.0 * value1 - 5.0 * value2 + 4.0 * value3 - value4) * amountSquared +
            (3.0 * value2 - value1 - 3.0 * value3 + value4) * amountCubed));
    }

    static clamp = (value: number, min: number, max: number): number => {
        // First we check to see if we're greater than the max
        value = (value > max) ? max : value;

        // Then we check to see if we're less than the min.
        value = (value < min) ? min : value;

        // There's no check to see if min > max.
        return value;
    }

    static distance = (value1: number, value2: number): number => {
        return Math.abs(value1 - value2);
    }

    static hermite = (value1: number, tangent1: number, value2: number, tangent2: number, amount: number): number => {
        // All transformed to double not to lose precission
        // Otherwise, for high numbers of param:amount the result is NaN instead of Infinity
        const v1 = value1;
        const v2 = value2;
        const t1 = tangent1;
        const t2 = tangent2;
        const s = amount;
        let result: number;
        const sCubed = s * s * s;
        const sSquared = s * s;

        if (amount === 0) {
            result = value1;
        }
        else if (amount === 1) {
            result = value2;
        }
        else {
            result = (2 * v1 - 2 * v2 + t2 + t1) * sCubed +
                (3 * v2 - 3 * v1 - 2 * t1 - t2) * sSquared +
                t1 * s +
                v1;
        }
        return result;
    }

    static lerp = (value1: number, value2: number, amount: number): number => {
        return value1 + (value2 - value1) * amount;
    }

    static max = (value1: number, value2: number): number => {
        return Math.max(value1, value2);
    }

    static min = (value1: number, value2: number): number => {
        return Math.min(value1, value2);
    }

    static smoothStep = (value1: number, value2: number, amount: number): number => {
        // It is expected that 0 < amount < 1
        // If amount < 0, return value1
        // If amount > 1, return value2
        let result = MathHelper.clamp(amount, 0, 1);
        result = MathHelper.hermite(value1, 0, value2, 0, result);
        return result;
    }

    static toDegrees = (radians: number): number => {
        // This method uses double precission internally,
        // though it returns single float
        // Factor = 180 / pi
        return radians * 57.295779513082320876798154814105;
    }

    static toRadians = (degrees: number): number => {
        // This method uses double precission internally,
        // though it returns single float
        // Factor = pi / 180
        return degrees * 0.017453292519943295769236907684886;
    }
}
