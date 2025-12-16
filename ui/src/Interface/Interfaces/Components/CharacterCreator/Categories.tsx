import CategoryItem from './CategoryItem';
import styles from '../../Styles/CharacterCreatorInterface.module.css';

interface CategoriesProps {
    activeCategory: number;
    setActiveCategory: (category: number) => void;
}

export default function Categories({ activeCategory, setActiveCategory }: CategoriesProps) {
    const activeColor = '#FF2D55';
    const color = '#0c0c0ccc';

    return (
        <div className={styles.categories}>
            <svg>
                <defs>
                    <defs>
                        <radialGradient id="paint0_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(222.5 1136.5) rotate(50.5651) scale(207.808 333.23)">
                            <stop stop-color={color} stop-opacity={activeCategory == 5 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={color} stop-opacity="0.7"/>
                        </radialGradient>
                        <linearGradient id="paint1_linear_2013_59_inactive" x1="205.5" y1="1103" x2="363.5" y2="1297" gradientUnits="userSpaceOnUse">
                            <stop stop-color={color}/>
                            <stop offset="1" stop-color={color} stop-opacity="0.7"/>
                        </linearGradient>
                        <radialGradient id="paint2_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(152.5 1000) rotate(98.9229) scale(209.536 184.448)">
                            <stop stop-color={color} stop-opacity={activeCategory == 4 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={color} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint3_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(93 779) rotate(112.709) scale(222.769 166.879)">
                            <stop stop-color={color} stop-opacity={activeCategory == 3 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={color} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint4_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(94.5 533) rotate(120.753) scale(186.763 144.395)">
                            <stop stop-color={color} stop-opacity={activeCategory == 2 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={color} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint5_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(147 320) rotate(143.655) scale(152.706 132.884)">
                            <stop stop-color={color} stop-opacity={activeCategory == 1 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={color} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint6_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 149) rotate(-28.2174) scale(255.913 401.891)">
                            <stop stop-color={color} stop-opacity={activeCategory == 0 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={color} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint7_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(215 190) rotate(-52.0379) scale(230.842 362.519)">
                            <stop stop-color={color} stop-opacity={activeCategory == 0 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={color} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint0_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(222.5 1136.5) rotate(50.5651) scale(207.808 333.23)">
                            <stop stop-color={activeColor} stop-opacity={activeCategory == 5 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={activeColor} stop-opacity="0.7"/>
                        </radialGradient>
                        <linearGradient id="paint1_linear_2013_59_active" x1="205.5" y1="1103" x2="363.5" y2="1297" gradientUnits="userSpaceOnUse">
                            <stop stop-color={activeColor}/>
                            <stop offset="1" stop-color={activeColor} stop-opacity="0.7"/>
                        </linearGradient>
                        <radialGradient id="paint2_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(152.5 1000) rotate(98.9229) scale(209.536 184.448)">
                            <stop stop-color={activeColor} stop-opacity={activeCategory == 4 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={activeColor} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint3_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(93 779) rotate(112.709) scale(222.769 166.879)">
                            <stop stop-color={activeColor} stop-opacity={activeCategory == 3 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={activeColor} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint4_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(94.5 533) rotate(120.753) scale(186.763 144.395)">
                            <stop stop-color={activeColor} stop-opacity={activeCategory == 2 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={activeColor} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint5_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(147 320) rotate(143.655) scale(152.706 132.884)">
                            <stop stop-color={activeColor} stop-opacity={activeCategory == 1 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={activeColor} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint6_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 149) rotate(-28.2174) scale(255.913 401.891)">
                            <stop stop-color={activeColor} stop-opacity={activeCategory == 0 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={activeColor} stop-opacity="0.7"/>
                        </radialGradient>
                        <radialGradient id="paint7_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(215 190) rotate(-52.0379) scale(230.842 362.519)">
                            <stop stop-color={activeColor} stop-opacity={activeCategory == 0 ? "0.7" : "0.7"}/>
                            <stop offset="1" stop-color={activeColor} stop-opacity="0.7"/>
                        </radialGradient>
                        <clipPath id="category_clip">
                            <rect width="530" height="1294" fill="white"/>
                        </clipPath>
                    </defs>
                </defs>
            </svg>

            {[0, 1, 2, 3, 4, 5]
                .map(category => (
                    <>
                        <CategoryItem
                            key={category}
                            category={category}
                            active={activeCategory === category}
                            setActiveCategory={setActiveCategory}
                        />
                        <CategoryItem
                            key={category + 10}
                            category={category}
                            active={activeCategory === category}
                            setActiveCategory={setActiveCategory}
                            activeItemGhost={true}
                        />
                    </>
            ))}
        </div>
    );
}