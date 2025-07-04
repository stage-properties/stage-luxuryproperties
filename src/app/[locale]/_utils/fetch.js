const fetchAPI = async (endpoint, cacheType) => {
    let customConfig = filterHeader(cacheType);
    try {
        let res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        customConfig
        );
        let data = await res.json();
        return data;
    } catch (err) {
        return err.message;
    }
};

const filterHeader = (type) => {
    let customConfig;
    if (type === "cache") {
        customConfig = {
        headers: {
            "Content-Type": "application/json",
            d_acp: "true",
            dev_id: "true",
        },
        cache: "force-cache",
        };
    } else if (type === "noCache") {
        customConfig = {
        headers: {
            "Content-Type": "application/json",
            d_acp: "true",
            dev_id: "true",
        },
        cache: "no-store",
        };
    } else if (type === "revalidate") {
        customConfig = {
        headers: {
            "Content-Type": "application/json",
            d_acp: "true",
            dev_id: "true",
        },
        next: { revalidate: 60 },
        };
    }

    return customConfig;
};

module.exports = {fetchAPI}