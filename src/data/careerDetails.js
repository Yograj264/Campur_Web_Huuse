/** Editorial suggestions, not salary promises or admission eligibility rules. */
const resources = {
  web: {
    name: "MDN Web Docs",
    description: "Web fundamentals and browser documentation",
    type: "Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
  },
  python: {
    name: "Python Tutorial",
    description: "Learn the language from its official documentation",
    type: "Documentation",
    url: "https://docs.python.org/3/tutorial/",
  },
  git: {
    name: "GitHub Skills",
    description: "Practical exercises for Git and collaboration",
    type: "Practice",
    url: "https://skills.github.com/",
  },
  ml: {
    name: "scikit-learn Guide",
    description: "Model evaluation and machine learning foundations",
    type: "Documentation",
    url: "https://scikit-learn.org/stable/user_guide.html",
  },
  security: {
    name: "OWASP Testing Guide",
    description: "Web security methodology for authorized testing",
    type: "Documentation",
    url: "https://owasp.org/www-project-web-security-testing-guide/",
  },
  scrum: {
    name: "The Scrum Guide",
    description: "Understand a common product delivery framework",
    type: "Guide",
    url: "https://www.scrumguides.org/scrum-guide.html",
  },
  access: {
    name: "W3C Accessibility Tutorials",
    description: "Design and build more inclusive experiences",
    type: "Guide",
    url: "https://www.w3.org/WAI/tutorials/",
  },
  figma: {
    name: "Figma Learn",
    description: "Design basics, components and prototyping",
    type: "Guide",
    url: "https://help.figma.com/hc/en-us/categories/360002042553",
  },
};
const degree = (id, title, description, kind) => ({
  id,
  title,
  description,
  kind,
});
export const CAREER_DETAILS = {
  "software-development": {
    role: "Software Developer",
    tagline: "Build software that solves real-world problems",
    about:
      "Design and build websites, applications and services. Turn ideas into useful products by combining programming, collaboration and thoughtful problem solving.",
    bestFor:
      "People who enjoy coding, solving problems and building useful things.",
    skills: [
      "Programming",
      "Data structures",
      "Web development",
      "Databases",
      "Problem solving",
    ],
    tools: ["JavaScript", "Python", "React", "Django", "Git", "SQL"],
    projects: [
      "Build a college discovery website",
      "Create a task manager with authentication",
      "Publish and document a full-stack application",
    ],
    degrees: [
      degree(
        "B.Tech",
        "B.Tech in Computer Science",
        "Explore computer science, engineering and software foundations.",
        "Undergraduate",
      ),
      degree(
        "BCA",
        "Bachelor of Computer Applications",
        "A computing-focused undergraduate route to explore.",
        "Undergraduate",
      ),
      degree(
        "B.Sc",
        "B.Sc in Computer Science",
        "Study programming, mathematics and computing principles.",
        "Undergraduate",
      ),
      degree(
        "MCA",
        "Master of Computer Applications",
        "A postgraduate route; check each institution’s entry requirements.",
        "Postgraduate",
      ),
    ],
    resources: [resources.web, resources.python, resources.git],
    focus: [
      "Learn the basics of computing",
      "Try a beginner programming exercise",
      "Explore different software roles",
    ],
    core: [
      "Programming fundamentals",
      "Data structures & algorithms",
      "Web and database foundations",
      "Version control & collaboration",
    ],
  },
  "data-science": {
    role: "Data Scientist",
    tagline: "Turn data into explanations and better decisions",
    about:
      "Explore datasets, test ideas and explain patterns. Build reproducible analyses and evaluate models with care, context and clear communication.",
    bestFor:
      "People who enjoy mathematics, asking questions and working with evidence.",
    skills: [
      "Python",
      "Statistics",
      "SQL",
      "Data analysis",
      "Model evaluation",
    ],
    tools: ["Python", "pandas", "SQL", "Jupyter", "scikit-learn", "Git"],
    projects: [
      "Explore a public education dataset",
      "Build an interactive data dashboard",
      "Compare models with a reproducible evaluation",
    ],
    degrees: [
      degree(
        "B.Sc",
        "B.Sc in Statistics / Mathematics",
        "Develop a foundation in quantitative reasoning.",
        "Undergraduate",
      ),
      degree(
        "B.Tech",
        "B.Tech in Computer Science",
        "Explore computing, algorithms and data systems.",
        "Undergraduate",
      ),
      degree(
        "BCA",
        "Bachelor of Computer Applications",
        "Build programming and database foundations.",
        "Undergraduate",
      ),
      degree(
        "M.Sc",
        "M.Sc in a quantitative field",
        "Explore a specialized postgraduate route.",
        "Postgraduate",
      ),
    ],
    resources: [resources.python, resources.ml, resources.git],
    focus: [
      "Explore how data answers questions",
      "Refresh basic mathematics",
      "Try a simple spreadsheet analysis",
    ],
    core: [
      "Python & SQL",
      "Probability and statistics",
      "Data cleaning & visualization",
      "Model validation & communication",
    ],
  },
  "cyber-security": {
    role: "Cybersecurity Analyst",
    tagline: "Help protect systems, applications and information",
    about:
      "Understand how systems work, recognize risks and practise defensive security. Develop careful investigation and reporting skills in authorized environments.",
    bestFor:
      "People who enjoy investigation, systems and responsible problem solving.",
    skills: [
      "Networking",
      "Linux",
      "Secure coding",
      "Risk analysis",
      "Reporting",
    ],
    tools: ["Linux", "Python", "Wireshark", "Git", "OWASP", "Virtual labs"],
    projects: [
      "Document a home lab security setup",
      "Write an authorized lab assessment",
      "Build a basic log-analysis tool",
    ],
    degrees: [
      degree(
        "B.Tech",
        "B.Tech in Computer Science",
        "Explore networks, operating systems and software.",
        "Undergraduate",
      ),
      degree(
        "BCA",
        "Bachelor of Computer Applications",
        "Build foundations in programming and systems.",
        "Undergraduate",
      ),
      degree(
        "B.Sc",
        "B.Sc in Computing / Cybersecurity",
        "Compare course content and practical lab opportunities.",
        "Undergraduate",
      ),
      degree(
        "M.Sc",
        "Postgraduate security specialization",
        "Check prerequisites and course recognition.",
        "Postgraduate",
      ),
    ],
    resources: [resources.security, resources.python, resources.git],
    focus: [
      "Understand ethical and authorized testing",
      "Explore computer networks",
      "Learn operating-system fundamentals",
    ],
    core: [
      "Networking & Linux",
      "Web application security",
      "Detection & log analysis",
      "Risk reporting & documentation",
    ],
  },
  "product-management": {
    role: "Product Manager",
    tagline: "Connect user needs with clear product decisions",
    about:
      "Understand problems, weigh tradeoffs and help teams decide what to build. Use research, communication and measurable outcomes to guide a product’s direction.",
    bestFor:
      "People who enjoy user research, communication and balancing tradeoffs.",
    skills: [
      "User research",
      "Prioritization",
      "Product metrics",
      "Communication",
      "Problem framing",
    ],
    tools: [
      "Spreadsheets",
      "Analytics",
      "Wireframes",
      "SQL basics",
      "Product briefs",
      "Backlogs",
    ],
    projects: [
      "Write a product discovery case study",
      "Design and test a simple product experiment",
      "Create an evidence-based feature proposal",
    ],
    degrees: [
      degree(
        "BBA",
        "Business / Management Studies",
        "Explore business fundamentals and communication.",
        "Undergraduate",
      ),
      degree(
        "B.Tech",
        "Engineering / Computing",
        "Develop technical foundations for working with product teams.",
        "Undergraduate",
      ),
      degree(
        "B.Des",
        "Design-focused degree",
        "Explore user research and experience design.",
        "Undergraduate",
      ),
      degree(
        "MBA",
        "Postgraduate Management",
        "Consider specialization, cost and entry requirements.",
        "Postgraduate",
      ),
    ],
    resources: [resources.scrum, resources.access, resources.git],
    focus: [
      "Explore how products solve problems",
      "Practise asking useful questions",
      "Observe a product you use every day",
    ],
    core: [
      "User research & problem framing",
      "Prioritization & tradeoffs",
      "Metrics & experiments",
      "Product communication",
    ],
  },
  "ui-ux-design": {
    role: "UI/UX Designer",
    tagline: "Design experiences that are useful and inclusive",
    about:
      "Research user needs, map tasks and turn ideas into clear interfaces. Test prototypes, improve accessibility and explain your design decisions through a portfolio.",
    bestFor:
      "People who enjoy visual communication, empathy and iterative problem solving.",
    skills: [
      "User research",
      "Visual hierarchy",
      "Interaction design",
      "Accessibility",
      "Usability testing",
    ],
    tools: [
      "Figma",
      "Wireframes",
      "Prototypes",
      "Design systems",
      "Accessibility checks",
      "Documentation",
    ],
    projects: [
      "Research and redesign a student task flow",
      "Create an accessible component library",
      "Test a prototype and publish your findings",
    ],
    degrees: [
      degree(
        "B.Des",
        "Bachelor of Design",
        "Explore interaction, visual communication and research.",
        "Undergraduate",
      ),
      degree(
        "BFA",
        "Visual / Applied Arts",
        "Build a foundation in visual communication.",
        "Undergraduate",
      ),
      degree(
        "B.Tech",
        "Computing / Engineering",
        "Combine technical understanding with interface design.",
        "Undergraduate",
      ),
      degree(
        "M.Des",
        "Postgraduate Design",
        "Explore advanced design and research pathways.",
        "Postgraduate",
      ),
    ],
    resources: [resources.figma, resources.access, resources.web],
    focus: [
      "Explore design and everyday usability",
      "Observe user needs",
      "Practise visual hierarchy",
    ],
    core: [
      "User research",
      "Visual & interaction design",
      "Accessible components",
      "Prototyping & usability testing",
    ],
  },
};
export function careerDetails(id) {
  return CAREER_DETAILS[id] || CAREER_DETAILS["software-development"];
}
