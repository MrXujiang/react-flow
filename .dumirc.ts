import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'React-Flow 中文文档',
  themeConfig: {
    name: 'React-Flow',
    favicons: [
      '/favicon.png'
    ],
    logo: '/favicon.png',
    nav: [
      { title: '指南', link: '/guide' },
      { title: 'Flow工作流案例', link: '/guide/case' },
      { title: '页面制作', link: 'https://dooring.vip' },
      { title: '笔记反馈', link: 'http://doc.dooring.vip/design/doc?id=d1722395646623&uid=wep_251711700015023' },
    ],
    socialLinks: {
      github: 'https://github.com/MrXujiang/react-flow',
      zhihu: 'https://www.zhihu.com/people/build800'
    },
    footer: '中文版由 徐小夕 提供技术支持'
  },
});
