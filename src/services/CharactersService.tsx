import type { ApiResponseModel } from "../models/ApiResponseModel";

export const BASE_URL = "https://rickandmortyapi.com/api/character"

async function characterService(url: string): Promise<ApiResponseModel | undefined> {
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

export default characterService;