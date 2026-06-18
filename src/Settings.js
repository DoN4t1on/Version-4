import { NavbarBottom } from './NavbarBottom';
import { Link } from 'react-router-dom';

import { localStorageData, Logout } from './services/auth/localStorageData';
import { useNavigate } from 'react-router-dom';
export const Settings = () => {
  let navigate = useNavigate();
  return (
    <div>
      <div className='casual-header-div '>
        <button className='back-button-button' onClick={() => navigate(-1)}>
        
          <img
            className='back-button-icon'
            src={require('./img/arrow-left-short.svg')}
          />
        </button>
        <h4 className=' headline headline-with-back-button '> Einstellungen </h4>
      </div>

      <div className='casual-menu'>
        <a href='https://lokalspende.org/warteliste/'>
          {' '}
          <button className='btn btn-success btn-lg button'>
            Regionen Warteliste📋
          </button>{' '}
        </a>{' '}
        <br /> <br />

        <a href='https://Lokalspende.org/fragen/'>
          {' '}
          <button className='btn btn-success btn-lg button'>
            Fragen⁉️
          </button>{' '}
        </a>{' '}
        <br /> <br />
        <a href='https://Lokalspende.org/kontakt/'>
          {' '}
          <button className='btn btn-success btn-lg button'>
            Kontaktieren Sie uns 📩
          </button>{' '}
        </a>
        <br /> <br />
        <a href='https://t.me/LocalDonation'>
          {' '}
          <button className='btn btn-success btn-lg button'>
            Diskussionsgruppe 👥
          </button>{' '}
        </a>
        <br /> <br />
        <a href='https://github.com/LocalDonation-Dev'>
          {' '}
          <button className='btn btn-success btn-lg button'>
            Code 💻
          </button>{' '}
        </a>
        <br /> <br />
        <a href='https://lokalspende.org/merchandise/'>
          {' '}
          <button className='btn btn-success btn-lg button'>
            Merchandise 🛒
          </button>{' '}
        </a>
        <br /> <br />
        <a href='https://donorbox.org/localdonation'>
          {' '}
          <button className='btn btn-success btn-lg button'>
           An uns spenden 💸
          </button>{' '}
        </a>
        <div className='horzontal-rule-setting' />

        {localStorageData('_id') != '' ? (
          <button
            className='btn btn-success btn-lg button border-black'
            type='submit'
            id='Donate'
            onClick={() => {
              Logout();
              navigate('/');
            }}
          >
            Ausloggen
          </button>
        ) : (
          ''
        )}
        <br />
        <br />
        <p>
          {' '}
          <Link className='black' to='/impressum'>
            <strong>Impressum</strong>{' '}
          </Link>
        </p>

        <p>
          {' '}
          <Link className='black' to='/datenschutz'>
            <strong>Datenschutzerklärung</strong>
          </Link>
        </p>

      </div>

      <NavbarBottom
        classstart='under-navitem-unselected'
        classsearch='under-navitem-unselected'
        classactivity='under-navitem-unselected'
        classprofile='under-navitem-unselected'
      />
    </div>
  );
};
