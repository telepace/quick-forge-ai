interface Dictionary {
  metadata: {
    home: {
      title: string;
      description: string;
    };
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    features: {
      title: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
  };
  navigation: {
    home: string;
    docs: string;
    blog: string;
    github: string;
  };
}

const en: Dictionary = {
  metadata: {
    home: {
      title: 'Quick Forge AI - Create Web Apps Faster',
      description: 'Build full-stack applications with AI assistance and ready-made templates',
    },
  },
  home: {
    hero: {
      title: 'Build Your Next Web App',
      subtitle: 'Quickly forge full-stack applications with AI assistance',
      cta: 'Get Started',
    },
    features: {
      title: 'Key Features',
      items: [
        {
          title: 'AI-Powered Templates',
          description: 'Start with intelligent templates that adapt to your project needs',
        },
        {
          title: 'Full-Stack Integration',
          description: 'Seamless frontend and backend development in one platform',
        },
        {
          title: 'Rapid Deployment',
          description: 'Go from concept to production in record time with optimized workflows',
        },
      ],
    },
  },
  navigation: {
    home: 'Home',
    docs: 'Documentation',
    blog: 'Blog',
    github: 'GitHub',
  },
};

const zh: Dictionary = {
  metadata: {
    home: {
      title: 'Quick Forge AI - 更快创建Web应用',
      description: '借助AI辅助和现成模板构建全栈应用',
    },
  },
  home: {
    hero: {
      title: '构建您的下一个Web应用',
      subtitle: '借助AI助手快速打造全栈应用',
      cta: '开始使用',
    },
    features: {
      title: '核心特性',
      items: [
        {
          title: 'AI驱动的模板',
          description: '从智能模板开始，适应您的项目需求',
        },
        {
          title: '全栈集成',
          description: '在一个平台上无缝进行前端和后端开发',
        },
        {
          title: '快速部署',
          description: '通过优化的工作流程，在创意与生产之间创造记录',
        },
      ],
    },
  },
  navigation: {
    home: '首页',
    docs: '文档',
    blog: '博客',
    github: 'GitHub',
  },
};

const dictionaries = {
  en,
  zh,
};

/**
 * Retrieves the dictionary for a given locale.
 *
 * @param {string} locale - The locale string for which to retrieve the dictionary.
 * @returns {Promise<Dictionary>} A promise that resolves to the dictionary object corresponding to the locale, or the default English dictionary if the locale is not found.
 * @throws Will throw an error if the dictionaries object is not properly defined or accessible.
 */
export async function getDictionary(locale: string): Promise<Dictionary> {
  return dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;
} 