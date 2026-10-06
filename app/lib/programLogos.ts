export type ProgramLogoAsset = { brand: string; file: string; treatment: "square" | "wordmark"; source: string };
/** Original brand assets, kept locally so cards do not depend on third-party image requests. */
export const programLogos: Record<string, ProgramLogoAsset> = {
  "y-combinator": { brand: "Y Combinator", file: "y-combinator.png", treatment: "square", source: "https://www.ycombinator.com/apply/" },
  "techstars-accelerators": { brand: "Techstars", file: "techstars.png", treatment: "wordmark", source: "https://brand.techstars.com/" },
  "antler-residency": { brand: "Antler", file: "antler.jpg", treatment: "square", source: "https://www.antler.co/" },
  "berkeley-skydeck-batch-23": { brand: "Berkeley SkyDeck", file: "berkeley-skydeck.png", treatment: "square", source: "https://skydeck.berkeley.edu/" },
  "entrepreneur-first-london": { brand: "Entrepreneur First", file: "entrepreneur-first.png", treatment: "square", source: "https://www.joinef.com/" },
  "launch-by-station-f": { brand: "Launch by STATION F", file: "launch-station-f.svg", treatment: "wordmark", source: "https://launch.stationf.co/" },
  "google-for-startups-accelerator": { brand: "Google for Startups", file: "google-for-startups.svg", treatment: "wordmark", source: "https://startup.google.com/programs/accelerator/" },
  "nvidia-inception": { brand: "NVIDIA Inception", file: "nvidia.svg", treatment: "wordmark", source: "https://www.nvidia.com/en-us/startups/" },
  "aws-activate": { brand: "AWS Activate", file: "aws.svg", treatment: "wordmark", source: "https://aws.amazon.com/startups/credits/" },
  "microsoft-for-startups": { brand: "Microsoft for Startups", file: "microsoft.svg", treatment: "square", source: "https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-branding-in-apps" },
  "google-cloud-for-startups": { brand: "Google Cloud", file: "google-cloud.svg", treatment: "wordmark", source: "https://cloud.google.com/" },
  "hkstp-incubation": { brand: "HKSTP", file: "hkstp.svg", treatment: "wordmark", source: "https://www.hkstp.org/en/programmes/incubation/incubation-programme" },
  "cyberport-incubation": { brand: "Cyberport", file: "cyberport.png", treatment: "wordmark", source: "https://commons.wikimedia.org/wiki/File:Cyberport_Logo_Master-01.png" },
  "hax": { brand: "SOSV HAX", file: "hax.svg", treatment: "wordmark", source: "https://sosv.com/brand-guidelines/" },
  "hkstp-ideation": { brand: "HKSTP", file: "hkstp.svg", treatment: "wordmark", source: "https://www.hkstp.org/programmes/ideation" },
};
