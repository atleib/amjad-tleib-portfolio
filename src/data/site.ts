/*
 * ============================================================
 *  SITE CONTENT: edit this file to update the site.
 *  Anything marked PLACEHOLDER should be replaced.
 * ============================================================
 */

export type ProjectCategory = "personal" | "work";

/**
 * How a project card is displayed:
 * - "link":       text + buttons to a live site and/or GitHub
 * - "screenshot": text + an image (click to enlarge); links optional
 * - "text":       text only, for work projects that can't be shown or linked
 */
export type ProjectDisplay = "link" | "screenshot" | "text";

export interface ProjectLinks {
  live?: string;
  github?: string;
}

export interface Project {
  name: string;
  category: ProjectCategory;
  display: ProjectDisplay;
  description: string;
  tech: string[];
  highlights?: string[];
  /** Path under /public, e.g. "/projects/easy-events.svg" (display: "screenshot") */
  image?: string;
  imageAlt?: string;
  links?: ProjectLinks;
  /** Small note under text-only cards, e.g. why there's no code or screenshot */
  note?: string;
}

export interface Job {
  title: string;
  company: string;
  location: string;
  dates: string;
  highlights: string[];
  tech: string[];
}

export interface SiteData {
  name: string;
  tagline: string;
  about: string[];
  skills: string[];
  resumeUrl: string;
  profileImage: string;
  experience: Job[];
  projects: Project[];
  contact: {
    email: string;
    linkedin: string;
    github: string;
    location: string;
  };
}

export const site: SiteData = {
  name: "Amjad Tleib",
  tagline: "I build reliable software for the web.",

  // PLACEHOLDER: rewrite these in your own voice.
  about: [
    "I'm a software developer based in Dallas, TX. I spent almost three years at Paycom on the Payroll Software Team, building and maintaining features that process payroll for thousands of companies.",
    "I graduated Cum Laude from the University of Texas at San Antonio with a B.S. in Computer Science, concentrating in Software Engineering.",
    "I enjoy working across the stack, from React and TypeScript interfaces to the APIs, databases and cloud infrastructure behind them.",
  ],

  skills: [
    "React", "Next.js", "TypeScript", "Tailwind CSS", "PHP", "C#", "Python",
    "SQL", "MySQL", "DynamoDB", "AWS", "Terraform", "Docker", "GitHub Actions",
  ],

  // PLACEHOLDER: put your resume PDF at public/Amjad_Tleib_Resume.pdf
  resumeUrl: "/Amjad_Tleib_Resume.pdf",
  // PLACEHOLDER: replace public/profile.svg with your photo (e.g. public/profile.jpg)
  profileImage: "/profile.svg",

  experience: [
    {
      title: "Software Developer IV",
      company: "Paycom Software, Inc.",
      location: "Grapevine, TX",
      dates: "June 2023 – May 2026",
      // PLACEHOLDER: replace with your real accomplishments (numbers help!)
      highlights: [
        "Built and maintained payroll features used by [X] client companies.",
        "Improved [process/query/page] performance by [X]% by [what you did].",
        "Collaborated with QA, product and other dev teams to ship [feature].",
      ],
      tech: ["PHP", "React", "TypeScript", "MySQL"],
    },
  ],

  projects: [
    {
      name: "Portfolio Website",
      category: "personal",
      display: "link",
      description:
        "This site. A static Next.js app on S3 + CloudFront, with a serverless contact form and visitor counter. All infrastructure is defined in Terraform and deployed by GitHub Actions.",
      tech: ["Next.js", "TypeScript", "Tailwind", "AWS Lambda", "DynamoDB", "Terraform", "GitHub Actions"],
      links: {
        // Add once deployed: live: "https://your-domain.com",
        github: "https://github.com/atleib/amjad-tleib-portfolio",
      },
    },
    {
      name: "Easy Events",
      category: "personal",
      display: "screenshot",
      description:
        "A calendar and event-planning app, originally built in JavaFX and now being rebuilt as a Spring Boot API with an Angular frontend.",
      tech: ["Java", "Spring Boot", "Angular", "MySQL"],
      // PLACEHOLDER: replace with a real screenshot
      image: "/projects/easy-events.svg",
      imageAlt: "Easy Events calendar view",
      links: {
        github: "https://github.com/atleib/easy-events-calendar",
      },
    },
    {
      name: "Payroll Feature Project",
      category: "work",
      display: "text",
      // PLACEHOLDER: what you built, the problem it solved and the result.
      description:
        "Designed and built [feature] for Paycom's payroll platform, which [what it does] for [who uses it].",
      highlights: [
        "Reduced [manual step / processing time] by [X]%.",
        "Worked with [teams] to roll it out to [X] clients.",
      ],
      tech: ["PHP", "React", "MySQL"],
      note: "Internal project. Code and screenshots aren't public.",
    },
    {
      name: "Another Work Project",
      category: "work",
      display: "text",
      description: "PLACEHOLDER: a short summary of another project you're proud of.",
      tech: ["C#", "SQL"],
      note: "Internal project. Code and screenshots aren't public.",
    },
  ],

  // PLACEHOLDER: fill in real values
  contact: {
    email: "your.email@example.com",
    linkedin: "https://www.linkedin.com/in/PLACEHOLDER",
    github: "https://github.com/atleib",
    location: "Dallas, TX",
  },
};
