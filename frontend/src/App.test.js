import { render, screen } from '@testing-library/react';
import HeroSection from './Components/portfolio/HeroSection';
import SkillSection from './Components/portfolio/SkillSection';
import ExperienceSection from './Components/portfolio/ExperienceSection';
import ContactSection from './Components/portfolio/ContactSection';

test('renders hero section with name', () => {
  render(<HeroSection onScrollToNext={() => {}} />);
  const nameElement = screen.getByText(/Om Katiyar/i);
  expect(nameElement).toBeInTheDocument();
});

test('renders skills section', () => {
  render(<SkillSection />);
  const skillsElement = screen.getByText(/Technical Skills/i);
  expect(skillsElement).toBeInTheDocument();
});

test('renders experience section', () => {
  render(<ExperienceSection />);
  const experienceElement = screen.getByText(/Work Experience/i);
  expect(experienceElement).toBeInTheDocument();
});

test('renders contact section', () => {
  render(<ContactSection />);
  const contactElement = screen.getByText(/Let's Connect/i);
  expect(contactElement).toBeInTheDocument();
});
