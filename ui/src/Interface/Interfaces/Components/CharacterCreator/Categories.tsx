import CategoryItem from './CategoryItem';
import styles from '../../Styles/CharacterCreatorInterface.module.css';

interface CategoriesProps {
    activeCategory: number;
    setActiveCategory: (category: number) => void;
    isTransitioning: boolean;
}

export default function Categories({ activeCategory, setActiveCategory, isTransitioning }: CategoriesProps) {
    return (
        <div className={styles.categories}>
            <svg>
                <defs>
                    <filter id="filter0_f_2041_62" x="235.336" y="-67.1462" width="650.182" height="622.224" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="68.4" result="effect1_foregroundBlur_2041_62"/>
                    </filter>
                    <filter id="filter1_f_2041_62" x="69.367" y="200.012" width="596.751" height="648.866" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="68.4" result="effect1_foregroundBlur_2041_62"/>
                    </filter>
                    <filter id="filter2_f_2041_62" x="4.95781" y="548.881" width="524.021" height="640.202" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="68.4" result="effect1_foregroundBlur_2041_62"/>
                    </filter>
                    <filter id="filter3_f_2041_62" x="61.076" y="891.862" width="579.639" height="653.122" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="68.4" result="effect1_foregroundBlur_2041_62"/>
                    </filter>
                    <filter id="filter4_f_2041_62" x="228.356" y="1176.51" width="643.399" height="636.266" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feGaussianBlur stdDeviation="68.4" result="effect1_foregroundBlur_2041_62"/>
                    </filter>
                    <radialGradient id="paint0_radial_2041_62" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(532.591 221.507) rotate(-129.384) scale(262.748 306.665)">
                        <stop stop-color="#ff1493"/>
                        <stop offset="1" stop-color="#ff1493" stop-opacity="0"/>
                    </radialGradient>
                    <radialGradient id="paint1_radial_2041_62" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(322.318 524.077) rotate(-153.923) scale(262.747 306.665)">
                        <stop stop-color="#ff1493"/>
                        <stop offset="1" stop-color="#ff1493" stop-opacity="0"/>
                    </radialGradient>
                    <radialGradient id="paint2_radial_2041_62" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(229.301 874.203) rotate(-177.517) scale(262.748 306.665)">
                        <stop stop-color="#ff1493"/>
                        <stop offset="1" stop-color="#ff1493" stop-opacity="0"/>
                    </radialGradient>
                    <radialGradient id="paint3_radial_2041_62" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(320.667 1229.61) rotate(156.56) scale(262.748 306.665)">
                        <stop stop-color="#ff1493"/>
                        <stop offset="1" stop-color="#ff1493" stop-opacity="0"/>
                    </radialGradient>
                    <radialGradient id="paint4_radial_2041_62" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(538.045 1529.85) rotate(128.428) scale(262.747 306.665)">
                        <stop stop-color="#ff1493"/>
                        <stop offset="1" stop-color="#ff1493" stop-opacity="0"/>
                    </radialGradient>
                    <clipPath id="clip0_2041_62">
                        <rect width="848" height="1759" fill="white"/>
                    </clipPath>
                </defs>
            </svg>

            <svg width="848" height="1759" viewBox="0 0 848 1759" fill="none" className={styles.categoryPosition} xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2041_62)">
                    {/* bow */}
                    <path d="M703.513 0L847.513 324C733.513 383 495.513 520 486.513 887.5C495.513 1255 703.513 1376 817.513 1435L673.513 1759H628.013L779.513 1460.5C659.013 1400.5 456.013 1244.5 447.513 887.5C456.013 530.5 689.013 358.5 809.513 298.5L658.013 0H703.513Z" fill="#1E1E1E"/>
                </g>
            </svg>

            {[0, 1, 2, 3, 4, 5]
                .map(category => (
                    <>
                        <CategoryItem
                            key={category}
                            category={category}
                            active={activeCategory === category}
                            setActiveCategory={() => { if (!isTransitioning) setActiveCategory(category); }}
                        />
                        <CategoryItem
                            key={category + 10}
                            category={category}
                            active={activeCategory === category}
                            setActiveCategory={() => { if (!isTransitioning) setActiveCategory(category); }}
                            activeItemGhost={true}
                        />
                    </>
            ))}
        </div>
    );
}