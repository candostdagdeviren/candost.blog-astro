export const sortNotesByZettelId = (posts) =>
    posts
        .filter(({data}) => {
            return import.meta.env.PROD ? !data.draft : true
        })
        .sort(
          (a, b) =>
            parseInt(a.data.zettelId) -
            parseInt(b.data.zettelId)
        );

