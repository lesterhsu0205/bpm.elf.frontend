// components/Header.js
import { Navbar, Container, Nav } from 'react-bootstrap'
import Link from 'next/link'

const Header = () => (
  <Navbar
    bg="dark"
    variant="dark"
    expand="lg"
    fixed="top"
    className="header-custom"
  >
    <Container fluid className="p-0">
      <Navbar.Brand as={Link} href="/" style={{display: 'flex', alignItems: 'center'}}>
        <img src="/bpm-elf/magician-hat512.png" alt="BPM ELF Logo" style={{height: '32px', marginRight: '8px'}} />
        BPM ELF
      </Navbar.Brand>
      {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} href="/">Home</Nav.Link>
          <Nav.Link as={Link} href="/about">About</Nav.Link>
        </Nav>
      </Navbar.Collapse> */}
    </Container>
  </Navbar>
)

export default Header
