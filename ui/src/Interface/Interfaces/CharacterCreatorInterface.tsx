import { useState } from 'react';
import styles from './Styles/CharacterCreatorInterface.module.css';
import csx from 'src/Utils/MergeClass';
import { HardHatIcon, ScanFace, User } from 'lucide-react';

interface CategoryItemProps {
    category: number;
    active?: boolean;
    setActiveCategory?: (category: number) => void;
    activeItemGhost?: boolean;
}

function CategoryItem({ category, active, setActiveCategory, activeItemGhost }: CategoryItemProps) {
    const color = activeItemGhost ? '#FF2D55' : '#88888800';
    const postfix = activeItemGhost ? 'active' : 'inactive';
    const textColor = activeItemGhost ? '#ffffff' : '#ffffff77';

    return (
        <>
            <svg width="1920" height="1080" viewBox="0 0 530 1294" fill="none" className={csx(styles.category, activeItemGhost && styles.activeGhost, active && styles.active)} onClick={() => setActiveCategory && setActiveCategory(category)} xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#category_clip)">
                    {category == 0 && (<>
                        <path d="M527 -4.5L527.647 -1.64648C459.669 30.8742 352.439 113.837 273.479 251.447L272.737 252.739L271.44 252.006L127.845 170.868L126.55 170.136L127.271 168.835C171.937 88.193 219.504 28.7938 253.456 -4.07812L253.893 -4.5H527Z" fill={`url(#paint6_radial_2013_59_${postfix})`} stroke={`url(#paint7_radial_2013_59_${postfix})`}/>
                        <path transform='translate(5, 3)' fill-rule="evenodd" clip-rule="evenodd" d="M227.322 125.87C227.466 125.543 227.929 125.543 228.074 125.87L228.443 126.682C230.025 129.969 232.517 132.728 235.619 134.629L236.195 134.968C236.462 135.119 236.462 135.506 236.195 135.657L235.619 135.996C232.517 137.897 230.025 140.656 228.443 143.943L228.074 144.755C227.929 145.082 227.466 145.082 227.322 144.755L226.952 143.943C225.37 140.656 222.879 137.897 219.777 135.996L219.201 135.657C218.933 135.506 218.933 135.119 219.201 134.968L219.777 134.629C222.879 132.728 225.37 129.969 226.952 126.682C227.081 126.414 227.201 126.142 227.322 125.87ZM227.691 133.486L227.31 133.936C227.039 134.242 226.761 134.541 226.474 134.833L226.039 135.264L225.98 135.316L226.474 135.804L226.898 136.246L227.31 136.7L227.691 137.149L228.073 136.7C228.344 136.394 228.622 136.095 228.909 135.804L229.402 135.316L229.344 135.264C229.05 134.98 228.764 134.689 228.485 134.39L228.073 133.936L227.691 133.486ZM246.121 103.43C246.374 102.857 247.184 102.857 247.437 103.43L247.765 104.164L248.084 104.85L248.51 105.703L249.001 106.618L249.245 107.048C251.413 110.806 254.291 114.098 257.714 116.739L258.643 117.43C259.291 117.895 259.957 118.338 260.641 118.757C260.973 118.96 261.309 119.158 261.649 119.35C262.117 119.614 262.117 120.292 261.649 120.557C261.309 120.749 260.973 120.946 260.641 121.15C260.185 121.429 259.737 121.719 259.297 122.019L258.513 122.57C254.738 125.305 251.579 128.812 249.245 132.859L248.959 133.365C248.652 133.919 248.36 134.483 248.084 135.057L247.765 135.743L247.437 136.477C247.184 137.05 246.374 137.05 246.121 136.477L245.794 135.743L245.474 135.057L245.048 134.203L244.557 133.288L244.313 132.859C242.146 129.101 239.267 125.809 235.844 123.168L234.916 122.476C234.267 122.011 233.601 121.569 232.917 121.15C232.585 120.946 232.249 120.749 231.909 120.557C231.441 120.292 231.441 119.614 231.909 119.35C232.249 119.158 232.585 118.96 232.917 118.757C233.373 118.477 233.821 118.188 234.261 117.888L235.045 117.337C238.82 114.601 241.979 111.095 244.313 107.048L244.599 106.542C244.906 105.988 245.198 105.423 245.474 104.85L245.794 104.164L246.121 103.43ZM246.779 111.326C244.592 114.602 241.904 117.515 238.814 119.953C241.904 122.392 244.592 125.304 246.779 128.58C248.966 125.304 251.654 122.392 254.744 119.953C251.654 117.515 248.966 114.602 246.779 111.326Z" fill={textColor}/>
                        <text x="245" y="180" fill={textColor} fontSize="20" fontWeight="normal" fontFamily="Arial" textAnchor="middle">DNA</text>
                    </>)}
                    {category == 1 && (<>
                        <path d="M129.321 168.256L272.916 249.394L274.23 250.137L273.479 251.447C242.108 306.121 215.202 369.418 196.993 441.601L196.624 443.063L195.163 442.686L35.3965 401.432L33.9336 401.054L34.3223 399.594C57.8893 310.928 91.6656 233.12 127.271 168.835L128.004 167.512L129.321 168.256Z" fill={`url(#paint5_radial_2013_59_${postfix})`} stroke={color} transform='translate(-1, 3)'/>
                        <path transform='translate(-4, 2)' d="M134.248 298.43C134.248 298.43 132.49 283.996 150.59 283C150.023 283.28 149.54 283.709 149.191 284.242C152.054 283.427 155.042 283.162 158.001 283.462C157.12 283.55 156.286 283.909 155.61 284.492C155.61 284.492 161.953 283.492 166.55 285.568C165.514 285.594 164.504 285.901 163.624 286.457C166.79 286.743 169.742 288.21 171.912 290.575C171.428 290.535 170.94 290.583 170.472 290.716C172.103 291.396 173.628 292.314 175 293.44C175 293.44 172.363 294.771 170.812 299.056C170.812 299.056 174.714 300.324 174.53 307.062C174.09 311.3 173.063 315.453 171.481 319.399C171.317 319.824 170.878 320.07 170.438 319.982C169.967 319.89 169.644 319.448 169.692 318.962C169.864 317.256 170.025 313.302 168.368 310.12C167.995 309.384 167.584 308.668 167.137 307.976C166.51 307.127 166.059 306.157 165.809 305.126C165.809 305.126 155.125 306.707 146.586 305.667C138.048 304.627 139.078 303.508 136.597 303.255C136.597 303.255 137.055 305.906 135.463 307.715C134.397 309.061 133.605 310.609 133.134 312.27C132.69 314.492 132.569 316.769 132.776 319.027C132.802 319.435 132.546 319.808 132.16 319.924C131.744 320.046 131.303 319.834 131.131 319.429C130.141 317.061 127.155 309.263 128.23 303.694C128.642 301.392 130.255 299.502 132.437 298.767C133.025 298.58 133.633 298.467 134.248 298.43Z" fill={textColor}/>
                        <text x="147" y="353" fill={textColor} fontSize="20" fontWeight="normal" fontFamily="Arial" textAnchor="middle">Hair</text>
                    </>)}
                    {category == 2 && (<>
                        <path d="M36.1465 398.528L195.913 439.782L197.357 440.155L196.993 441.601C181.245 504.027 172 573.107 172 649.012V650.512H1.5V649.012C1.50003 559.053 14.1836 475.358 34.3213 399.594L34.7041 398.155L36.1465 398.528Z" fill={`url(#paint4_radial_2013_59_${postfix})`} stroke={color} transform='translate(-2, 6)'/>
                        <path transform='translate(1, 0)' d="M117.193 524.849C116.805 524.99 116.55 525.367 116.562 525.78C116.597 527.183 116.006 528.488 114.942 529.365C113.767 530.334 112.142 530.65 110.376 530.249C108.36 529.796 107.1 528.424 105.766 526.97C104.465 525.551 103.118 524.084 101.024 523.416C98.5338 522.621 96.0882 522.973 94.1406 524.409C93.2373 525.073 92.525 525.938 91.9981 526.902C91.4711 525.938 90.7589 525.073 89.8555 524.409C87.906 522.975 85.4605 522.621 82.9724 523.416C80.8781 524.084 79.5309 525.551 78.2299 526.97C76.8961 528.424 75.6376 529.796 73.6225 530.249C71.8544 530.652 70.2311 530.334 69.0537 529.365C67.9901 528.49 67.3995 527.183 67.4342 525.78C67.4439 525.365 67.191 524.99 66.8031 524.849C66.4189 524.702 65.9808 524.823 65.7202 525.145C65.5754 525.325 62.2111 529.585 65.3014 534.837C67.5944 538.735 72.6188 541 78.475 541C79.8513 541 81.2738 540.876 82.7176 540.617C87.3791 539.782 90.5292 537.736 92 534.752C93.4708 537.736 96.6209 539.782 101.282 540.617C102.726 540.876 104.147 541 105.525 541C111.381 541 116.406 538.735 118.699 534.837C121.789 529.585 118.425 525.325 118.28 525.145C118.015 524.823 117.577 524.702 117.193 524.849Z" fill={textColor}/>
                        <text x="95" y="575" fill={textColor} fontSize="20" fontWeight="normal" fontFamily="Arial" textAnchor="middle">Facial hair</text>
                    </>)}
                    {category == 3 && (<>
                        <path d="M172 647.512V649.012C172 728.784 182.211 800.901 199.449 865.6L199.833 867.042L198.395 867.434L39.3945 910.768L37.958 911.16L37.5557 909.726C15.5513 831.215 1.5 743.696 1.5 649.012V647.512H172Z" fill={`url(#paint3_radial_2013_59_${postfix})`} stroke={color} transform='translate(-2, 9)'/>
                        <path transform='translate(0, 8)' d="M122.597 751.183C122.115 750.645 110.521 738 96.0001 738C81.4789 738 69.8854 750.645 69.4033 751.183C68.8656 751.784 68.8656 752.693 69.4033 753.293C69.8854 753.831 81.4791 766.477 96.0001 766.477C110.521 766.477 122.115 753.831 122.597 753.293C123.134 752.693 123.134 751.784 122.597 751.183ZM96.0001 763.312C89.8944 763.312 84.9258 758.344 84.9258 752.238C84.9258 746.133 89.8944 741.164 96.0001 741.164C102.106 741.164 107.074 746.133 107.074 752.238C107.074 758.344 102.106 763.312 96.0001 763.312Z" fill={textColor}/>
                        <path transform='translate(0, 8)' d="M97.582 748.836C97.582 747.244 98.3721 745.844 99.574 744.983C98.4955 744.431 97.2925 744.09 96 744.09C91.6386 744.09 88.0898 747.639 88.0898 752C88.0898 756.361 91.6386 759.91 96 759.91C99.9049 759.91 103.137 757.059 103.775 753.333C100.59 754.359 97.582 751.95 97.582 748.836Z" fill={textColor}/>
                        <text x="96" y="808" fill={textColor} fontSize="20" fontWeight="normal" fontFamily="Arial" textAnchor="middle">Eyes</text>
                    </>)}
                    {category == 4 && (<>
                        <path d="M199.449 865.601C218.178 935.893 245.205 997.437 276.455 1050.53L277.219 1051.83L275.919 1052.59L133.756 1135.57L132.448 1136.33L131.697 1135.02C96.0797 1072.64 61.9357 996.713 37.5557 909.726L37.1475 908.271L38.6055 907.874L197.605 864.54L199.062 864.143L199.449 865.601Z" fill={`url(#paint2_radial_2013_59_${postfix})`} stroke={color} transform='translate(-1, 12)'/>
                        <path transform='translate(-1, 16)' d="M176.671 980.012L175.211 980.051V982.624C175.211 982.754 175.142 982.879 175.021 982.947L174.377 983.304C174.17 983.423 174.124 983.701 174.28 983.882L174.866 984.551C174.992 984.698 174.992 984.919 174.849 985.061L173.992 985.939C173.883 986.064 173.86 986.245 173.946 986.386C174.343 987.05 174.527 987.746 174.527 988.421C174.527 990.727 172.446 992.79 169.831 992.393L163.91 991.486L163.398 997H141.774C142.677 993.192 142.889 990.359 142.843 986.092C142.82 984.63 142.366 984.347 140.378 981.593C117.115 949.418 164.18 931.925 174.826 960.207C176.01 963.341 175.337 966.661 174.05 969.727L178.585 976.311C179.642 977.858 178.562 979.955 176.671 980.012Z" fill={textColor}/>
                        <text x="158" y="1042" fill={textColor} fontSize="20" fontWeight="normal" fontFamily="Arial" textAnchor="middle">Face</text>
                    </>)}
                    {category == 5 && (<>
                        <path d="M276.455 1050.53C355.112 1184.18 460.512 1264.29 527.635 1295.64L527 1298.5H253.9L253.466 1298.09C220.628 1266.82 175.06 1210.95 131.697 1135.02L130.961 1133.73L132.244 1132.98L274.406 1050L275.697 1049.25L276.455 1050.53Z" fill={`url(#paint0_radial_2013_59_${postfix})`} stroke={`url(#paint1_linear_2013_59_${postfix})`} transform='translate(0, 15)'/>
                        <path transform='translate(-28, -22)' d="M288.22 1153L287.443 1153.79V1153H283.611C281.883 1155.7 278.236 1157.57 274.001 1157.57C269.768 1157.57 266.12 1155.7 264.392 1153H260.561V1153.79L259.781 1153L246 1166.95L253.538 1174.58L260.561 1167.47V1195H287.439V1167.47L294.463 1174.58L302 1166.95L288.22 1153Z" fill={textColor}/>
                        <text x="246" y="1203" fill={textColor} fontSize="20" fontWeight="normal" fontFamily="Arial" textAnchor="middle">Clothes</text>
                    </>)}
                </g>
            </svg>
        </>
    )
}

export default function CharacterCreatorInterface() {
    const [hiding, _setHiding] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);
    const activeColor = '#FF2D55';
    const color = '#88888855';
    
    return (
        <div className={csx(styles.container, hiding && styles.hiding)}>
            <div className={styles.categories}>
                <svg>
                    <defs>
                        <defs>
                            <radialGradient id="paint0_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(222.5 1136.5) rotate(50.5651) scale(207.808 333.23)">
                                <stop stop-color={color} stop-opacity={activeCategory == 5 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={color} stop-opacity="0.45"/>
                            </radialGradient>
                            <linearGradient id="paint1_linear_2013_59_inactive" x1="205.5" y1="1103" x2="363.5" y2="1297" gradientUnits="userSpaceOnUse">
                                <stop stop-color={color}/>
                                <stop offset="1" stop-color={color} stop-opacity="0.45"/>
                            </linearGradient>
                            <radialGradient id="paint2_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(152.5 1000) rotate(98.9229) scale(209.536 184.448)">
                                <stop stop-color={color} stop-opacity={activeCategory == 4 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={color} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint3_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(93 779) rotate(112.709) scale(222.769 166.879)">
                                <stop stop-color={color} stop-opacity={activeCategory == 3 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={color} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint4_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(94.5 533) rotate(120.753) scale(186.763 144.395)">
                                <stop stop-color={color} stop-opacity={activeCategory == 2 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={color} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint5_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(147 320) rotate(143.655) scale(152.706 132.884)">
                                <stop stop-color={color} stop-opacity={activeCategory == 1 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={color} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint6_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 149) rotate(-28.2174) scale(255.913 401.891)">
                                <stop stop-color={color} stop-opacity={activeCategory == 0 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={color} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint7_radial_2013_59_inactive" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(215 190) rotate(-52.0379) scale(230.842 362.519)">
                                <stop stop-color={color} stop-opacity={activeCategory == 0 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={color} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint0_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(222.5 1136.5) rotate(50.5651) scale(207.808 333.23)">
                                <stop stop-color={activeColor} stop-opacity={activeCategory == 5 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={activeColor} stop-opacity="0.45"/>
                            </radialGradient>
                            <linearGradient id="paint1_linear_2013_59_active" x1="205.5" y1="1103" x2="363.5" y2="1297" gradientUnits="userSpaceOnUse">
                                <stop stop-color={activeColor}/>
                                <stop offset="1" stop-color={activeColor} stop-opacity="0.45"/>
                            </linearGradient>
                            <radialGradient id="paint2_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(152.5 1000) rotate(98.9229) scale(209.536 184.448)">
                                <stop stop-color={activeColor} stop-opacity={activeCategory == 4 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={activeColor} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint3_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(93 779) rotate(112.709) scale(222.769 166.879)">
                                <stop stop-color={activeColor} stop-opacity={activeCategory == 3 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={activeColor} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint4_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(94.5 533) rotate(120.753) scale(186.763 144.395)">
                                <stop stop-color={activeColor} stop-opacity={activeCategory == 2 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={activeColor} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint5_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(147 320) rotate(143.655) scale(152.706 132.884)">
                                <stop stop-color={activeColor} stop-opacity={activeCategory == 1 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={activeColor} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint6_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 149) rotate(-28.2174) scale(255.913 401.891)">
                                <stop stop-color={activeColor} stop-opacity={activeCategory == 0 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={activeColor} stop-opacity="0.45"/>
                            </radialGradient>
                            <radialGradient id="paint7_radial_2013_59_active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(215 190) rotate(-52.0379) scale(230.842 362.519)">
                                <stop stop-color={activeColor} stop-opacity={activeCategory == 0 ? "0.7" : "0.45"}/>
                                <stop offset="1" stop-color={activeColor} stop-opacity="0.45"/>
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
        </div>
    );
}