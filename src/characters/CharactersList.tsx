import { useEffect, useState } from "react";
import type { Character } from "../models/CharacterModel";
import { BASE_URL, getCharacterById, getCharacters } from "../services/CharactersService";
import CharacterDetail from "./CharacterDetail";

interface Page {
    number: number,
    isSelected: boolean,
}

function CharacterList() {
    const [characters, setCharacters] = useState<Character[] | Character | undefined>(undefined);
    const [query, setQuery] = useState<string | undefined>("");
    const [filters, setFilters] = useState<string[] | undefined>(undefined);
    const [detail, setDetail] = useState<Character | undefined>(undefined);
    const [pages, setPages] = useState<Page[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            try {
            const response = await getCharacters(BASE_URL);
                setCharacters(response?.results);
            } catch (e: any) {
                setError(e.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
        }
        };

        const initialPages = [];
        for (let i = 1; i <= 9; i++) {
            initialPages.push({
                number: i,
                isSelected: i === 1,
            });
        }
        setPages(initialPages);

        fetchCharacters();
    }, []);

    async function searchCharacters() {
        setLoading(true)

        const queryURL = `?name=${query}`;
        const response = await getCharacters(BASE_URL.concat(queryURL));
        console.log(BASE_URL.concat(queryURL))

        if (response?.results) {
            setCharacters(response.results);
        } else {
            setCharacters([])
            setError("No characters found.");
        }
        setLoading(false)
    }

    async function applyFilters() {
        setLoading(true);
        let filterURL = "";

        if (query !== "") {
        filterURL += `?name=${query}`;
        }

        if (filters && filters.length > 0) {
            if (filters[0]) {
                filterURL += filterURL.length > 0 ? `&status=${filters[0]}` : `?status=${filters[0]}`;
            }
            if (filters[1]) {
                filterURL += filterURL.length > 0 ? `&gender=${filters[1]}` : `?gender=${filters[1]}`;
            }
            if (filters[2]) {
                filterURL += filterURL.length > 0 ? `&species=${filters[2]}` : `?species=${filters[2]}`;
            }
        }

        try {
            const filterApi = BASE_URL + filterURL;
            const response = await getCharacters(filterApi);

            if (response?.results) {
                setCharacters(response.results);
            } else {
                setCharacters([]);
                setError("No characters found.");
            }
        } catch (error: any) {
            setError(error.message || "An error occurred while fetching characters.");
        } finally {
            setLoading(false);
        }
    }

    async function setCharacterDetails(id: number) {
        try {
            const character = await getCharacterById(id);
            if (character) {
                setDetail(character);
            }
        } catch (error: any) {
            setError(error.message || "Failed to fetch character details.");
        }
    }

    async function loadPage(page: number) {
            setLoading(true);
            let pageFilterURL = "";

            if (query !== "") {
                pageFilterURL += `?name=${query}`;
            }

            if (filters && filters.length > 0) {
                if (filters[0]) {
                    pageFilterURL += pageFilterURL.length > 0 ? `&status=${filters[0]}` : `?status=${filters[0]}`;
                }
                if (filters[1]) {
                    pageFilterURL += pageFilterURL.length > 0 ? `&gender=${filters[1]}` : `?gender=${filters[1]}`;
                }
                if (filters[2]) {
                    pageFilterURL += pageFilterURL.length > 0 ? `&species=${filters[2]}` : `?species=${filters[2]}`;
                }
            }

            pageFilterURL += pageFilterURL.length > 0 ? `&page=${page}` : `?page=${page}`;

            try {
                const pageApi = BASE_URL + pageFilterURL;
                const response = await getCharacters(pageApi);

                if (response?.results) {
                    setCharacters(response.results);
                } else {
                    setCharacters([]);
                }
            } catch (error: any) {
                setError(error.message || "An error occurred while fetching characters.");
            } finally {
                setLoading(false);
            }

            pages?.map((p) => ({
                 number: p.number++,
                 isSelected: false,
            }))

            const updatedPages = pages?.map((p) => ({
                ...p,
                isSelected: p.number === page,
            }));


            setPages(updatedPages || null);
    }

    async function setFirstPages() {
        const initialPages = [];
        for (let i = 1; i <= 9; i++) {
            initialPages.push({
                number: i,
                isSelected: false,
            });
        }
        setPages(initialPages);
    }

    if (loading) {
        return <div>Loading characters...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
        <div style={{display: "flex", margin: "20px 10px", justifyContent: "space-between"}}>
            <div style={{display: "flex"}}>
                <input 
                    type="text" 
                    placeholder="Search by name" 
                    onChange={(ev) => setQuery(ev.target.value)}
                    style={{padding: "8px 16px"}}></input>
                <button type="submit" onClick={() => {searchCharacters(), setQuery("")}}>🔎</button>
            </div>
            <div>
                <form id="filters" style={{display: "flex", alignContent:"center", gap: "10px"}}>
                    <label htmlFor="status" style={{position: "relative", top: "10px"}}>Status</label>
                    <select id="status" value={filters && filters[0] ? filters[0] : ""} onChange={(ev) => setFilters(prevFilters => {
                        const newFilters = prevFilters ? [...prevFilters] : [];
                        newFilters[0] = ev.target.value;
                        return newFilters;
                    })}>
                        <option value="">All</option>
                        <option value="alive">Alive</option>
                        <option value="dead">Dead</option>
                        <option value="unknown">Unknown</option>
                    </select>
                    <label htmlFor="gender" style={{position: "relative", top: "10px"}}>Gender</label>
                    <select id="gender" value={filters && filters[1] ? filters[1] : ""} onChange={(ev) => setFilters(prevFilters => {
                        const newFilters = prevFilters ? [...prevFilters] : [];
                        newFilters[1] = ev.target.value;
                        return newFilters;
                    })}>
                        <option value="">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="genderless">Genderless</option>
                        <option value="unknown">Unknown</option>
                    </select>
                    <label htmlFor="species" style={{position: "relative", top: "10px"}}>Species</label>
                    <select id="species" value={filters && filters[2] ? filters[2] : ""} onChange={(ev) => setFilters(prevFilters => {
                        const newFilters = prevFilters ? [...prevFilters] : [];
                        newFilters[2] = ev.target.value;
                        return newFilters;
                    })}>
                        <option value="">All</option>
                        <option value="human">Human</option>
                        <option value="alien">Alien</option>
                        <option value="robot">Robot</option>
                        <option value="humanoid">Humanoid</option>
                    </select>
                    <button type="submit" onClick={() => applyFilters()}>Filter</button>
                </form>
            </div>
        </div>
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
                    <img 
                        className="character-img"
                        src={character.image} 
                        alt={character.name} 
                        style={{ maxWidth: "100%", height: "auto"}} 
                        onClick={() => setCharacterDetails(character.id)}/>
                    <h3 style={{ marginBottom: "10px"}}>{character.name}</h3>
                    <p style={{fontSize: "12px", textAlign: 'center'}}>
                        <span>
                            {character.status === "Alive" && "🟢 Alive"}
                            {character.status === "Dead" && "🔴 Dead"}
                            {character.status === "unknown" && "❔ Unknown"}
                        </span> | {character.species}
                    </p>
                </div>
            ))}
        </div>
        {detail && (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000}}>
                <CharacterDetail character={detail} />
                <button 
                    style={{ position: 'absolute', top: '20px', right: '30px'}}
                    onClick={() => setDetail(undefined)}
                    >
                    Close</button>
        </div>
        )}
        <div className="pagination">
            <button className="firstPage" onClick={() => setFirstPages()}>◀️</button>
            <ul style={{ display: "flex", flexDirection: "row", gap: "10px", listStyle: "none", justifyContent: "center", padding: "0px"}}>
                {pages && pages.map((page) => (
                    <li key={page.number}>
                        <button onClick={() => loadPage(page.number)} className={page.isSelected ? "selected" : ""}>{page.number}</button>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default CharacterList;