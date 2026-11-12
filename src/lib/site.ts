/** Company-wide details shown in the header, footer and contact section. */
export const company = {
  name: "ZENTRIQUE Intelligence Limited",
  email: "info@zentrique.com",
  location: "Nairobi, Kenya",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/zentrique-intelligence" },
    { label: "X (Twitter)", href: "https://x.com/zentrique" },
    { label: "Facebook", href: "https://www.facebook.com/zentrique" },
    { label: "Instagram", href: "https://www.instagram.com/zentrique" },
  ],
} as const;

export const mainNav = [
  { to: "/services", label: "Services" },
  { to: "/pulse", label: "PULSE" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;
