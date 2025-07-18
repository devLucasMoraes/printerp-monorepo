import { Box, Container, styled } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router'

import OrganizationBreadcrumbs from './breadcrumbs/OrganizationBreadcrumbs'
import Header from './header/Header'
import Sidebar from './sidebar/Sidebar'

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}))

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
}))

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  console.log('renderizou fulllayout')
  return (
    <MainWrapper className="main-wrapper">
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper">
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        <Header
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          toggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Container
          sx={{
            paddingTop: '20px',
            maxWidth: '1200px',
          }}
        >
          <OrganizationBreadcrumbs />
          {/* ------------------------------------------- */}
          {/* Page Route */}
          {/* ------------------------------------------- */}
          <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>
            <Outlet />
          </Box>
          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
      </PageWrapper>
    </MainWrapper>
  )
}

export default FullLayout
