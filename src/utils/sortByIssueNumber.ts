export const sortPostsByIssueNumberDec = (posts) =>
    posts
        .filter(({data}) => {
            return import.meta.env.PROD ? !data.draft : true
        })
        .sort((a, b) => b.data.issueNumber - a.data.issueNumber);
