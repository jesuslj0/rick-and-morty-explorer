import type { Character } from './CharacterModel';
export interface ApiResponseModel {
    info: {
        count: number,
        pages: number,
        next: string,
        prev: string,
    }
    results: [Character] | Character
}