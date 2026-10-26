import React, { useState } from 'react';
import { playClickSfx } from '../audioEngine';

export const ALBUMS_DATA = [
  {
    id: 'scotty',
    band: 'LUSTRA',
    title: "SCOTTY DOESN'T KNOW",
    sub: 'EUROTRIP OST // HIGH SPEED POP-PUNK',
    artClass: 'scotty-art',
    stickerText: 'PARENTAL WARNING',
    stickerClass: 'red-tilt',
    artContent: (
      <>
        <div className="dither-overlay" />
        <div className="collage-warning-badge">LIVE IN BRATISLAVA</div>
        <div className="stencil-giant">SCOTTY</div>
        <div className="sub-stencil">DOESN'T KNOW!</div>
        <div className="barcode-graphic">||| | ||||| |||</div>
      </>
    ),
    backstageNotes: "Recorded at 172 BPM on overloaded analog 8-track tape. Featured prominently in the cult movie EuroTrip. The ultimate anthem of teenage denial and razor-sharp guitar power chords.",
    recipe: "GUITAR: 1978 Gibson Les Paul Custom // AMP: Marshall JCM800 // PEDAL: ProCo Rat Distortion",
    lyrics: '"Scotty doesn\'t know that Fiona and me do it in my van every Sunday..."'
  },
  {
    id: 'tongue',
    band: 'GROUPLOVE',
    title: 'TONGUE TIED',
    sub: 'NEVER TRUST A HAPPY SONG // INDIE SURGE',
    artClass: 'tongue-art',
    stickerText: 'SYNTH-FUZZ',
    stickerClass: 'cyan-tilt',
    artContent: (
      <>
        <div className="dither-overlay" />
        <div className="brutalist-eye-art">
          <div className="eye-iris">
            <div className="eye-pupil" />
          </div>
        </div>
        <div className="warped-title">TONGUE TIED</div>
      </>
    ),
    backstageNotes: "An electrifying blend of fuzzy indie power pop and euphoric synths. High octane celebration of friendship and late night madness, pulsing with dance-punk energy.",
    recipe: "GUITAR: Fender Telecaster Thinline // SYNTH: Roland Juno-106 // FX: Electro-Harmonix Memory Man",
    lyrics: '"Take me to your best friend\'s house, roll on the floor until our eyes pop out..."'
  },
  {
    id: 'threshold',
    band: 'SONIC BOB-OMB',
    title: 'THRESHOLD',
    sub: 'TORONTO GARAGE BATTLE // SCOTT PILGRIM',
    artClass: 'threshold-art',
    stickerText: '1-UP EXTRA LIFE',
    stickerClass: 'yellow-tilt',
    artContent: (
      <>
        <div className="dither-overlay" />
        <div className="threshold-stencil">THRESHOLD</div>
        <div className="bobomb-pixel-bomb">💣</div>
        <div className="band-tag-spray">SONIC BOB-OMB</div>
      </>
    ),
    backstageNotes: "Composed by Beck for the Scott Pilgrim comic universe. Raw, punchy garage rock with buzzing bass distortion and onomatopoeic drum hits. We are Sonic Bob-Omb and we are here to make money and sell out!",
    recipe: "BASS: Rickenbacker 4001S // DRUMS: Ludwig Silver Sparkle // VOCALS: Shure SM58 overloaded",
    lyrics: '"We are Sonic Bob-Omb and we are here to make you think about death and get sad and stuff!"'
  },
  {
    id: 'blacksheep',
    band: 'THE CLASH AT DEMONHEAD',
    title: 'BLACK SHEEP',
    sub: 'ENVY ADAMS // SYNTH BASS DOMINATION',
    artClass: 'blacksheep-art',
    stickerText: 'VEGAN POLICE',
    stickerClass: 'orange-tilt',
    artContent: (
      <>
        <div className="dither-overlay" />
        <div className="cyber-glitch-circle" />
        <div className="clash-headline">BLACK SHEEP</div>
        <div className="band-label-chrome">THE CLASH AT DEMONHEAD</div>
      </>
    ),
    backstageNotes: "Originally written by Metric and performed by Brie Larson as Envy Adams. Featuring Todd Ingram's psychic vegan bass line that shatters concrete floors.",
    recipe: "BASS: Fender Precision Bass + Big Muff Pi // SYNTH: Moog Sub Phatty // CHOP: Sidechain Compression",
    lyrics: '"Sending signals to the moon, can\'t hear me calling you. Hello, again, friend of a friend..."'
  },
  {
    id: 'lastnite',
    band: 'THE STROKES',
    title: 'LAST NITE',
    sub: 'IS THIS IT // NYC GARAGE REVOLUTION',
    artClass: 'lastnite-art',
    stickerText: 'LO-FI RAW',
    stickerClass: 'toxic-green-tilt',
    artContent: (
      <>
        <div className="dither-overlay" />
        <div className="strokes-title">LAST NITE</div>
        <div className="sub-strokes">THE STROKES // 2001</div>
      </>
    ),
    backstageNotes: "Recorded at Transmit Studios with blown-out tube preamps. The definitive blueprint for 2000s indie rock revival: crisp Fender guitars and effortless cool.",
    recipe: "GUITAR 1: Riviera Epiphone // GUITAR 2: Fender Stratocaster // AMPS: Fender Hot Rod DeVille",
    lyrics: '"Last night, she said: Oh, baby, I feel so down. Oh, and you say things you know you\'ll regret..."'
  },
  {
    id: 'nirvana',
    band: 'NIRVANA',
    title: 'SMELLS LIKE TEEN SPIRIT',
    sub: 'NEVERMIND // SEATTLE GRUNGE MASTER',
    artClass: 'nirvana-art',
    stickerText: 'SUB POP 100',
    stickerClass: 'red-tilt',
    artContent: (
      <>
        <div className="dither-overlay" />
        <div className="nirvana-smile">☻</div>
        <div className="nirvana-title">TEEN SPIRIT</div>
      </>
    ),
    backstageNotes: "Produced by Butch Vig with dynamic quiet/loud/quiet sonic architecture. The 4-chord drop that changed rock music history and defined modern guitar crunch.",
    recipe: "GUITAR: 1965 Fender Jaguar // PEDAL: BOSS DS-1 Distortion + Small Clone Chorus // AMP: Mesa/Boogie",
    lyrics: '"Load up on guns, bring your friends. It\'s fun to lose and to pretend..."'
  }
];

export default function AlbumCrate({ activeTrackId, onSelectTrack, onTriggerBurst, onAddScore }) {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id, e) => {
    e.stopPropagation();
    playClickSfx(520);
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePlay = (album, e) => {
    playClickSfx(720);
    onSelectTrack(album.id);
    if (onAddScore) onAddScore(500);
    if (onTriggerBurst && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      onTriggerBurst('CRANK IT!', rect.left + rect.width / 2, rect.top);
    }
  };

  return (
    <section className="albums-section" id="albums-section">
      <div className="section-title-bar">
        <h2 className="section-title">THE VINYL & CD CRATE // 3D FLIP DOSSIERS</h2>
        <span className="section-badge">6 MASTER RELEASES</span>
      </div>

      <div className="albums-grid">
        {ALBUMS_DATA.map((album) => {
          const isFlipped = !!flippedCards[album.id];
          const isPlaying = activeTrackId === album.id;

          return (
            <div key={album.id} className="album-card-wrap">
              <div className={`album-card ${isFlipped ? 'is-flipped' : ''}`}>
                {/* Front Side */}
                <div className="card-side card-front">
                  <div className="tape-strip top-tape">MASTER TAPE ARCHIVE</div>
                  <div className={`sticker-slap ${album.stickerClass}`}>{album.stickerText}</div>

                  <div className={`cover-art-container ${album.artClass}`}>
                    {album.artContent}
                  </div>

                  <div className="card-meta">
                    <div className="card-band">{album.band}</div>
                    <div className="card-title">{album.title}</div>
                    <div className="card-sub">{album.sub}</div>
                  </div>

                  <div className="card-action-bar">
                    <button
                      type="button"
                      className={`brutal-btn ${isPlaying ? 'btn-danger' : 'btn-primary'}`}
                      style={{ flex: 1 }}
                      onClick={(e) => handlePlay(album, e)}
                    >
                      {isPlaying ? '⚡ PLAYING RIFF' : '▶ PLAY RIFF'}
                    </button>
                    <button
                      type="button"
                      className="brutal-btn"
                      style={{ background: '#FFF', color: '#000' }}
                      onClick={(e) => toggleFlip(album.id, e)}
                    >
                      FLIP ⟲
                    </button>
                  </div>
                </div>

                {/* Back Side */}
                <div className="card-side card-back">
                  <div className="tape-strip side-tape">CONFIDENTIAL</div>
                  <div className="backstage-content">
                    <div className="back-title">DOSSIER // {album.title}</div>
                    <div className="back-text">{album.backstageNotes}</div>

                    <div className="track-recipe">
                      <div style={{ color: '#00F0FF', fontWeight: 'bold' }}>GEAR SCHEMATIC:</div>
                      <div>{album.recipe}</div>
                    </div>

                    <div className="lyrics-snippet">{album.lyrics}</div>

                    <button
                      type="button"
                      className="brutal-btn flip-back-btn"
                      style={{ background: '#000', color: '#FFF' }}
                      onClick={(e) => toggleFlip(album.id, e)}
                    >
                      ↩ RETURN TO COVER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
