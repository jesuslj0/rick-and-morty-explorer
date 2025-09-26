export interface  Character {
    id: number,
    name: string | undefined,
    status: string | undefined,
    species: string | undefined,
    type: string | undefined,
    gender: string | undefined,
    origin: {
        name: string | undefined,
        url: string | undefined,
    }
    location: {
        name: string | undefined,
        url: string | undefined
    }
    image: string | undefined,
    episode: string[] | undefined,
    url: string | undefined,
    created: string | undefined,
    
    map: () => any //Evita fallo
    filter: () => any 
}