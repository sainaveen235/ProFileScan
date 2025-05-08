"use client"

// Define skill categories
export enum SkillCategory {
  PROGRAMMING_LANGUAGE = "Programming Language",
  FRAMEWORK = "Framework",
  DATABASE = "Database",
  CLOUD = "Cloud Platform",
  DEVOPS = "DevOps",
  DESIGN = "Design",
  SOFT_SKILL = "Soft Skill",
  DOMAIN_KNOWLEDGE = "Domain Knowledge",
  TOOL = "Tool",
  METHODOLOGY = "Methodology",
  OTHER = "Other",
}

// Define skill levels
export enum SkillLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  EXPERT = "Expert",
}

// Define skill interface
export interface Skill {
  name: string
  category: SkillCategory
  aliases?: string[]
  relatedSkills?: string[]
}

// Define a comprehensive skill taxonomy
export const skillTaxonomy: Skill[] = [
  // Programming Languages
  {
    name: "JavaScript",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    aliases: ["JS", "ECMAScript"],
    relatedSkills: ["TypeScript", "Node.js", "React", "Angular", "Vue.js"],
  },
  {
    name: "TypeScript",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    aliases: ["TS"],
    relatedSkills: ["JavaScript", "Node.js", "Angular"],
  },
  {
    name: "Python",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    aliases: ["py"],
    relatedSkills: ["Django", "Flask", "NumPy", "Pandas", "TensorFlow", "PyTorch"],
  },
  {
    name: "Java",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    relatedSkills: ["Spring", "Hibernate", "Android"],
  },
  {
    name: "C#",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    aliases: ["CSharp", "C Sharp"],
    relatedSkills: [".NET", "ASP.NET", "Unity"],
  },
  {
    name: "PHP",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    relatedSkills: ["Laravel", "Symfony", "WordPress"],
  },
  {
    name: "Ruby",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    relatedSkills: ["Ruby on Rails", "Sinatra"],
  },
  {
    name: "Swift",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    relatedSkills: ["iOS", "Xcode", "Objective-C"],
  },
  {
    name: "Kotlin",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    relatedSkills: ["Android", "Java"],
  },
  {
    name: "Go",
    category: SkillCategory.PROGRAMMING_LANGUAGE,
    aliases: ["Golang"],
    relatedSkills: ["Docker", "Kubernetes"],
  },

  // Frameworks
  {
    name: "React",
    category: SkillCategory.FRAMEWORK,
    aliases: ["React.js", "ReactJS"],
    relatedSkills: ["JavaScript", "Redux", "Next.js"],
  },
  {
    name: "Angular",
    category: SkillCategory.FRAMEWORK,
    aliases: ["Angular.js", "AngularJS"],
    relatedSkills: ["TypeScript", "RxJS", "JavaScript"],
  },
  {
    name: "Vue.js",
    category: SkillCategory.FRAMEWORK,
    aliases: ["Vue", "VueJS"],
    relatedSkills: ["JavaScript", "Vuex", "Nuxt.js"],
  },
  {
    name: "Django",
    category: SkillCategory.FRAMEWORK,
    relatedSkills: ["Python", "REST API"],
  },
  {
    name: "Flask",
    category: SkillCategory.FRAMEWORK,
    relatedSkills: ["Python", "REST API"],
  },
  {
    name: "Spring",
    category: SkillCategory.FRAMEWORK,
    aliases: ["Spring Boot", "Spring Framework"],
    relatedSkills: ["Java", "Hibernate", "REST API"],
  },
  {
    name: "Ruby on Rails",
    category: SkillCategory.FRAMEWORK,
    aliases: ["Rails", "RoR"],
    relatedSkills: ["Ruby", "REST API"],
  },
  {
    name: "Laravel",
    category: SkillCategory.FRAMEWORK,
    relatedSkills: ["PHP", "Blade", "Eloquent"],
  },
  {
    name: "ASP.NET",
    category: SkillCategory.FRAMEWORK,
    aliases: ["ASP.NET Core", "ASP.NET MVC"],
    relatedSkills: ["C#", ".NET", "Entity Framework"],
  },
  {
    name: "Express.js",
    category: SkillCategory.FRAMEWORK,
    aliases: ["Express", "ExpressJS"],
    relatedSkills: ["Node.js", "JavaScript", "REST API"],
  },

  // Databases
  {
    name: "MySQL",
    category: SkillCategory.DATABASE,
    relatedSkills: ["SQL", "Database Design", "Relational Databases"],
  },
  {
    name: "PostgreSQL",
    category: SkillCategory.DATABASE,
    aliases: ["Postgres"],
    relatedSkills: ["SQL", "Database Design", "Relational Databases"],
  },
  {
    name: "MongoDB",
    category: SkillCategory.DATABASE,
    relatedSkills: ["NoSQL", "Database Design", "Mongoose"],
  },
  {
    name: "SQLite",
    category: SkillCategory.DATABASE,
    relatedSkills: ["SQL", "Database Design", "Relational Databases"],
  },
  {
    name: "Oracle",
    category: SkillCategory.DATABASE,
    aliases: ["Oracle Database", "Oracle DB"],
    relatedSkills: ["SQL", "PL/SQL", "Database Design"],
  },
  {
    name: "Microsoft SQL Server",
    category: SkillCategory.DATABASE,
    aliases: ["SQL Server", "MSSQL"],
    relatedSkills: ["SQL", "T-SQL", "Database Design"],
  },
  {
    name: "Redis",
    category: SkillCategory.DATABASE,
    relatedSkills: ["NoSQL", "Caching", "In-Memory Database"],
  },
  {
    name: "Elasticsearch",
    category: SkillCategory.DATABASE,
    aliases: ["Elastic Search", "ES"],
    relatedSkills: ["Search Engine", "Full-text Search", "ELK Stack"],
  },

  // Cloud Platforms
  {
    name: "AWS",
    category: SkillCategory.CLOUD,
    aliases: ["Amazon Web Services"],
    relatedSkills: ["EC2", "S3", "Lambda", "Cloud Computing"],
  },
  {
    name: "Azure",
    category: SkillCategory.CLOUD,
    aliases: ["Microsoft Azure"],
    relatedSkills: ["Cloud Computing", "Azure Functions", "Azure DevOps"],
  },
  {
    name: "Google Cloud",
    category: SkillCategory.CLOUD,
    aliases: ["GCP", "Google Cloud Platform"],
    relatedSkills: ["Cloud Computing", "GKE", "Cloud Functions"],
  },
  {
    name: "Heroku",
    category: SkillCategory.CLOUD,
    relatedSkills: ["PaaS", "Cloud Deployment", "Cloud Computing"],
  },
  {
    name: "DigitalOcean",
    category: SkillCategory.CLOUD,
    relatedSkills: ["Cloud Computing", "VPS", "Droplets"],
  },

  // DevOps
  {
    name: "Docker",
    category: SkillCategory.DEVOPS,
    relatedSkills: ["Containerization", "Kubernetes", "CI/CD"],
  },
  {
    name: "Kubernetes",
    category: SkillCategory.DEVOPS,
    aliases: ["K8s"],
    relatedSkills: ["Container Orchestration", "Docker", "Cloud Native"],
  },
  {
    name: "Jenkins",
    category: SkillCategory.DEVOPS,
    relatedSkills: ["CI/CD", "Automation", "Build Pipeline"],
  },
  {
    name: "Git",
    category: SkillCategory.DEVOPS,
    relatedSkills: ["Version Control", "GitHub", "GitLab"],
  },
  {
    name: "Terraform",
    category: SkillCategory.DEVOPS,
    relatedSkills: ["Infrastructure as Code", "Cloud Provisioning", "AWS", "Azure", "GCP"],
  },
  {
    name: "Ansible",
    category: SkillCategory.DEVOPS,
    relatedSkills: ["Configuration Management", "Automation", "Infrastructure as Code"],
  },
  {
    name: "CI/CD",
    category: SkillCategory.DEVOPS,
    aliases: ["Continuous Integration", "Continuous Deployment", "Continuous Delivery"],
    relatedSkills: ["Jenkins", "GitHub Actions", "GitLab CI", "Automation"],
  },

  // Design
  {
    name: "UI Design",
    category: SkillCategory.DESIGN,
    aliases: ["User Interface Design"],
    relatedSkills: ["UX Design", "Figma", "Adobe XD", "Sketch"],
  },
  {
    name: "UX Design",
    category: SkillCategory.DESIGN,
    aliases: ["User Experience Design"],
    relatedSkills: ["UI Design", "User Research", "Wireframing", "Prototyping"],
  },
  {
    name: "Responsive Design",
    category: SkillCategory.DESIGN,
    relatedSkills: ["CSS", "Mobile-First Design", "Web Design"],
  },

  // Soft Skills
  {
    name: "Communication",
    category: SkillCategory.SOFT_SKILL,
    relatedSkills: ["Presentation", "Writing", "Interpersonal Skills"],
  },
  {
    name: "Leadership",
    category: SkillCategory.SOFT_SKILL,
    relatedSkills: ["Team Management", "Mentoring", "Decision Making"],
  },
  {
    name: "Problem Solving",
    category: SkillCategory.SOFT_SKILL,
    relatedSkills: ["Critical Thinking", "Analytical Skills", "Creativity"],
  },
  {
    name: "Teamwork",
    category: SkillCategory.SOFT_SKILL,
    relatedSkills: ["Collaboration", "Communication", "Adaptability"],
  },
  {
    name: "Time Management",
    category: SkillCategory.SOFT_SKILL,
    relatedSkills: ["Organization", "Prioritization", "Productivity"],
  },

  // Methodologies
  {
    name: "Agile",
    category: SkillCategory.METHODOLOGY,
    relatedSkills: ["Scrum", "Kanban", "Sprint Planning"],
  },
  {
    name: "Scrum",
    category: SkillCategory.METHODOLOGY,
    relatedSkills: ["Agile", "Sprint Planning", "Daily Standups"],
  },
  {
    name: "Kanban",
    category: SkillCategory.METHODOLOGY,
    relatedSkills: ["Agile", "Workflow Management", "Continuous Delivery"],
  },
  {
    name: "Waterfall",
    category: SkillCategory.METHODOLOGY,
    relatedSkills: ["Project Management", "Sequential Development"],
  },
  {
    name: "TDD",
    category: SkillCategory.METHODOLOGY,
    aliases: ["Test-Driven Development"],
    relatedSkills: ["Unit Testing", "Software Development", "Code Quality"],
  },
]

// Function to find a skill by name or alias
export function findSkill(name: string): Skill | undefined {
  const lowerName = name.toLowerCase()

  return skillTaxonomy.find(
    (skill) =>
      skill.name.toLowerCase() === lowerName || skill.aliases?.some((alias) => alias.toLowerCase() === lowerName),
  )
}

// Function to categorize a list of skills
export function categorizeSkills(skillNames: string[]): Record<SkillCategory, string[]> {
  const categorized: Record<SkillCategory, string[]> = Object.values(SkillCategory).reduce(
    (acc, category) => {
      acc[category] = []
      return acc
    },
    {} as Record<SkillCategory, string[]>,
  )

  skillNames.forEach((skillName) => {
    const skill = findSkill(skillName)
    if (skill) {
      categorized[skill.category].push(skillName)
    } else {
      categorized[SkillCategory.OTHER].push(skillName)
    }
  })

  return categorized
}

// Function to find related skills
export function findRelatedSkills(skillName: string): string[] {
  const skill = findSkill(skillName)
  return skill?.relatedSkills || []
}

import { generateText } from "@/lib/gemini-client"

// Function to estimate skill level from context
export async function estimateSkillLevel(skillName: string, context: string): Promise<SkillLevel> {
  try {
    const { text: levelText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Based on the following context, estimate the skill level for "${skillName}".
      Consider factors like:
      - Years of experience mentioned
      - Complexity of projects described
      - Leadership or mentoring roles related to the skill
      - Depth of knowledge demonstrated
      
      Context:
      ${context}
      
      Respond with exactly one of these levels: "Beginner", "Intermediate", "Advanced", or "Expert".`,
      temperature: 0.1,
      maxTokens: 10,
    })

    const trimmedLevel = levelText.trim()

    if (trimmedLevel === "Beginner") return SkillLevel.BEGINNER
    if (trimmedLevel === "Intermediate") return SkillLevel.INTERMEDIATE
    if (trimmedLevel === "Advanced") return SkillLevel.ADVANCED
    if (trimmedLevel === "Expert") return SkillLevel.EXPERT

    // Default to intermediate if response doesn't match expected values
    return SkillLevel.INTERMEDIATE
  } catch (error) {
    console.error("Error estimating skill level:", error)
    return SkillLevel.INTERMEDIATE
  }
}

export async function analyzeSkillRelevance(skill: string, jobField: string): Promise<number> {
  try {
    const prompt = `Analyze the relevance of the skill "${skill}" to the job field "${jobField}". 
    Return a number between 0 and 1, where:
    0 = Not relevant at all
    0.5 = Somewhat relevant
    1 = Highly relevant
    
    Consider:
    - Industry standards
    - Required competencies
    - Career progression
    - Market demand
    
    Return only the number, no explanation.`

    const response = await generateText(prompt, 0.3)
    const relevance = parseFloat(response)
    
    if (isNaN(relevance) || relevance < 0 || relevance > 1) {
      return 0.5 // Default to neutral if parsing fails
    }
    
    return relevance
  } catch (error) {
    console.error("Error analyzing skill relevance:", error)
    return 0.5 // Default to neutral on error
  }
}
