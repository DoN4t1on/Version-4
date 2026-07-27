import React from 'react';
import { AppPage } from './AppPage';
import { PageHeader } from './PageHeader';
import { NavbarBottom } from '../../NavbarBottom';

export function PageShell({
  title,
  children,
  showBack = true,
  rightAction = null,
  onBack,
  contentClassName = 'casual-menu',
}) {
  return (
    <AppPage>
      <PageHeader
        title={title}
        showBack={showBack}
        rightAction={rightAction}
        onBack={onBack}
      />
      <div className={contentClassName}>{children}</div>
      <NavbarBottom />
    </AppPage>
  );
}
