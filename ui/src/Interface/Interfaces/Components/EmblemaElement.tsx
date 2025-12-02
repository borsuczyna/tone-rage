import { emblemasData, type Emblema } from "@shared/Models/Emblema";
import * as Icons from 'lucide-react';

export default function EmblemaElement({ emblema, size = '1rem' }: { emblema: Emblema, size?: string }) {
    const emblemaData = emblemasData[emblema];
    if (!emblemaData)
        return null;

    const IconComponent = (Icons as any)[emblemaData.icon];

    return (
        <IconComponent size={size} color={emblemaData.color} fill={emblemaData.color} />
    );
}