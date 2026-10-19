/** The five editorial roadmap categories displayed on the landing page. */
export const ROADMAPS = [
  {
    id: "software-development",
    title: "Software Development",
    icon: "code",
    theme: "blue",
    summary:
      "Build useful websites and applications, from the interface to the database.",
    stages: [
      "Learn programming fundamentals with JavaScript or Python.",
      "Practise HTML, CSS, Git, and basic data structures.",
      "Build React interfaces and learn APIs and relational databases.",
      "Create, test, and deploy a complete portfolio application.",
    ],
  },
  {
    id: "data-science",
    title: "Data Science",
    icon: "data",
    theme: "green",
    summary:
      "Turn data into explanations, visualizations, and predictive experiments.",
    stages: [
      "Learn Python, statistics, and spreadsheet fundamentals.",
      "Practise SQL and clean datasets with pandas.",
      "Explore data using charts and explain your findings.",
      "Train and evaluate simple models; publish a reproducible project.",
    ],
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    icon: "shield",
    theme: "orange",
    summary:
      "Understand systems and learn to identify and reduce security risks.",
    stages: [
      "Study networking, Linux, and operating-system fundamentals.",
      "Learn secure coding and common web vulnerabilities.",
      "Practise only in authorized labs and capture-the-flag environments.",
      "Document findings and build a small defensive security project.",
    ],
  },
  {
    id: "product-management",
    title: "Product Management",
    icon: "bulb",
    theme: "purple",
    summary:
      "Connect user needs with clear product decisions and measurable outcomes.",
    stages: [
      "Learn user research and problem framing.",
      "Write simple product requirements and prioritize a backlog.",
      "Practise wireframes, metrics, and basic analytics.",
      "Create a product case study with evidence and tradeoffs.",
    ],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    icon: "palette",
    theme: "pink",
    summary:
      "Design accessible, understandable experiences around real user needs.",
    stages: [
      "Study visual hierarchy, typography, spacing, and accessibility.",
      "Research users and map their key tasks.",
      "Build wireframes and interactive prototypes.",
      "Test your designs and document improvements in a portfolio.",
    ],
  },
];
