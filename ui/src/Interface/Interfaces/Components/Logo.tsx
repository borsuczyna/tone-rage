interface LogoProps {
    glow?: number;
    style?: React.CSSProperties;
    className?: string;
}

export default function Logo({ glow, style, className }: LogoProps) {
    return (
        <img src={`/logo/glow-${glow ?? 5}.png`} className={className} style={style} />
    );
}