import { RefreshCcw } from "lucide-react";
import Button from "../../Button";
export default function RandomizeButton({ onClick, style }) {
    return (<Button variant='primary' size='medium' fullWidth onClick={onClick} wrapperStyle={style}>
            Randomize
            <RefreshCcw style={{ marginTop: '0.15rem' }} size='1rem'/>
        </Button>);
}
