import React, { createElement } from 'react';
import '@algolia/autocomplete-theme-classic';
import { Link } from '@/i18n/routing';

export function ProductItem({ hit, components,href }) {
  return (
    <div  className="aa-ItemLink" style={{'zIndex':999999,position:"relative"}}>
      <div className="aa-ItemContent" >
        <div className="aa-ItemTitle">
          <components.ReverseHighlight hit={hit} attribute="name" />
        </div>
      </div>
    </div>
  );
}
