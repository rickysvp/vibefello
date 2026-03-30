import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { VibeLogo } from '../components/common/VibeLogo';
import { FAQItem } from '../components/common/FAQItem';
import { Footer } from '../components/layout/Footer';

// Smoke tests - Basic component rendering
describe('Smoke Tests', () => {
  describe('Components', () => {
    it('should render VibeLogo', () => {
      render(<VibeLogo />);
      expect(screen.getByAltText('VibeFello')).toBeInTheDocument();
    });

    it('should render FAQItem', () => {
      const faq = { q: 'Test Question', a: 'Test Answer' };
      render(<FAQItem faq={faq} />);
      expect(screen.getByText('Test Question')).toBeInTheDocument();
    });

    it('should render Footer', () => {
      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('AuthProvider', () => {
    it('should render children without crashing', () => {
      const TestChild = () => <div data-testid="test-child">Test</div>;
      
      render(
        <AuthProvider>
          <TestChild />
        </AuthProvider>
      );
      
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });
});

// API Configuration Test
describe('API Configuration', () => {
  it('should have Supabase URL configured', () => {
    expect(import.meta.env.VITE_SUPABASE_URL).toBeDefined();
    expect(import.meta.env.VITE_SUPABASE_URL).toContain('supabase.co');
  });

  it('should have Supabase Anon Key configured', () => {
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBeDefined();
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY.length).toBeGreaterThan(10);
  });
});

// Build Verification
describe('Build Verification', () => {
  it('should have correct app version', () => {
    const packageJson = require('../../package.json');
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(packageJson.name).toBe('vibefello');
  });

  it('should have required dependencies', () => {
    const packageJson = require('../../package.json');
    expect(packageJson.dependencies).toHaveProperty('@supabase/supabase-js');
    expect(packageJson.dependencies).toHaveProperty('react');
    expect(packageJson.dependencies).toHaveProperty('react-dom');
  });
});
