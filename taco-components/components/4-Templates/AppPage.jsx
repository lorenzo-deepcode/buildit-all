import React, { Component } from 'react';
import slugify from 'slugify';
import { Link } from 'react-router';
import Nav from '../components/Nav';
import ViewTitle from '../components/ViewTitle';

const AppPage = ({ pageTitle = '', pageContent = '', pageClass = undefined }) => {
  if (!pageClass) {
    pageClass = slugify(pageTitle);
  }
  pageClass = `view ${pageClass}`;

  return (
    <div className={pageClass}>
      <ViewTitle title={pageTitle} />
      {pageContent}
      <Nav />
    </div>
  );
};

export default AppPage;
