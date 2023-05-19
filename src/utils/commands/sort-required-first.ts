import { StringOptions } from '../../types/commands/crear'

export const compareRequired = (a: StringOptions, b: StringOptions): 1 | -1 | 0 => {
    if (a.required && !b.required) {
        return -1
    } else if (!a.required && b.required) {
        return 1
    } else {
        return 0
    }
}
