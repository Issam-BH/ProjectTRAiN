export function required<T extends object>(
    type: T,
): { required: true; type: T } {
    return { required: true, type }
}
