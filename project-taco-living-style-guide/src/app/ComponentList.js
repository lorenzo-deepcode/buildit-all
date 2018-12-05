import React from 'react';
import Component from './Component';

const ComponentList = ({designData, filterByApproved, typeFilter = ''}) => (
  <div className="component-list">
    {
      designData
      .filter(component => {
        if (!typeFilter) return true
        if (component.type.toUpperCase() == typeFilter.toUpperCase()) {
          return true
        }
      })
      .map((component, index) => (
        <Component
          key={`component-${index}`}
          name={component.name}
          component={component.component}
          codeSnippet={component.codeSnippet}
          description={component.description}
          children={component.context.children}
          parents={component.context.parents}
        />))
    }
  </div>
)

export default ComponentList
