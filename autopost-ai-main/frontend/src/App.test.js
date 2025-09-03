import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AutoPost AI title in Navbar', () => {
  render(<App />);
  // Check for the "AutoPost AI" text which is part of the Navbar component
  const titleElement = screen.getByText(/AutoPost AI/i);
  expect(titleElement).toBeInTheDocument();
});

// You might add more tests here, for example:
// test('renders Dashboard on default route', () => {
//   render(<App />);
//   const dashboardHeading = screen.getByText(/Dashboard Overview/i);
//   expect(dashboardHeading).toBeInTheDocument();
// });

// test('navigates to Generate Post page', async () => {
//   render(<App />);
//   const generateLink = screen.getByText(/Generate Post/i);
//   fireEvent.click(generateLink);
//   const generateHeading = await screen.findByText(/Generate New Post/i);
//   expect(generateHeading).toBeInTheDocument();
// });
