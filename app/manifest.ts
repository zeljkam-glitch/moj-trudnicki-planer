import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Moj trudnički planer",
    short_name: "Moj planer",
    description: "Pripreme, troškovi, torba i plan poroda na jednom mjestu.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ef",
    theme_color: "#f7f4ef",
    lang: "hr",
  };
}
