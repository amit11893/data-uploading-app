
export async function shortenUrl(url) {
    const body = {
        url: url,
        domain: "tiny.one"
    }

    fetch(`https://api.tinyurl.com/create`, {
        method: `POST`,
        headers: {
            accept: `application/json`,
            authorization: `Bearer r72hQFM5IV1m0FdyKKvU4lHB0GWpesttDUJltmA7LTbP8iqFTUETqa4fdQEM`,
            'content-type': `application/json`,
        },
        body: JSON.stringify(body)
    }).then(response => {
        if (response.status !== 200) return url;
        return response.json()
    }).catch(() => url)
}

