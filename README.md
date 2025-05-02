# Reading App

A modern, internationalized reading application built with Next.js, featuring dark/light mode support and multi-language capabilities.

## 🚀 Key Features

- 📚 Modern reading interface
- 🌓 Dark/Light mode with system preference detection
- 🌐 Internationalization support (English, Portuguese)
- 📱 Responsive design
- ⚡ Fast performance with Next.js 14
- 🎨 Beautiful UI with TailwindCSS and ShadCN

## 🛠️ Tech Stack

### Core Technologies
- [Next.js 14](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

### UI Framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [ShadCN UI](https://ui.shadcn.com/) - Component library
- [Lucide Icons](https://lucide.dev/) - Icon set

## 📁 Project Structure

```
app/
├── [locale]/           # Internationalized routes
│   ├── about/         # About page
│   ├── samples/       # Sample content
│   └── page.tsx       # Home page
├── components/        # Reusable components
│   └── ThemeSwitcher.tsx
├── providers/         # Context providers
│   └── ThemeProvider.tsx
├── messages/          # Translation files
│   ├── en.json
│   └── pt.json
└── layout.tsx        # Root layout
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone [TODO: Add your repository URL]
cd reading-app
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 🌐 Internationalization

### How Locales Work
The application uses the `[locale]` directory structure for internationalized routing. Each page is automatically available in all supported languages.

### Adding New Languages
1. Create a new translation file in `messages/` (e.g., `fr.json`)
2. Add the new locale to the supported languages configuration
3. Create corresponding translations

### Translation Files Structure
```json
{
  "ThemeSwitcher": {
    "toggleTheme": "Toggle theme",
    "light": "Light mode",
    "dark": "Dark mode",
    "system": "System preference"
  }
}
```

## 🌓 Theme System

### Dark/Light Mode Implementation
The theme system uses `next-themes` for seamless theme switching with the following features:
- System preference detection
- Persistent user preferences
- Smooth transitions
- No flash on page load

### ThemeProvider Configuration
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

## 🛠️ Development Guide

### Creating New Pages
1. Create a new directory in `app/[locale]/`
2. Add a `page.tsx` file
3. Use the `useTranslations` hook for internationalization

### Adding Components
1. Create new components in `app/components/`
2. Follow the existing component patterns
3. Include proper TypeScript types and documentation

### Style Guidelines
- Use TailwindCSS utility classes
- Follow ShadCN component patterns
- Maintain consistent spacing and typography

## 🚀 Deployment

### Vercel Configuration
1. Connect your repository to Vercel
2. Configure build settings:
```bash
npm run build
```

3. Set environment variables:
```
NEXT_PUBLIC_LOCALE=en
```

### i18n Deployment Considerations
- Ensure all translation files are included in the build
- Configure proper redirects for locale detection
- Set up proper caching headers for static assets

## ⚠️ Troubleshooting

### Common Issues
- **Theme Flashing**: Ensure `suppressHydrationWarning` is set on the HTML element
- **i18n Routing**: Check locale configuration in `next.config.js`
- **Build Errors**: Verify all required environment variables are set

### Known Limitations
- [TODO: Add any known limitations]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Include proper documentation

## 📄 License

[TODO: Add your license]

## 🔍 Areas for Improvement

1. **Performance Optimization**
   - Implement image optimization
   - Add caching strategies
   - Optimize bundle size

2. **Testing**
   - Add unit tests
   - Implement E2E testing
   - Add performance monitoring

3. **Documentation**
   - Add API documentation
   - Create component documentation
   - Include contribution guidelines

## ❓ Need Help?

If you encounter any issues or need assistance:
1. Check the troubleshooting section
2. Open an issue in the repository
3. Contact the maintainers

[TODO: Add contact information] 