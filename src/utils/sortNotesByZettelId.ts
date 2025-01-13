export const sortNotesByZettelId = (posts) =>
    posts
        .filter(({data}) => {
            return import.meta.env.PROD ? !data.draft : true
        })
        .sort(
          (a, b) => {
            return a.data.zettelId.localeCompare(b.data.zettelId, 'en-US', { numeric: true });
          }
        );

