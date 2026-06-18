import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { NavbarBottom } from './NavbarBottom';
import Header from './components/Header';

export const SuggestionsAcceptedMostPopular = () => {
  useEffect(() => {
    ReactGA.initialize('G-L7KNR2MM11');
    ReactGA.send('/');
  }, []);

  return (
    <div>
      <Header suggestions={true} suggestions_accepted={true} suggestions_favourites={true} />
      <div className='campaigns no-data'>
        In diesem Gebiet befinden sich noch keine akzeptierten Crowdfundingkampagnen.
        Wir sind bereits im Dialog mit der lokalen Regierung. Gerne können Sie diese
        auch persönlich kontaktieren.
      </div>
      <NavbarBottom
        classstart='under-navitem-selected'
        classsearch='under-navitem-unselected'
        classactivity='under-navitem-unselected'
        classprofile='under-navitem-unselected'
      />
    </div>
  );
};
