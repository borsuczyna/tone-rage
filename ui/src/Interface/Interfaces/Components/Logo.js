export default function Logo({ glow, style, className }) {
    return (<img src={`/logo/glow-${glow ?? 5}.png`} className={className} style={style}/>);
}
