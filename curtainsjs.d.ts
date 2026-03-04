declare module 'curtainsjs' {
    export class Curtains {
      constructor(options: {
        container: HTMLElement
        watchScroll?: boolean
        pixelRatio?: number
        autoResize?: boolean
      })
      onError(callback: () => void): this
      dispose(): void
    }
  
    export class Plane {
      constructor(curtains: Curtains, element: HTMLElement, options: {
        vertexShader: string
        fragmentShader: string
        widthSegments?: number
        heightSegments?: number
        uniforms?: Record<string, { name: string; type: string; value: number }>
      })
      uniforms: Record<string, { value: number }>
      onRender(callback: () => void): this
      onError(callback: () => void): this
      onReady(callback: () => void): this
    }
  }