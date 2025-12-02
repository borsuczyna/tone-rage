export interface TextureData {
    dictionary: string;
    name: string;
    url: string;
    key: string;
    width: number;
    height: number;
    lastUsed?: number;
}

export interface TextureRequest {
    url: string;
    key: string;
    width: number;
    height: number;
}

export interface MarkerTextureRequest {
    icon: string;
    upperText: string;
    lowerText: string;
    key: string;
}

export interface TextureUnloadRequest {
    dictionary: string;
    name: string;
}

export const defaultTextureDictionary = 'tone_textures';