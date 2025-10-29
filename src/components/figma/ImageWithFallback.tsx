import { useState, useMemo } from 'react';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1080&q=80';

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false);
  const { src, alt, style, className, ...rest } = props;

  const normalizedSrc = useMemo(() => {
    const s = typeof src === 'string' ? src.trim() : '';
    if (!s || s.includes('...')) return PLACEHOLDER;
    return s;
  }, [src]);

  return (
    <img
      src={didError ? PLACEHOLDER : normalizedSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => setDidError(true)}
      {...rest}
    />
  );
}
