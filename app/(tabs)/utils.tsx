export function getFriendlydate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
}