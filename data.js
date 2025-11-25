export const bio = [
  "A results-oriented AI/ML Engineer with a strong foundation in deep learning, NLP, and computer vision.",
  "Eager to leverage hands-on experience in developing and deploying scalable machine learning solutions to solve complex business problems and drive innovation.",
  "My passion lies at the intersection of robotics and natural language processing, where I leverage hands-on skills in ROS, PyTorch, and deep learning to create machines that can perceive, understand, and interact with their environment."
];

export const skills = [
  {
    title: "AI & ML",
    icon: "analytics-outline",
    text: "Generative AI, LLMs, Computer Vision, NLP, Prompt Engineering, and Deep Learning."
  },
  {
    title: "DL Frameworks",
    icon: "color-palette-outline",
    text: "PyTorch, Facenet, TensorFlow, Scikit-learn, Transformers, Pandas & NumPy."
  },
  {
    title: "Platforms & Tools",
    icon: "hammer-outline",
    text: "Git, Docker, IntelliJ IDEA, ROS (Robot Operating System), Git, Linux, Streamlit, Flask, and Arduino."
  },
  {
    title: "Languages & Databases",
    icon: "code-slash-outline",
    text: "C, C++, Python, Java, JavaScript, HTML, CSS, SQL, R"
  }
];

export const education = [
  {
    institution: "Rajagiri School of Engineering and Technology",
    degree: "MTech in Computer Science and Engineering (AI/ML)",
    period: "Aug 2024 - Present | CGPA: 9.49"
  },
  {
    institution: "Adi Shankara Institute of Engineering and Technology",
    degree: "BTech (Honours) in Robotics and Automation",
    period: "Oct 2020 - Jun 2024 | CGPA: 9.54"
  },
  {
    institution: "St. Mary's Public School, Thamarachal",
    degree: "Higher Secondary (12th) - Computer/Maths",
    period: "2020 | Percentage: 92.6%"
  },
  {
    institution: "St. Mary's Public School, Thamarachal",
    degree: "High School (10th)",
    period: "2020 | Percentage: 90.6%"
  }
];

export const experience = [
  {
    title: "Intern, Mastermine Technologies",
    period: "Aug 2025 - Present",
    description: [
      "As a Data Science Intern at Mastermine Technologies , I engaged in a hybrid role that combined full-stack development with advanced data science. My primary project involved contributing to a cross-platform desktop application for photographers, where I implemented backend services in Java (Spring) , developed the user interface with React.js , and packaged the application using Electron.js.",
      "A key feature was an asynchronous photo-matching system I developed using Spring Schedulers and RabbitMQ to communicate with Python-based processing workers. Additionally, I architected a multi-agent data insight framework using Python and Large Language Models (LLMs) to automate analytical queries."
    ]
  },
  {
    title: "Hardware Systems Intern, Sunlux Technovations",
    period: "Feb 2024 - April 2024",
    description: [
      "As a Hardware Systems Intern at Sunlux Technovations, I dove into low-level system development and embedded solutions. My primary responsibility was to develop and debug microprocessor programs directly in Assembly language, gaining hands-on experience with hardware-level logic and optimization.",
      "I also actively collaborated with the engineering team to contribute to the design and implementation of embedded solutions, which provided me with practical insight into hardware-software co-design."
    ]
  },
  {
    title: "Automation Intern, SMEC Automation Pvt. Ltd.",
    period: "May 2023 (5 days)",
    description: [
      "Participated in a comprehensive Internship Program at SMEC Automation, focusing on the core components of \"Industrial Automation.\" This role provided practical exposure to designing and implementing control systems.",
      "Gained hands-on experience with Programmable Logic Controllers (PLCs), configuring Human-Machine Interfaces (HMIs), and understanding SCADA systems for process visualization and control. The internship covered the lifecycle of automation projects, from instrumentation to troubleshooting automated processes in real-world industrial applications."
    ]
  },
  {
    title: "Robotics Intern, Sinro Robotics Pvt. Ltd.",
    period: "November 2022 (5 days)",
    description: [
      "Engaged in an foundational Internship Program at Sinro Robotics, covering the \"Introduction to Robotics.\" The program provided a strong understanding of the fundamental principles and components of robotic systems, including sensors, actuators, and microcontrollers.",
      "Acquired practical skills in basic robot assembly, programming (using platforms like Arduino or similar), and sensor integration for tasks like line-following and obstacle avoidance. This experience built a solid groundwork in robot kinematics, control logic, and system design."
    ]
  }
];

export const projects = [
  {
    title: "Multimodal Graph Learning for Early Classification of Alzheimer's Disease",
    category: "Deep Learning / AI/ML (Ongoing)",
    filterCategory: "ai/ml data-science",
    icon: "analytics-outline",
    description: "Engineered a novel deep learning architecture for early Alzheimer's diagnosis, integrating multimodal data and graph learning techniques to accurately classify Cognitively Normal (CN), Mild Cognitive Impairment (MCI), and AD subjects.",
    progress: 85,
    links: {
      caseStudy: true
    },
    caseStudy: {
      problem: "Early and accurate diagnosis of Alzheimer's Disease (AD) is critical but challenging. The disease progresses from Cognitively Normal (CN) to Mild Cognitive Impairment (MCI) and then to AD.",
      solution: "This ongoing project focuses on developing a novel deep learning architecture. By integrating multimodal data (e.g., MRI scans, cognitive test scores) and using graph learning techniques, the model aims to learn complex relationships in the data to classify subjects accurately and aid in early diagnosis."
    }
  },
  {
    title: "Multilingual News Audio Translator (Flask UI)",
    category: "Full-stack / AI/ML",
    filterCategory: "ai/ml app-dev",
    icon: "mic-outline",
    description: "A web app for translating news audio into multiple languages using speech-to-text and machine translation.",
    links: {
      github: "https://github.com/ashvinmanojk289/FLASK_UI_FOR_MULTILINGUAL_NEWS_AUDIO_TRANSLATOR",
      caseStudy: true
    },
    caseStudy: {
      problem: "Access to news and information is often limited by language barriers. Audio content, like podcasts and news broadcasts, is particularly difficult to translate and consume in real-time.",
      solution: "I developed a Flask web application that integrates multiple AI models. It uses Wav2Vec 2.0 for speech recognition, an mBART model for machine translation, and a TTS engine to speak the translated text. This creates a seamless pipeline for users to consume audio news in various languages, improving accessibility."
    }
  },
  {
    title: "Multilingual Audio Translator (Training & Deployment)",
    category: "AI/ML / Deep Learning",
    filterCategory: "ai/ml app-dev",
    icon: "headset-outline",
    description: "End-to-end ML pipeline: trains custom Wav2Vec 2.0 and mBART models, exports weights as JSON, and deploys in Jupyter for audio translation inference.",
    links: {
      github: "https://github.com/ashvinmanojk289/Multilingual-Audio-Translator",
      caseStudy: true
    },
    caseStudy: {
      problem: "Access to audio-based information (like news or lectures) is often blocked by language barriers. Translating spoken content in real-time is a complex task that requires multiple AI models to work together seamlessly.",
      solution: "This project implements a complete ML pipeline: first training custom speech recognition and translation models, then deploying them in a Jupyter environment for inference. Uses Wav2Vec 2.0 for speech recognition (92% accuracy) and fine-tuned mBART for translation. The trained model weights are exported as JSON for reproducible deployment on sample audio inputs."
    }
  },
  {
    title: "Hybrid EfficientNetV2-Transformer Model for Weed Detection",
    category: "Deep Learning / Computer Vision",
    filterCategory: "ai/ml data-science",
    icon: "leaf-outline",
    description: "A research project comparing deep learning architectures for weed detection in agriculture.",
    links: {
      github: "https://github.com/ashvinmanojk289/Hybrid-EfficientNetV2-Transformer-Model-and-Other-Model-Comparison-for-Weed-Detection",
      caseStudy: true
    },
    caseStudy: {
      problem: "Traditional agricultural methods often involve broad-spectrum herbicide application, which is costly and environmentally harmful. Identifying weeds accurately, especially those that closely resemble crops, is a significant computer vision challenge.",
      solution: "I researched, built, and benchmarked several deep learning models, including a novel hybrid architecture combining EfficientNetV2 (for strong feature extraction) and a Transformer (for contextual relationships). This hybrid model achieved 97% accuracy on large datasets, demonstrating a robust and efficient solution for precision agriculture."
    }
  },
  {
    title: "PDF Query Application",
    category: "GenAI / NLP",
    filterCategory: "ai/ml",
    icon: "document-text-outline",
    description: "Created a Python tool for querying and extracting information from PDF documents using natural language.",
    links: {
      github: "https://github.com/ashvinmanojk289/PDF-Query-Application",
      caseStudy: true
    },
    caseStudy: {
      problem: "Manually searching large PDF documents for specific information is time-consuming and inefficient. Standard search (Ctrl+F) lacks contextual understanding and cannot answer natural language questions.",
      solution: "I built a Python tool that leverages NLP to parse and understand PDF content. It creates a searchable index, allowing users to ask questions in plain English (e.g., \"What was the total revenue in 2024?\") and receive precise answers. This automates information extraction and streamlines document-based workflows."
    }
  }
];

export const additionalProjects = [
  {
    title: "Portfolio AI Assistant",
    category: "JavaScript / AI/ML",
    filterCategory: "app-dev ai/ml",
    icon: "chatbubble-ellipses-outline",
    description: "Rule-based conversational chatbot integrated into this portfolio, built in pure JavaScript using a predefined conversation tree structure. Provides instant answers to visitor questions about skills, projects, and experience without external API dependencies. Features a theme-matched chat interface with expandable question flow for 24/7 automated interaction.",
    links: {
      github: "https://github.com/ashvinmanojk289/portfolio-ai-assistant"
    }
  },
  {
    title: "Multilingual Audio Translator",
    category: "AI/ML / App Dev",
    filterCategory: "ai/ml app-dev",
    icon: "headset-outline",
    description: "Complete ML pipeline covering model training through deployment: fine-tunes Wav2Vec 2.0 for speech recognition (92% accuracy) and mBART for neural machine translation, exports trained weights as JSON, then implements inference in Jupyter notebooks for reproducible audio translation on sample inputs. Enables cross-language accessibility for spoken content.",
    links: {
      github: "https://github.com/ashvinmanojk289/Multilingual-Audio-Translator"
    }
  },
  {
    title: "Weed Detection Robot",
    category: "Robotics / Computer Vision",
    filterCategory: "ai/ml robotics",
    icon: "hardware-chip-outline",
    description: "Fully autonomous robotic system integrating ROS for navigation/control with a custom-trained computer vision pipeline for real-time weed detection and classification. Combines image processing with ML inference to distinguish crops from weeds in unstructured field environments, enabling targeted precision agriculture and reducing manual labor and herbicide waste.",
    links: {
      github: "https://github.com/ashvinmanojk289/Weed-Detection-Robot"
    }
  },
  {
    title: "4-Legged Emoji Bot (Quadrobot)",
    category: "Robotics / App Dev",
    filterCategory: "robotics app-dev",
    icon: "paw-outline",
    description: "DIY 4-legged robot built with Arduino Nano featuring an OLED display that shows random emojis for interactive personality feedback. Wireless control via HC-05 Bluetooth module connects to a custom mobile app for directional movement commands (forward, backward, left, right), combining functional robotics with engaging user experience design.",
    links: {
      github: "https://github.com/ashvinmanojk289/Quadrobot"
    }
  },
  {
    title: "Simple Google PageRank Algorithm",
    category: "Algorithm / Data Science",
    filterCategory: "data-science",
    icon: "code-slash-outline",
    description: "From-scratch Python implementation of Google's PageRank algorithm demonstrating graph theory, linear algebra, and iterative convergence. Models web page importance by representing link structure as a graph and computing eigenvalue-based ranks through power iteration, simulating how search engines mathematically assess authority and relevance.",
    links: {
      github: "https://github.com/ashvinmanojk289/Simple-Google-PageRank-Algorithm"
    }
  },
  {
    title: "Language Translator",
    category: "App Dev / NLP",
    filterCategory: "app-dev ai/ml",
    icon: "language-outline",
    description: "Python-based multi-language translator with GUI (Tkinter/web form) demonstrating clean API integration patterns for AI services. Calls translation APIs (Google Translate) for language conversion, handles JSON response parsing, and provides a practical user-friendly interface showcasing frontend-backend communication fundamentals for real-world AI applications.",
    links: {
      github: "https://github.com/ashvinmanojk289/Language-Translator"
    }
  }
];

export const publications = [
  {
    title: "A Hybrid Transformer Model Approach for Precision Weed Detection",
    authors: "S. Krishnan, M. Karuppasamypandiyan, and A. Manoj",
    venue: "2025 4th International Conference on Advances in Computing, Communication, Embedded and Secure Systems (ACCESS), Ernakulam, India, 2025, pp. 1-7.",
    doi: "DOI: 10.1109/ACCESS65134.2025.11135583",
    link: "https://doi.org/10.1109/ACCESS65134.2025.11135583"
  }
];

export const moocs = [
  {
    title: "Introduction to Large Language Models (LLMs)",
    category: "NPTEL (IIT Madras) / October 2025",
    icon: "chatbubble-ellipses-outline",
    description: "Foundations of Transformer architectures, attention, pre-training, and fine-tuning pipelines for production-grade LLMs.",
    skills: "LLMs, Deep Learning, Generative AI"
  },
  {
    title: "Introduction to Software Engineering",
    category: "Coursera (IBM) / October 2025",
    icon: "school-outline",
    description: "Practical overview of SDLC, version control, modular design, and collaborative engineering workflows.",
    skills: "Software Engineering Fundamentals"
  },
  {
    title: "GenAI for UX Designers",
    category: "Coursera / April 2025",
    icon: "color-palette-outline",
    description: "Applying generative AI concepts to user flows, ideation, prototyping and UX augmentation.",
    skills: "Generative AI, UX Augmentation"
  },
  {
    title: "Generative AI Learning Path Specialization",
    category: "Coursera (Google Cloud) / April 2025",
    icon: "cloud-outline",
    description: "End-to-end GenAI: model lifecycle, responsible AI, prompt patterns, and deployment on cloud infra.",
    skills: "GenAI, Responsible AI, Cloud Deployment"
  },
  {
    title: "Prompt Engineering",
    category: "Coursera (Infosys Springboard) / April 2025",
    icon: "flash-outline",
    description: "System, user, and chain prompts; evaluation strategies to improve reliability and output quality.",
    skills: "Prompt Design, LLM Interaction"
  },
  {
    title: "Google Data Analytics",
    category: "Coursera (Google Career Cert) / July 2025",
    icon: "bar-chart-outline",
    description: "Cleaning, visualization & descriptive analysis workflows using SQL and R tooling.",
    skills: "SQL, R, Data Analysis"
  }
];

export const additionalMoocs = [
  {
    title: "Programming, Data Structures & Algorithms Using Python",
    category: "NPTEL (IIT Madras) / Sept 2021",
    icon: "logo-python",
    skills: "Python, Algorithms, Data Structures"
  },
  {
    title: "Wheeled Mobile Robots",
    category: "NPTEL (IIT Madras) / Mar 2024",
    icon: "navigate-outline",
    skills: "Mobile Robotics"
  },
  {
    title: "Automation in Production Systems & Management",
    category: "NPTEL (IIT Kharagpur) / Oct 2023",
    icon: "construct-outline",
    skills: "Industrial Automation"
  },
  {
    title: "Industrial Robots Skill Development Program",
    category: "Siemens CoE (NIT Trichy) / May 2023",
    icon: "hardware-chip-outline",
    skills: "Robot Manipulation, RPA"
  }
];

export const conversationTree = {
    'root': {
        'isAnswer': false,
        'questions': [
            { 'text': "What are his top skills?", 'next': 'skills_1' },
            { 'text': "Tell me about his projects.", 'next': 'projects_1' },
            { 'text': "What's his professional experience?", 'next': 'experience_1' },
            { 'text': "What are his achievements?", 'next': 'achievements_1' }
        ]
    },
    'skills_1': {
        'isAnswer': true,
        'answer': "Ashvin specializes in AI/ML, Deep Learning, NLP, Computer Vision, and Robotics. His tech stack includes PyTorch, TensorFlow, ROS, Python, C++, Java, JavaScript, and cloud platforms.",
        'questions': [
            { 'text': "More on AI/ML skills", 'next': 'skills_2_ml' },
            { 'text': "What programming languages?", 'next': 'skills_2_lang' },
            { 'text': "Robotics & platforms?", 'next': 'skills_2_robotics' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'projects_1': {
        'isAnswer': true,
        'answer': "His key projects include: Alzheimer's Disease Classification (Multimodal Graph Learning), Weed Detection Robot (97% accuracy), Multilingual Audio Translator (92% accuracy), and PDF Query Application.",
        'questions': [
            { 'text': "Alzheimer's Disease project?", 'next': 'projects_2_alzheimers' },
            { 'text': "How does the Weed Robot work?", 'next': 'projects_2_robot' },
            { 'text': "Tell me about the PDF Query app.", 'next': 'projects_2_pdf' },
            { 'text': "More on the Audio Translator.", 'next': 'projects_2_audio' }
        ]
    },
    'experience_1': {
        'isAnswer': true,
        'answer': "Currently a Data Science Intern at Mastermine Technologies (Aug 2025-Present). Previously worked at Sunlux Technovations (Feb-Apr 2024), SMEC Automation, and Sinro Robotics.",
        'questions': [
            { 'text': "What does he do at Mastermine?", 'next': 'experience_2_mastermine' },
            { 'text': "What did he do at Sunlux?", 'next': 'experience_2_sunlux' },
            { 'text': "What's his education?", 'next': 'education_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'skills_2_ml': {
        'isAnswer': true,
        'answer': "He's proficient in Generative AI, LLMs, Computer Vision, NLP, and Prompt Engineering. Frameworks include PyTorch, TensorFlow, Scikit-learn, Transformers, Pandas, NumPy, and Facenet.",
        'questions': [
            { 'text': "What programming languages?", 'next': 'skills_2_lang' },
            { 'text': "Robotics & platforms?", 'next': 'skills_2_robotics' },
            { 'text': "View all projects", 'next': 'projects_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'skills_2_lang': {
        'isAnswer': true,
        'answer': "Primary languages: Python, C++, C, Java, JavaScript, SQL, R. Also proficient in HTML, CSS, and Assembly language for embedded systems.",
        'questions': [
            { 'text': "More on AI/ML skills", 'next': 'skills_2_ml' },
            { 'text': "Robotics & platforms?", 'next': 'skills_2_robotics' },
            { 'text': "View all projects", 'next': 'projects_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'skills_2_robotics': {
        'isAnswer': true,
        'answer': "Experienced with ROS (Robot Operating System), Arduino, industrial automation (PLCs, SCADA, HMI), and KUKA robot control. Also skilled in Git, Linux, Streamlit, Flask, and Electron.js.",
        'questions': [
            { 'text': "More on AI/ML skills", 'next': 'skills_2_ml' },
            { 'text': "What programming languages?", 'next': 'skills_2_lang' },
            { 'text': "View robotics projects", 'next': 'projects_2_robot' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'achievements_1': {
        'isAnswer': true,
        'answer': "Published 'A Hybrid Transformer Model Approach for Precision Weed Detection' at IEEE ACCESS 2025. Completed certifications in LLMs (NPTEL IIT Madras), Google Data Analytics, GenAI (Google Cloud), and more.",
        'questions': [
            { 'text': "Tell me about the publication", 'next': 'achievements_2_publication' },
            { 'text': "What certifications does he have?", 'next': 'achievements_2_certs' },
            { 'text': "What are his skills?", 'next': 'skills_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'achievements_2_publication': {
        'isAnswer': true,
        'answer': "Co-authored with S. Krishnan and M. Karuppasamypandiyan, published in 2025 4th International Conference on ACCESS (DOI: 10.1109/ACCESS65134.2025.11135583). The paper presents a hybrid transformer model for precision weed detection.",
        'questions': [
            { 'text': "What certifications does he have?", 'next': 'achievements_2_certs' },
            { 'text': "See related project", 'next': 'projects_2_robot' },
            { 'text': "What's his experience?", 'next': 'experience_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'achievements_2_certs': {
        'isAnswer': true,
        'answer': "Recent certifications: Introduction to LLMs (NPTEL IIT Madras), Software Engineering (IBM), Google Data Analytics, GenAI for UX, GenAI Learning Path (Google Cloud), Prompt Engineering (Infosys), and more from NPTEL and Siemens.",
        'questions': [
            { 'text': "Tell me about the publication", 'next': 'achievements_2_publication' },
            { 'text': "What are his skills?", 'next': 'skills_1' },
            { 'text': "View all projects", 'next': 'projects_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'projects_2_alzheimers': {
        'isAnswer': true,
        'answer': "An ongoing deep learning project (85% complete) using multimodal graph learning to classify Cognitively Normal (CN), Mild Cognitive Impairment (MCI), and Alzheimer's Disease subjects for early diagnosis.",
        'questions': [
            { 'text': "See other projects", 'next': 'projects_1' },
            { 'text': "What's his AI/ML expertise?", 'next': 'skills_2_ml' },
            { 'text': "What's his education?", 'next': 'education_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'projects_2_robot': {
        'isAnswer': true,
        'answer': "An autonomous robot using ROS and a custom EfficientNetV2-Transformer hybrid model achieving 97% accuracy for weed detection. Enables precision agriculture and eco-friendly herbicide application.",
        'questions': [
            { 'text': "See other projects", 'next': 'projects_1' },
            { 'text': "View the publication", 'next': 'achievements_2_publication' },
            { 'text': "What's his robotics experience?", 'next': 'skills_2_robotics' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'projects_2_pdf': {
        'isAnswer': true,
        'answer': "A scalable, voice-enabled PDF query system using NLP and Streamlit that reduced information retrieval time by over 89%. Users can ask natural language questions about PDF documents.",
        'questions': [
            { 'text': "See other projects", 'next': 'projects_1' },
            { 'text': "What's his NLP expertise?", 'next': 'skills_2_ml' },
            { 'text': "What's his experience?", 'next': 'experience_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'projects_2_audio': {
        'isAnswer': true,
        'answer': "A full-stack multilingual audio translator using Wav2Vec 2.0 (92% speech recognition accuracy) and fine-tuned mBART for translation. Includes Flask UI and supports multiple languages.",
        'questions': [
            { 'text': "See other projects", 'next': 'projects_1' },
            { 'text': "What's his NLP expertise?", 'next': 'skills_2_ml' },
            { 'text': "What's his experience?", 'next': 'experience_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'experience_2_mastermine': {
        'isAnswer': true,
        'answer': "At Mastermine Technologies, he's building a cross-platform desktop app for photographers using Java Spring, React.js, and Electron.js. Also developed an async photo-matching system with RabbitMQ and a multi-agent LLM framework for data insights.",
        'questions': [
            { 'text': "See other experience", 'next': 'experience_1' },
            { 'text': "What are his AI/ML skills?", 'next': 'skills_2_ml' },
            { 'text': "View his projects", 'next': 'projects_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'experience_2_sunlux': {
        'isAnswer': true,
        'answer': "At Sunlux Technovations, he developed and debugged microprocessor programs in Assembly language for industrial automation, gaining hands-on experience with hardware-level logic and embedded solutions.",
        'questions': [
            { 'text': "See other experience", 'next': 'experience_1' },
            { 'text': "What programming languages?", 'next': 'skills_2_lang' },
            { 'text': "What's his education?", 'next': 'education_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    },
    'education_1': {
        'isAnswer': true,
        'answer': "Currently pursuing M.Tech in Computer Science & Engineering (AI/ML) at Rajagiri School of Engineering (CGPA: 9.49). Holds B.Tech (Honours) in Robotics & Automation from Adi Shankara Institute (CGPA: 9.54).",
        'questions': [
            { 'text': "What's his experience?", 'next': 'experience_1' },
            { 'text': "What are his achievements?", 'next': 'achievements_1' },
            { 'text': "What are his skills?", 'next': 'skills_1' },
            { 'text': "Back to start", 'next': 'root' }
        ]
    }
};
