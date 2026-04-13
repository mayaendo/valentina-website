type Props = {
  size?: "sm" | "md";
  className?: string;
};

export function SocialIcons({ size = "sm", className }: Props) {
  const sizeClass = size === "md" ? "social-btn--lg" : "";
  const extra = className ? ` ${className}` : "";
  return (
    <>
      <a
        href="https://www.instagram.com/valecaillaux/"
        target="_blank"
        rel="noopener noreferrer"
        className={`social-btn social-btn--ig${sizeClass ? ` ${sizeClass}` : ""}${extra}`}
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
