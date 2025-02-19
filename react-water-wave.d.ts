declare module 'react-water-wave' {
    import { ReactNode } from 'react'
    
    interface WaterWaveProps {
      imageUrl: string
      dropRadius?: number
      perturbance?: number
      resolution?: number
      children?: (props: { pause: () => void; play: () => void }) => ReactNode
      style?: React.CSSProperties
    }
    
    const WaterWave: React.FC<WaterWaveProps>
    export default WaterWave
  }