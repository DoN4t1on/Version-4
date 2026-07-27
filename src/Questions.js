import { PageShell } from './components/layout/PageShell';

export const Questions = () => {
  return (
    <PageShell title='Fragen'>
      <div className='no-data'>
        <p>Du hast eine Frage an die Community?</p>
        <a href='https://Lokalspende.org/fragen/'>
          <button className='btn btn-success btn-lg button'>Frage stellen</button>
        </a>
      </div>
    </PageShell>
  );
};
