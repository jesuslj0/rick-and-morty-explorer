import type { Character } from "../models/CharacterModel";

interface CharacterDetailProps {
  character: Character;
}
const CharacterDetail = ({ character }: CharacterDetailProps) => {
  return (
    <div className="character-detail">
      <img src={character.image} alt={character.name} className="character-image" />
      <div className="character-info">
        <h2>{character.name}</h2>
        <p><strong>Status:</strong> {character.status}</p>
        <p><strong>Species:</strong> {character.species}</p>
        <p><strong>Gender:</strong> {character.gender}</p>
        <p><strong>Origin:</strong> {character.origin.name}</p>
        <p><strong>Location:</strong> {character.location.name}</p>
        <p><strong>Episodes:</strong></p>
        <div className="episodes-container">
          <ul className="episodes-list">
            {character.episode?.map((episode) => (
              <li key={episode} className="episode-item">
                <a href={episode}>{episode.split('/')[4].charAt(0).toUpperCase() + episode.split('/')[4].slice(1) + " " + episode.split('/')[5]}</a>
              </li>
            ))}
        </ul>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;