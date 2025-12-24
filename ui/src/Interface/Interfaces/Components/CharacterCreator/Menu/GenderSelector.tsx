import csx from 'src/Utils/MergeClass';
import styles from '../../../Styles/CharacterCreatorInterface.module.css';
import { CharacterGender } from '@shared/Models/Character/Character';
import translate from '@shared/Translation/Translation';
import OptionLabel from './OptionLabel';

interface GenderSelectorProps {
    gender: CharacterGender;
    setGender: (gender: CharacterGender) => void;
}

export default function GenderSelector({ gender, setGender }: GenderSelectorProps) {
    return (
        <>
            <OptionLabel label={translate('character.creator.gender')} />
            <div className={styles.genderOptions}>
                <div 
                    className={csx(styles.genderOption, styles.male, gender === CharacterGender.Male && styles.active)} 
                    onClick={() => setGender(CharacterGender.Male)}
                >
                    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M276.956 0V57.674H413.545L312.156 159.063C279.612 134.919 239.319 120.632 195.685 120.632C87.611 120.632 0 208.242 0 316.316C0 424.389 87.611 512 195.684 512C303.757 512 391.368 424.389 391.368 316.316C391.368 272.682 377.081 232.388 352.937 199.844L454.326 98.456V235.045H512V0L276.956 0ZM195.684 447.552C123.204 447.552 64.447 388.795 64.447 316.315C64.447 243.835 123.204 185.078 195.684 185.078C268.164 185.078 326.921 243.835 326.921 316.315C326.921 388.796 268.164 447.552 195.684 447.552Z" fill="currentColor"/>
                    </svg>
                    {translate('character.creator.gender.male')}
                </div>
                <div 
                    className={csx(styles.genderOption, styles.female, gender === CharacterGender.Female && styles.active)} 
                    onClick={() => setGender(CharacterGender.Female)}
                >
                    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M256 0C164.874 0 91 73.874 91 165C91 245.867 149.218 313.019 226 327.144V376H151V436H226V512H286V436H361V376H286V327.144C362.782 313.019 421 245.867 421 165C421 73.874 347.126 0 256 0ZM256 270C198.109 270 151 222.891 151 165C151 107.109 198.109 60 256 60C313.891 60 361 107.109 361 165C361 222.891 313.891 270 256 270Z" fill="currentColor"/>
                    </svg>
                    {translate('character.creator.gender.female')}
                </div>
            </div>
        </>
    );
}