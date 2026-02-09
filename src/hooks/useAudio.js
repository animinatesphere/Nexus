import useSound from 'use-sound'

/**
 * Hook for playing cinematic UI sound effects.
 * Asset sources: Mixkit (Royalty Free)
 */
export function useAudio() {
  // UI Click - Sharp Digital
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 })
  
  // UI Hover - Techy Swoosh
  const [playHover] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.2 })
  
  // Mission Success / Payment - Cash Register
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', { volume: 0.6 })
  
  // Intro / Cinematic Transition - Low Whoosh
  const [playIntro] = useSound('https://assets.mixkit.co/active_storage/sfx/2581/2581-preview.mp3', { volume: 0.7 })

  // Error / Warning - Digital Glitch
  const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', { volume: 0.4 })

  return {
    playClick,
    playHover,
    playSuccess,
    playIntro,
    playError
  }
}
