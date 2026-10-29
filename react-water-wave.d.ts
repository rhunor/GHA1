declare module 'react-water-wave' {
    import { ReactNode } from 'react'

    export interface WaterWaveControls {
      destroy: () => void
      pause: () => void
      play: () => void
      hide: () => void
      show: () => void
      drop: (args: { x: number; y: number; radius: number; strength: number }) => void
      set: (args: { property: 'dropRadius' | 'perturbance' | 'interactive' | 'crossOrigin' | 'imageUrl'; value: unknown }) => void
      updateSize: () => void
    }

    interface WaterWaveProps {
      imageUrl: string
      dropRadius?: number
      perturbance?: number
      resolution?: number
      interactive?: boolean
      crossOrigin?: string
      children?: (controls: WaterWaveControls) => ReactNode
      style?: React.CSSProperties
      className?: string
    }

    const WaterWave: React.FC<WaterWaveProps>
    export default WaterWave
  }
