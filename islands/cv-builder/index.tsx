import { useState } from "preact/hooks";
import ExperimentalWarning from "./components/ExperimentalWarning.tsx";
import Toolbar from "./components/Toolbar.tsx";
import PersonalInfoForm from "./components/PersonalInfoForm.tsx";
import ExperienceForm from "./components/ExperienceForm.tsx";
import EducationForm from "./components/EducationForm.tsx";
import SkillsForm from "./components/SkillsForm.tsx";
import ProEditor from "./components/ProEditor.tsx";
import PreviewMode from "./components/PreviewMode.tsx";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Skill {
  id: string;
  name: string;
  level: string;
}

export default function CVBuilder() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [mode, setMode] = useState<"form" | "preview" | "pro">("form");
  const [markdownContent, setMarkdownContent] = useState("");

  const generateMarkdown = () => {
    let markdown = `# ${personalInfo.name}\n\n`;

    if (personalInfo.email || personalInfo.phone || personalInfo.location) {
      markdown += `**Kontakt:**\n`;
      if (personalInfo.email) markdown += `- Email: ${personalInfo.email}\n`;
      if (personalInfo.phone) markdown += `- Telefon: ${personalInfo.phone}\n`;
      if (personalInfo.location)
        markdown += `- Lokace: ${personalInfo.location}\n`;
      markdown += `\n`;
    }

    if (personalInfo.summary) {
      markdown += `## Profil\n\n${personalInfo.summary}\n\n`;
    }

    if (experiences.length > 0) {
      markdown += `## Pracovní zkušenosti\n\n`;
      experiences.forEach((exp) => {
        if (exp.company || exp.position) {
          markdown += `### ${exp.position} - ${exp.company}\n`;
          if (exp.startDate || exp.endDate) {
            const endDate = exp.current ? "současnost" : exp.endDate;
            markdown += `*${exp.startDate} - ${endDate}*\n\n`;
          }
          if (exp.description) {
            markdown += `${exp.description}\n\n`;
          }
        }
      });
    }

    if (education.length > 0) {
      markdown += `## Vzdělání\n\n`;
      education.forEach((edu) => {
        if (edu.school || edu.degree) {
          markdown += `### ${edu.degree} - ${edu.field}\n`;
          markdown += `**${edu.school}**\n`;
          if (edu.startDate || edu.endDate) {
            const endDate = edu.current ? "současnost" : edu.endDate;
            markdown += `*${edu.startDate} - ${endDate}*\n\n`;
          }
        }
      });
    }

    if (skills.length > 0) {
      markdown += `## Dovednosti\n\n`;
      skills.forEach((skill) => {
        if (skill.name) {
          markdown += `- ${skill.name} (${skill.level})\n`;
        }
      });
    }

    return markdown;
  };

  const downloadMarkdown = () => {
    const markdown = mode === "pro" ? markdownContent : generateMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${personalInfo.name || "cv"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    try {
      const markdown = mode === "pro" ? markdownContent : generateMarkdown();
      const response = await fetch('/api/cv-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown })
      });
      
      if (!response.ok) throw new Error('PDF generation failed');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${personalInfo.name || 'cv'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download failed:', error);
      alert('PDF generation failed. Please try again.');
    }
  };

  const switchToPro = () => {
    setMarkdownContent(generateMarkdown());
    setMode("pro");
  };

  if (mode === "preview") {
    return (
      <div className="space-y-6">
        <ExperimentalWarning />
        <Toolbar
          mode={mode}
          onModeChange={setMode}
          onDownloadMarkdown={downloadMarkdown}
          onDownloadPDF={downloadPDF}
          onSwitchToPro={switchToPro}
        />
        <PreviewMode markdown={generateMarkdown()} />
      </div>
    );
  }

  if (mode === "pro") {
    return (
      <div className="space-y-6">
        <ExperimentalWarning />
        <Toolbar
          mode={mode}
          onModeChange={setMode}
          onDownloadMarkdown={downloadMarkdown}
          onDownloadPDF={downloadPDF}
          onSwitchToPro={switchToPro}
        />
        <ProEditor
          markdownContent={markdownContent}
          onChange={setMarkdownContent}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ExperimentalWarning />
      <Toolbar
        mode={mode}
        onModeChange={setMode}
        onDownloadMarkdown={downloadMarkdown}
        onDownloadPDF={downloadPDF}
        onSwitchToPro={switchToPro}
      />
      <PersonalInfoForm
        personalInfo={personalInfo}
        onChange={setPersonalInfo}
      />
      <ExperienceForm
        experiences={experiences}
        onChange={setExperiences}
      />
      <EducationForm
        education={education}
        onChange={setEducation}
      />
      <SkillsForm
        skills={skills}
        onChange={setSkills}
      />
    </div>
  );
}