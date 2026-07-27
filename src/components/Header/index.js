import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavbarTop } from '../../NavbarTop';
import { getHeaderTabState } from '../layout/navState';

function Header() {
  const { pathname } = useLocation();
  const tabState = getHeaderTabState(pathname);

  return <NavbarTop {...tabState} />;
}

export default Header;
