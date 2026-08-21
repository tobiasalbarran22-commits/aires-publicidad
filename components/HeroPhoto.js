import Image from "next/image";

export default function HeroPhoto({ src, alt = "" }) {
  return (
    <div className="hero-photo" aria-hidden="true">
      <Image src={src} alt={alt} fill priority sizes="100vw" />
      <div className="hero-photo-veil" />
    </div>
  );
}
