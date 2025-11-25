export interface InteractionWheelData {
    id: string;
    label: string;
    icon: string;
    color?: string;
};

export interface InteractionWheelConfig {
    title?: string;
    subtitle?: string;
}

export interface InteractionWheelResponse {
    interactions: InteractionWheelData[];
    config: InteractionWheelConfig;
}