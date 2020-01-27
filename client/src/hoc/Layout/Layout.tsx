import React from 'react';

import './Layout.module.scss';

const Layout: React.FC = props => {
  return (
    <>
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
