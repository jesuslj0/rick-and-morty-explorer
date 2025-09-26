import type { ApiResponseModel } from "../models/ApiResponseModel";
import type { Character } from "../models/CharacterModel";

export const BASE_URL = "https://rickandmortyapi.com/api/character/"

export async function getCharacters(url: string): Promise<ApiResponseModel | undefined> {
    async function fetchData(url:string): Promise<ApiResponseModel> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data
    }

    if (url !== undefined) {
        try {
            const response = await fetchData(url);
        return response
        } catch (error) {
            console.error("Error fetching data:", error);
        return undefined
        }
    }
}

export async function getCharacterById(id: number): Promise<Character | undefined> {
    const url = `${BASE_URL}${id}`
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching character:", error);
        return undefined;
    }
}

export class FavoriteCharactersManager {
    private static readonly STORAGE_KEY = "favoriteCharacters";

    static getFavoriteCharacters(): Character[] {
        try {
            const storedCharacters = localStorage.getItem(FavoriteCharactersManager.STORAGE_KEY);
            return storedCharacters ? JSON.parse(storedCharacters) : [];
        } catch (error) {
            console.error("Error getting favorite characters from localStorage:", error);
            return [];
        }
    }

    static addFavoriteCharacter(character: Character): void {
        const characters = FavoriteCharactersManager.getFavoriteCharacters();
        characters.push(character);
        try {
            localStorage.setItem(FavoriteCharactersManager.STORAGE_KEY, JSON.stringify(characters));
        } catch (error) {
            console.error("Error adding favorite character to localStorage:", error);
        }
    }

    static removeFavoriteCharacter(characterId: number): void {
        let characters = FavoriteCharactersManager.getFavoriteCharacters();
        characters = characters.filter(char => char.id !== characterId);
        try {
            localStorage.setItem(FavoriteCharactersManager.STORAGE_KEY, JSON.stringify(characters));
        } catch (error) {
            console.error("Error removing favorite character from localStorage:", error);
        }
    }

    static clearFavoriteCharacters(): void {
        try {
            localStorage.removeItem(FavoriteCharactersManager.STORAGE_KEY);
        } catch (error) {
            console.error("Error clearing favorite characters from localStorage:", error);
        }
    }
}