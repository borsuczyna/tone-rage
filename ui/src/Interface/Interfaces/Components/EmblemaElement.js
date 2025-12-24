import { emblemasData } from "@shared/Models/Emblema";
import * as Icons from 'lucide-react';
export default function EmblemaElement({ emblema, size = '1rem' }) {
    const emblemaData = emblemasData[emblema];
    if (!emblemaData)
        return null;
    const IconComponent = Icons[emblemaData.icon];
    return (<IconComponent size={size} color={emblemaData.color} fill={emblemaData.color}/>);
}
