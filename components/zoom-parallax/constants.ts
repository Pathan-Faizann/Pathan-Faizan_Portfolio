import { ParallaxImageConfig } from "./types";

export const PARALLAX_IMAGES: ParallaxImageConfig[] = [
  {
    id: "center",
    src: "/architecture.png",
    alt: "Projects - Selected Works",
    content: "projects",
    className:
      "absolute z-20 " +
      "w-[60vw] aspect-[16/10] left-[20vw] top-[36vh] " +
      "md:w-[28vw] md:left-[36vw] md:top-[32vh] " +
      "lg:w-[22vw] lg:left-[39vw] lg:top-[30vh]",
    scaleRange: [1, 4.8], // Scale up significantly to fill the viewport
    xRange: [0, 0], // Remains centered
    yRange: [0, 0], // Remains centered
    opacityRange: [1, 1], // Never fades out
    depth: 1.0, // Anchor
  },
  {
    id: "top-left",
    src: "/kronos.png",
    alt: "Kronos Horology Suite - Editorial Detail",
    content: "about",
    className:
      "absolute z-10 " +
      "w-[24vw] h-[20vh] left-[8vw] top-[10vh] " +
      "md:w-[20vw] md:h-[24vh] md:left-[10vw] md:top-[8vh] " +
      "lg:w-[15vw] lg:h-[26vh] lg:left-[12vw] lg:top-[8vh]",
    scaleRange: [1, 2.2],
    xRange: [-450, -50], // Fly out to the top-left on scroll
    yRange: [-350, -50],
    opacityRange: [1, 0], // Fades out completely to clear the screen
    depth: 1.4,
  },
  {
    id: "top-right",
    src: "/about-2.jpeg",
    alt: "Nordic Editorial Visuals - Page Spread",
    className:
      "absolute z-10 overflow-hidden border border-white/5 shadow-xl " +
      "w-[22vw] h-[18vh] left-[70vw] top-[8vh] " +
      "md:w-[18vw] md:h-[22vh] md:left-[72vw] md:top-[6vh] " +
      "lg:w-[16vw] lg:h-[25vh] lg:left-[74vw] lg:top-[6vh]",
    scaleRange: [1, 2.5],
    xRange: [500, 80], // Fly out to the top-right
    yRange: [-400, -80],
    opacityRange: [1, 0],
    depth: 1.5,
  },
  {
    id: "middle-left",
    src: "/my.jpeg",
    alt: "Faizan Pathan Portrait - Editorial Monochrome",
    content: "statement",
    className:
      "absolute z-10 " +
      "w-[29vw] h-[22vh] left-[4vw] top-[38vh] " +
      "md:w-[22vw] md:h-[26vh] md:left-[6vw] md:top-[38vh] " +
      "lg:w-[24vw] lg:h-[30vh] lg:left-[7vw] lg:top-[35vh]",
    scaleRange: [1, 1.8],
    xRange: [-550, -100], // Fly left
    yRange: [60, 10],
    opacityRange: [1, 0],
    depth: 1.2,
  },
  {
    id: "middle-right",
    src: "/sculpture.png",
    alt: "Minimalist Marble Sculpture",
    content: "manifesto",

    className:
      "absolute z-10 overflow-hidden border border-white/5 shadow-xl " +
      "w-[25vw] h-[22vh] left-[71vw] top-[36vh] " +
      "md:w-[21vw] md:h-[27vh] md:left-[73vw] md:top-[34vh] " +
      "lg:w-[17vw] lg:h-[32vh] lg:left-[73vw] lg:top-[32vh]",
    scaleRange: [1, 2.6],
    xRange: [550, 100], // Fly right
    yRange: [-40, -10],
    opacityRange: [1, 0],
    depth: 1.6,
  },
  {
    id: "bottom-left",
    src: "/detail.png",
    alt: "Luxury Interior Detail - Quiet Mood",
    // content: "manifesto",
    className:
      "absolute z-10 " +
      "w-[23vw] h-[18vh] left-[12vw] top-[70vh] " +
      "md:w-[19vw] md:h-[22vh] md:left-[14vw] md:top-[68vh] " +
      "lg:w-[14vw] lg:h-[24vh] lg:left-[16vw] lg:top-[68vh]",
    scaleRange: [1, 2.0],
    xRange: [-400, -80], // Fly bottom-left
    yRange: [450, 80],
    opacityRange: [1, 0],
    depth: 1.3,
  },
  {
    id: "bottom-right",
    src: "/aurelia.png",
    alt: "Aurelia Luxury Residences - Architectural Detail",
    className:
      "absolute z-10 overflow-hidden border border-white/5 shadow-xl " +
      "w-[25vw] h-[20vh] left-[63vw] top-[68vh] " +
      "md:w-[21vw] md:h-[24vh] md:left-[64vw] md:top-[66vh] " +
      "lg:w-[16vw] lg:h-[27vh] lg:left-[66vw] lg:top-[66vh]",
    scaleRange: [1, 2.3],
    xRange: [420, 80], // Fly bottom-right
    yRange: [420, 80],
    opacityRange: [1, 0],
    depth: 1.4,
  },
];
