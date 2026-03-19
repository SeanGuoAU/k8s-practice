'use client';

import { Box, Container, styled } from '@mui/material';

import Footer from '../main-layout/Footer';
import Navbar from '../main-layout/Navbar';

const PageWrapper = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

const GradientNavbar = styled(Navbar)({
  /* 1️⃣ Clear background colors on itself and descendants (including inline styles via !important). */
  '& .MuiAppBar-root, & .MuiAppBar-root *': {
    backgroundColor: 'transparent !important',
  },

  /* 2️⃣ Render a gradient using ::before at the bottom layer. */
  '& .MuiAppBar-root': {
    position: 'relative', // Reference for absolute positioning of ::before
    boxShadow: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      zIndex: -1, // Below all content
      background: 'linear-gradient(180deg,#f8fff3 0%,#ffffff 100%)',
    },
  },
});

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageWrapper>
      <GradientNavbar variant="green" />
      <Container component="main" sx={{ flex: 1 }}>
        {children}
      </Container>
      <Footer />
    </PageWrapper>
  );
}
