export interface TextureData {
    dictionary: string;
    name: string;
    url: string;
    key: string;
    width: number;
    height: number;
}

export interface TextureRequest {
    url: string;
    key: string;
    width: number;
    height: number;
}

export const defaultTextureDictionary = 'tone_textures';