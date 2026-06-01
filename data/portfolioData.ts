// data/portfolioData.ts

export type LocalizedText = { id: string; en: string };

export interface Project {
  id: string;
  title: string;
  subtitle: LocalizedText;
  description: LocalizedText;
  tags: string[];
  accent: string;
  featured: boolean;
  year: string;
  image?: string; // Ditambahkan untuk data baru
  link?: string;  // Ditambahkan untuk data baru
}

export interface Experience {
  id: string;
  role: LocalizedText;
  company: string;
  period: LocalizedText;
  type: LocalizedText;
  description: LocalizedText;
  highlights: { id: string[]; en: string[] };
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  image: string;
}

export interface Education {
  id: string;
  institution: string;
  period: string;
  major?: string;
  details: string[];
  certificates: Certificate[]; // Array untuk modal sertifikat
}

// ─── SSOT (Single Source of Truth) Data ───────────────────────────────────────

export const portfolioData = {
  // ── PROFIL ──────────────────────────────────────────────
  profile: {
    name: "Muhammad Ahnaf",
    fullName: "Muhammad Ahnaf Isa Hammam Lisualla",
    tagline: {
      id: "Backend Developer & System Architect",
      en: "Backend Developer & System Architect"
    },
    summary: {
      id: "Software Engineer yang berdedikasi dengan fokus utama pada perancangan arsitektur backend, manajemen database relasional, dan pengembangan sistem berskala. Memiliki keahlian kuat dalam membangun RESTful API yang aman menggunakan ekosistem PHP/Laravel dan MySQL. Teliti dalam mendesain skema relasi data yang terstruktur (seperti implementasi One-to-Many yang presisi) dan mampu mengelola siklus pengembangan proyek secara efisien.",
      en: "Dedicated Software Engineer primarily focused on backend architecture design, relational database management, and scalable system development. Highly skilled in building secure RESTful APIs using the PHP/Laravel ecosystem and MySQL. Meticulous in designing structured data relation schemas (such as precise One-to-Many implementations) and capable of managing the project development lifecycle efficiently."
    },
    location: { id: "Banjarbaru, Kalimantan Selatan", en: "Banjarbaru, South Kalimantan" },
    email: "ahnafisa02@gmail.com",
    phone: "+6281257366106",
    availableForWork: true,
  },

  // ── KEAHLIAN TEKNIS ──────────────────────────────────────
  skills: [
    {
      category: { id: "Backend & Database", en: "Backend & Database" },
      icon: "◇",
      items: [
        { name: "PHP / Laravel Ecosystem", level: 92 },
        { name: "MySQL (Relational DB)", level: 90 },
        { name: "REST API Design", level: 88 },
        { name: "System Architecture", level: 85 },
      ],
    },
    {
      category: { id: "Tools & DevOps", en: "Tools & DevOps" },
      icon: "◉",
      items: [
        { name: "Git / GitHub / Version Control", level: 85 },
        { name: "Vercel Deployment", level: 85 },
        { name: "Postman / API Testing", level: 80 },
        { name: "Project Management", level: 85 },
      ],
    },
    {
      category: { id: "Frontend (Secondary)", en: "Frontend (Secondary)" },
      icon: "◈",
      items: [
        { name: "React / Next.js", level: 82 },
        { name: "JavaScript / TypeScript", level: 80 },
        { name: "Tailwind CSS", level: 85 },
        { name: "UI/UX Concept", level: 78 },
      ],
    },
  ],

  // ── PENGALAMAN KERJA ─────────────────────────────────────
  experience: [
    {
      id: "exp-01",
      role: { id: "Software Engineer Intern", en: "Software Engineer Intern" },
      company: "Neumedira",
      period: { id: "Juli 2025 — November 2025", en: "July 2025 — November 2025" },
      type: { id: "Magang", en: "Internship" },
      description: {
        id: "Memimpin dan mengkoordinasikan tim pengembangan untuk memastikan target sprint dan fitur harian tercapai dengan disiplin.",
        en: "Led and coordinated the development team to ensure sprint targets and daily feature implementations were achieved with high discipline."
      },
      highlights: {
        id: [
          "Project Management: Koordinasi tim & sprint planning",
          "Code Review dasar & pembagian tugas teknis",
          "Penyelesaian bug operasional secara cepat",
          "Memastikan arsitektur sistem berjalan optimal"
        ],
        en: [
          "Project Management: Team coordination & sprint planning",
          "Basic Code Review & technical task delegation",
          "Rapid resolution of operational bugs",
          "Ensuring optimal system architecture performance"
        ]
      }
    },
    {
      id: "exp-02",
      role: { id: "Backend Developer", en: "Backend Developer" },
      company: "Proyek Web INFOUKS",
      period: { id: "Agustus 2024 — Desember 2024", en: "August 2024 — December 2024" },
      type: { id: "Proyek", en: "Project" },
      description: {
        id: "Membangun sistem informasi berbasis web dengan arsitektur database relasional yang terstruktur dan sistem validasi yang ketat.",
        en: "Built a web-based information system featuring a structured relational database architecture and strict validation systems."
      },
      highlights: {
        id: [
          "Database Architecture: Implementasi Relasi One-to-Many dengan Foreign Key secara presisi",
          "Form Validation & Security: Validasi 8-char ID precision",
          "Pengelolaan data rekam medis terpusat",
          "Dokumentasi teknis sistem & struktur API"
        ],
        en: [
          "Database Architecture: Precise implementation of One-to-Many relations with Foreign Keys",
          "Form Validation & Security: 8-char ID precision validation",
          "Centralized medical records data management",
          "Technical system & API structure documentation"
        ]
      }
    }
  ] as Experience[],

  // ── PENDIDIKAN & SERTIFIKAT ─────────────────────────────────
  education: [
    {
      id: "edu-01",
      institution: "SMK Telkom Banjarbaru",
      period: "2023 — 2026",
      major: "Rekayasa Perangkat Lunak (RPL)",
      details: [
        "Juara 1 Video RSPS – JUMPA PMR Tingkat Provinsi | 2023",
        "Divisi Lapangan MPK – OSIS/MPK SMK Telkom Banjarbaru"
      ],
      certificates: [
        {
          id: "cert-1",
          title: "Juara 1 Video RSPS Tingkat Provinsi",
          issuer: "JUMPA PMR",
          year: "2023",
          image: "/assets/cert-1.webp" // Siapkan gambar dummy/asli di public/assets/
        },
        {
          id: "cert-2",
          title: "Sertifikasi Kompetensi Keahlian RPL",
          issuer: "BNSP / SMK Telkom",
          year: "2026",
          image: "/assets/cert-2.webp"
        }
      ]
    },
    {
      id: "edu-02",
      institution: "SMP IT Qardhan Hasana Banjarbaru",
      period: "2019 — 2022",
      major: undefined,
      details: [
        "Fokus pada pendidikan akademik dasar dan pembentukan karakter."
      ],
      certificates: [] // Kosongkan jika tidak ada sertifikat di SMP
    }
  ] as Education[],

  // ── PROYEK (DIUBAH SESUAI REQUEST) ───────────────────────
  projects: [
    {
      id: "p1",
      title: "LuxurySneakers",
      subtitle: { id: "E-Commerce", en: "E-Commerce" },
      description: {
        id: "Aplikasi berbasis web E-commerce premium yang dirancang untuk kurasi dan penjualan produk high-end dengan pengalaman visual yang mewah.",
        en: "A premium E-commerce web application designed for curating and selling high-end products with a luxurious visual experience."
      },
      tags: ["Web Development", "E-Commerce"],
      accent: "#ffffff", // Stark white untuk Moon Knight
      featured: true,
      year: "2024",
      image: "/assets/project/luxury.webp",
      link: ""
    },
    {
      id: "p7",
      title: "Rental Random Platform",
      subtitle: { id: "Management System", en: "Management System" },
      description: {
        id: "Sistem manajemen persewaan berbasis web yang mengimplementasikan sistem autentikasi aman, kontrol akses multi-role, serta perancangan arsitektur database relasional untuk pelacakan inventaris dan riwayat transaksi.",
        en: "A web-based rental management system implementing secure authentication, multi-role access control, and a relational database architecture for inventory and transaction tracking."
      },
      tags: ["Laravel", "Web Engineering", "Database Architecture"],
      accent: "#d4af37", // Aksen emas Khonshu
      featured: true, // Di-feature-kan karena ini proyek backend kuat
      year: "2024",
      image: "/assets/project/rental.webp",
      link: ""
    },
    {
      id: "p2",
      title: "InfoUKS",
      subtitle: { id: "Health Integration", en: "Health Integration" },
      description: {
        id: "Integrasi sistem informasi kesehatan siswa dan manajemen rekam medis terpadu ke dalam satu platform web yang responsif dan dinamis.",
        en: "Integration of student health information systems and unified medical records management into a responsive and dynamic web platform."
      },
      tags: ["Web Engineering", "Relational DB", "Medical Record System"],
      accent: "#c0c0c8", // Silver
      featured: true,
      year: "2024",
      image: "/assets/project/infouk.webp",
      link: ""
    },
    {
      id: "p4",
      title: "Bimbel Smart",
      subtitle: { id: "Information System", en: "Information System" },
      description: {
        id: "Platform sistem informasi manajemen bimbingan belajar cerdas untuk optimalisasi administrasi pendidikan dan monitoring akademik siswa.",
        en: "A smart tutoring management information system platform for optimizing educational administration and monitoring student academics."
      },
      tags: ["Web Platform", "Information System"],
      accent: "#e5e7eb",
      featured: false,
      year: "2024",
      image: "/assets/project/bimbel.webp",
      link: "https://bimbel-smart.neumediradev.my.id/"
    },
    {
      id: "p5",
      title: "Project: Forever",
      subtitle: { id: "Creative Web Design", en: "Creative Web Design" },
      description: {
        id: "Eksplorasi antarmuka web interaktif yang menerapkan teknik digital storytelling dengan tata letak editorial asimetris dan animasi berbasis scroll.",
        en: "Exploration of interactive web interfaces applying digital storytelling techniques with asymmetrical editorial layouts and scroll-based animations."
      },
      tags: ["Front-End Integration", "Animations"],
      accent: "#6b6b78",
      featured: false,
      year: "2024",
      image: "/assets/project/projectforever.webp",
      link: "https:/project-forever.vercel.app/"
    },
    {
      id: "p6",
      title: "Block Master",
      subtitle: { id: "Experimental Game Dev", en: "Experimental Game Dev" },
      description: {
        id: "Proyek eksperimen game 2D arcade untuk menguji kalkulasi fisika (collision detection), penanganan input real-time, dan state management pada browser.",
        en: "An experimental 2D arcade game project to test physics calculations (collision detection), real-time input handling, and state management in the browser."
      },
      tags: ["Phaser.js", "JavaScript", "State Management"],
      accent: "#a8a8b3",
      featured: false,
      year: "2024",
      image: "/assets/project/blockmaster.webp",
      link: "https://game-gabut-lemon.vercel.app/"
    },
    {
      id: "p3",
      title: "Spotbanua",
      subtitle: { id: "Mobile App Design", en: "Mobile App Design" },
      description: {
        id: "Perancangan antarmuka (UI/UX) aplikasi destinasi wisata interaktif untuk mempermudah eksplorasi tempat menarik di Banjarbaru dan wilayah Kalimantan Selatan.",
        en: "UI/UX design for an interactive tourist destination app to facilitate the exploration of points of interest in Banjarbaru and South Kalimantan."
      },
      tags: ["UI/UX Design", "Figma", "Mobile App"],
      accent: "#ffffff",
      featured: false,
      year: "2024",
      image: "/assets/project/spotbanua.webp",
      link: ""
    }
  ] as Project[],

  // ── SOCIAL / LINKS ────────────────────────────────────────
  social: [
    { label: "GitHub", href: "https://github.com/LannFinx", icon: "GH" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/m-ahnaf-isa-hammam-lisualla-896887330/", icon: "LI" },
    { label: "Email", href: "mailto:ahnafisa02@gmail.com", icon: "EM" },
  ],
};