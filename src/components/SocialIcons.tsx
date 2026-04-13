type Props = {
  size?: "sm" | "md";
};

export function SocialIcons({ size = "sm" }: Props) {
  const sizeClass = size === "md" ? "social-btn--lg" : "";
  return (
    <>
      <a
        href="https://www.instagram.com/valecaillaux/"
        target="_blank"
        rel="noopener noreferrer"
        className={`social-btn social-btn--ig${sizeClass ? ` ${sizeClass}` : ""}`}
        aria-label="Instagram"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/instagram.png"
          alt=""
          width={size === "md" ? 22 : 18}
          height={size === "md" ? 22 : 18}
          style={{ display: "block", objectFit: "contain" }}
        />
      </a>
    </>
  );
}
