import useSound from 'use-sound'

/**
 * Hook for playing cinematic UI sound effects.
 * Using verified stable GitHub raw assets (CORS-compliant).
 */
export function useAudio() {
  const config = { 
    onloaderror: (id, err) => {
        console.warn(`Audio id ${id} failed to load: ${err}. Operating in silent mode.`)
    },
    html5: true, // Use HTML5 Audio to bypass most CORS and support streaming
    preload: 'auto',
    format: ['mp3']
  }

  // jsDelivr CDN - Using a more direct raw path which is sometimes more stable
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/the-mugen/heist-assets@main'

  // Wrapped in try-catch just in case useSound itself throws (rare)
  let playClick, playHover, playSuccess, playIntro, playError

  try {
    [playClick] = useSound(`${CDN_BASE}/click.mp3`, { ...config, volume: 0.5 })
    [playHover] = useSound(`${CDN_BASE}/hover.mp3`, { ...config, volume: 0.1 })
    [playSuccess] = useSound(`${CDN_BASE}/success.mp3`, { ...config, volume: 0.6 })
    [playIntro] = useSound(`${CDN_BASE}/intro.mp3`, { ...config, volume: 0.7 })
    [playError] = useSound(`${CDN_BASE}/error.mp3`, { ...config, volume: 0.4 })
  } catch (err) {
    console.error('Failed to initialize audio layer:', err)
    // Fallback to no-op functions
    const noop = () => {}
    playClick = playHover = playSuccess = playIntro = playError = noop
  }

  return {
    playClick,
    playHover,
    playSuccess,
    playIntro,
    playError
  }
}
