import { Link } from 'react-router-dom';
import { Comment } from './Comment';
import { useTranslation } from 'react-i18next';
import { PageShell } from './components/layout/PageShell';

export const CommentsMostPopular = () => {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <PageShell title={t('pages.popularComments')} showBack={false} contentClassName='comment-menu'>
      <div className='comments-header'>
        <p>
          <Link to='/neuste-kommentare'>{t('navTop.newest')}</Link> |{' '}
          <Link to='/beliebteste-kommentare'>
            <strong>{t('navTop.mostPopular')}</strong>
          </Link>
        </p>
      </div>
      <Comment comment='🔝🔝🔝' />
      <form onSubmit={handleSubmit}>
        <div className='comment-bar'>
          <input
            type='text'
            className='comment-input'
            placeholder={t('comments.placeholder')}
            required
          />
          <button type='submit' className='btn btn-ghost-light comment-button'>
            <img className='comment-image' src={require('./img/send-comment.svg')} alt='' />
          </button>
        </div>
      </form>
    </PageShell>
  );
};
