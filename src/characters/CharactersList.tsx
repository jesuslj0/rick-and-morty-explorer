import { useEffect, useState } from "react";
import type { Character } from "../models/CharacterModel";
import characterService from "../services/CharactersService";
import { BASE_URL } from "../services/CharactersService";

function CharacterList() {
    const [characters, setCharacters] = useState<Character[] | Character>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            try {
            const response = await characterService(BASE_URL);
                setCharacters(response?.results);
            } catch (e: any) {
                setError(e.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
        }
        };

        fetchCharacters();
    }, []);

    if (loading) {
        return <div>Loading characters...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={
            {
                display: "grid", 
                maxWidth: "90vw",
                minWidth: "300px",
                padding: "0px 10px",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gridTemplateRows: "auto",
                gap: "10px",
            }}>
            {characters && Array.isArray(characters) && characters.map((character: Character) => (
                <div key={character.id} style={{ padding: "5px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={character.image} alt={character.name} style={{ maxWidth: "100%", height: "auto" }} />
                    <h3 style={{ marginBottom: "10px"}}>{character.name}</h3>
                    <p style={{fontSize: "12px", textAlign: 'center'}}>
                        <span>
                            {character.status === "Alive" && "🟢 Alive"}
                            {character.status === "Dead" && "🔴 Dead"}
                            {character.status === "unknown" && "❔ Unknown"}
                        </span> | {character.species}
                    </p>
                    <p style={{fontSize: "10px", textAlign: 'center'}}>📍 Location: {character.location.name}</p>
                </div>
            ))}
        </div>
    )
}

export default CharacterList;