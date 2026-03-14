import type { About, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Joshua G.",
  lastName: "Realino",
  name: "Joshua G. Realino",
  role: "3rd Year Computer Science Student at Palawan State University - Narra Campus",
  avatar: "/images/avatar.jpg",
  email: "your@email.com",
  location: "Asia/Manila", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["Java", "C#", "C", "Visual Basic"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/your-username",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/your-profile/",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/your_handle/",
    essential: false,
  },
  {
    name: "Threads",
    icon: "threads",
    link: "https://www.threads.com/@your_handle",
    essential: false,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Code with purpose, build with precision.</>,
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Featured</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/your-featured-project",
  },
  subline: (
    <>
      Programming is the art of turning ideas into reliable systems, one thoughtful line at a
      time. Great code balances logic, creativity, and discipline to solve real problems and
      create lasting impact.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from the Philippines`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I am Joshua G. Realino, a 3rd Year Computer Science student at Palawan State University -
        Narra Campus. I enjoy creating practical software solutions and continuously improving my
        skills across multiple programming languages.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Your Company",
        timeframe: "Year - Present",
        role: "Your Role",
        achievements: [
          "Describe a key achievement or responsibility here.",
          "Describe another achievement or contribution here.",
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Palawan State University - Narra Campus",
        description: <>3rd Year Bachelor of Science in Computer Science.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Programming Languages",
        description: (
          <>Comfortable building academic and personal projects using Java, C#, C, and Visual Basic.</>
        ),
        tags: [
          {
            name: "Java",
          },
          {
            name: "C#",
          },
          {
            name: "C",
          },
          {
            name: "Visual Basic",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
    ],
  },
};

const work: Work = {
  path: "/work",
  label: "Projects",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/work/projects
  // All projects will be listed on the /home and /work routes
};

export { person, social, newsletter, home, about, work };
