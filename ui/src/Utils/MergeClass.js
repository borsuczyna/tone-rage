export default function csx(...classNames) {
    return classNames.filter(Boolean).join(' ');
}
