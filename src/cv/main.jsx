import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const profile = {
  name: "Nguyễn Việt Hoàng",
  role: "Sinh viên ngành AIoT",
  school: "Học viện Công nghệ Bưu chính Viễn thông (PTIT)",
  introduction:
    "Mình quan tâm đến lập trình, trí tuệ nhân tạo và cách kết nối phần mềm với các thiết bị thông minh.",
};

const skills = [
  {
    category: "Lập trình",
    items: ["Python", "HTML", "CSS", "JavaScript", "React"],
  },
  {
    category: "AI & hệ thống",
    items: ["Machine Learning", "AIoT"],
  },
  {
    category: "Kỹ năng mềm",
    items: ["Làm việc nhóm", "Tự học", "Giải quyết vấn đề"],
  },
];

const projects = [
  {
    name: "Virtual Calculator",
    type: "React · JavaScript",
    description:
      "Máy tính giao diện nút bấm, lưu biểu thức bằng state và hỗ trợ các phép tính cơ bản.",
  },
  {
    name: "CV cá nhân",
    type: "React · Responsive UI",
    description:
      "Trang hồ sơ cá nhân được chia thành các component có thể tái sử dụng.",
  },
];

const education = [
  {
    period: "Trước đây",
    place: "Trường THPT Lê Xoay",
    detail: "Hoàn thành chương trình trung học phổ thông.",
  },
  {
    period: "Hiện tại",
    place: profile.school,
    detail: "Sinh viên ngành AIoT.",
  },
];

function Section({ id, eyebrow, title, children }) {
  return (
    <section className="cv-section" id={id} aria-labelledby={`${id}-title`}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className="section-content">{children}</div>
    </section>
  );
}

function Header({ name, role, onToggleTheme, isDark }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Về đầu trang">
        VH<span>.</span>
      </a>
      <nav aria-label="Điều hướng chính">
        <a href="#about">Giới thiệu</a>
        <a href="#skills">Kỹ năng</a>
        <a href="#projects">Dự án</a>
        <a href="#education">Học vấn</a>
        <a href="#contact">Liên hệ</a>
        <a href="maytinh.html">Máy tính</a>
      </nav>
      <button className="theme-toggle" type="button" onClick={onToggleTheme}>
        {isDark ? "Giao diện sáng" : "Giao diện tối"}
      </button>
      <span className="sr-only">Hồ sơ của {name}, {role}</span>
    </header>
  );
}

function ProfileHero({ person }) {
  return (
    <div className="hero" id="home">
      <div className="hero-copy">
        <p className="hero-kicker">XIN CHÀO, MÌNH LÀ</p>
        <h1>{person.name}</h1>
        <p className="hero-role">{person.role} <span>·</span> PTIT</p>
        <p className="hero-intro">{person.introduction}</p>
        <a className="primary-link" href="#contact">
          Kết nối với mình <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="hero-mark" aria-hidden="true">
        <span>VH</span>
        <i />
      </div>
    </div>
  );
}

function SkillsList({ items }) {
  return (
    <div className="skill-grid">
      {items.map((group) => (
        <article className="skill-card" key={group.category}>
          <h3>{group.category}</h3>
          <ul>
            {group.items.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function ProjectCard({ project, index }) {
  return (
    <article className="project-card">
      <span className="project-number">0{index + 1}</span>
      <p className="project-type">{project.type}</p>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
    </article>
  );
}

function ProjectList({ items }) {
  return (
    <div className="project-grid">
      {items.map((project, index) => (
        <ProjectCard key={project.name} project={project} index={index} />
      ))}
    </div>
  );
}

function EducationList({ items }) {
  return (
    <ol className="education-list">
      {items.map((item) => (
        <li key={item.place}>
          <span className="education-period">{item.period}</span>
          <div>
            <h3>{item.place}</h3>
            <p>{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Contact({ name }) {
  return (
    <div className="contact-panel">
      <p>
        Bạn muốn trao đổi về lập trình, AIoT hoặc một dự án thú vị? Mình rất
        sẵn lòng kết nối.
      </p>
      <div className="contact-links">
        <a href="https://facebook.com" target="_blank" rel="noreferrer">
          Facebook <span aria-hidden="true">↗</span>
        </a>
        <a href="https://zalo.me" target="_blank" rel="noreferrer">
          Zalo <span aria-hidden="true">↗</span>
        </a>
        <span>SĐT: 0123 456 789</span>
      </div>
      <span className="sr-only">Liên hệ với {name}</span>
    </div>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12
    ? "Chào buổi sáng!"
    : currentHour < 18
      ? "Chào buổi chiều!"
      : "Chào buổi tối!";

  return (
    <div className={`cv-app${isDark ? " theme-dark" : ""}`}>
      <div className="page-shell">
        <Header
          name={profile.name}
          role={profile.role}
          isDark={isDark}
          onToggleTheme={() => setIsDark((current) => !current)}
        />
        <main>
          <ProfileHero person={profile} />
          <p className="greeting">{greeting}</p>
          <Section id="about" eyebrow="01 / VÀI DÒNG VỀ MÌNH" title="Giới thiệu">
            <p className="section-lead">
              Mình là <strong>{profile.name}</strong>, {profile.role.toLowerCase()} tại{" "}
              {profile.school}. Mình yêu thích việc học hỏi công nghệ mới và
              biến ý tưởng thành sản phẩm hữu ích.
            </p>
          </Section>
          <Section id="skills" eyebrow="02 / NĂNG LỰC" title="Kỹ năng">
            <SkillsList items={skills} />
          </Section>
          <Section id="projects" eyebrow="03 / SẢN PHẨM ĐÃ LÀM" title="Dự án">
            <ProjectList items={projects} />
          </Section>
          <Section id="education" eyebrow="04 / HÀNH TRÌNH" title="Học vấn">
            <EducationList items={education} />
          </Section>
          <Section id="contact" eyebrow="05 / GIỮ LIÊN LẠC" title="Liên hệ">
            <Contact name={profile.name} />
          </Section>
        </main>
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href="#home">Về đầu trang ↑</a>
        </footer>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
