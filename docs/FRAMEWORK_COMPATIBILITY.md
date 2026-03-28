# Framework Compatibility Notes

## React 19 + Next.js 16

This project uses bleeding-edge versions:
- **React**: 19.0.0
- **Next.js**: 16.0.3

### Known Considerations

1. **React 19 is currently stable** but was recently released (December 2024)
2. **Next.js 16** adds support for React 19 and includes Turbopack improvements
3. Some third-party libraries may not yet fully support React 19

### Potential Issues & Mitigations

- **Type incompatibilities**: Some `@types/react` packages may lag behind React 19
  - Current `@types/react@19` should be compatible
  
- **Third-party component libraries**: May encounter runtime warnings or type errors
  - Radix UI components used here are generally well-maintained
  - Framer Motion v11.16.0 supports React 19

- **Hydration mismatches**: More strictly detected in React 19
  - Resolved by moving Framer Motion to client components (see shell components)

### Recommended Actions

1. **Monitor for updates**: Keep dependencies current as ecosystem catches up
2. **Test key flows regularly**: Sign-in, navigation, AI features, optimizer, dashboard
3. **Watch for console warnings**: React 19 may surface previously hidden issues
4. **Consider pinning versions**: If stability issues arise, may need to lock to React 18.x + Next.js 15.x

### Fallback Strategy

If critical runtime issues occur:
```bash
npm install react@18.3.1 react-dom@18.3.1 next@15.3.5
npm audit fix
```

Then test all features thoroughly before deploying.

### Current Status

As of implementation (Nov 2025):
- ✅ Development server runs without errors
- ✅ Authentication flow works with Clerk
- ✅ Client/server boundary properly configured
- ✅ Framer Motion animations isolated to client components
- ⚠️ Long-term production stability to be validated with real usage

## Dependencies Requiring Attention

- **recharts**: Newly added for dashboard charts (v2.12.7)
- **Clerk**: Using latest v6.9.3 (should be stable with React 19)
- **Prisma**: v6.1.0 (database layer, framework-agnostic)
- **Groq AI SDK**: v1.0.9 (new package, monitor for updates)
