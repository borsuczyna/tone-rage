export default function csx(...classNames: (string | false | null | undefined)[]): string {
    return classNames.filter(Boolean).join(' ');
}