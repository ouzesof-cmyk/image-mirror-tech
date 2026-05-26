import * as React from 'react'

type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> & {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  fill?: boolean
  priority?: boolean
  sizes?: string
  quality?: number
  unoptimized?: boolean
  placeholder?: string
  blurDataURL?: string
}

export function Image({ fill, priority, quality, unoptimized, placeholder, blurDataURL, sizes, style, className, ...rest }: ImageProps) {
  if (fill) {
    return (
      <img
        {...rest}
        loading={priority ? 'eager' : 'lazy'}
        className={className}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }}
      />
    )
  }
  return <img {...rest} loading={priority ? 'eager' : 'lazy'} className={className} style={style} />
}

export default Image
