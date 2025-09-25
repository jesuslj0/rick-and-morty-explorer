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