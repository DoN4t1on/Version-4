import React from 'react';
import { Link } from 'react-router-dom';

export const NavbarTop = (props) => {

  const selectedClass = 'tab-bar-selected';
  const unselectedClass = 'tab-bar-unselected';

  return (
    <div id='header'>
      <div className='header-row'>
        <div>
          <img src={require('./img/localsuggestion_icon.svg')} />
        </div>
        <div>
          <h2 style={{ marginBottom: 0, marginLeft: 10 }}>LOKALESPENDE</h2>
        </div>
      </div>
      <h1>Lokale Projekte in Köln</h1>
      <div>
        <input className='header-search-input' placeholder='Suche' />
      </div>
      <div className='filters'>
        <div className='tab-bar-menu small-headlines'>
          <Link className={props.suggestions ? selectedClass : unselectedClass} to='/'>
            Anträge
          </Link>
          <Link className={props.crowdfunding ? selectedClass : unselectedClass} to='/crowdfunding'>
            Crowdfunding
          </Link>
        </div>
        <div className='tab-bar-menu small-headlines '>
          <Link to='/' className={props.suggestions_active ? selectedClass : unselectedClass}>
            Aktiv
          </Link>
          <Link to='/antrage-akzeptiert' className={props.suggestions_accepted ? selectedClass : unselectedClass}>
            Akzeptiert
          </Link>
          <Link to='/antrage-abgelehnt' className={props.suggestions_denied ? selectedClass : unselectedClass}>
            Abgelehnt
          </Link>
        </div>
        <div className='tab-bar-menu small-headlines'>
          <Link to='/' className={props.newest ? selectedClass : unselectedClass}>
            Neuste
          </Link>
          <Link to='/antrage-aktiv-am-beliebtesten' className={props.favourites ? selectedClass : unselectedClass}>
            Beliebtest
          </Link>
        </div>
      </div>
    </div>
  );
}
